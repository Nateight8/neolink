// In-memory store for room spectators
const roomSpectators = new Map();

// Helper function to get unique spectators and players from a room
function getRoomUsers(room) {
  if (!room) return { spectators: [], players: [] };
  
  const users = Array.from(room.values());
  const uniqueSpectators = [];
  const seenSpectatorIds = new Set();
  const players = [];
  
  users.forEach(user => {
    if (user.isPlayer) {
      // Track unique player IDs
      if (!players.includes(user.userId)) {
        players.push(user.userId);
      }
    } else if (!seenSpectatorIds.has(user.userId)) {
      // Track unique spectator IDs
      seenSpectatorIds.add(user.userId);
      uniqueSpectators.push({
        _id: user.userId,
        username: user.username
      });
    }
  });
  
  return { spectators: uniqueSpectators, players };
}

// Socket.IO chess event handlers
export function registerChessSocketHandlers(io, socket) {
  // Join a chess room
  socket.on("joinChessRoom", async ({ roomId, userId, username, isPlayer = false }, callback) => {
    try {
      if (!roomId) {
        throw new Error("Room ID is required");
      }

      // Store user data in the socket
      socket.userData = { userId, username, isPlayer };
      socket.roomId = roomId;
      
      // Join the room
      await socket.join(roomId);
      
      // Initialize room in spectators map if it doesn't exist
      if (!roomSpectators.has(roomId)) {
        roomSpectators.set(roomId, new Map());
      }
      
      const room = roomSpectators.get(roomId);
      
      // Add/update user in the room
      room.set(socket.id, { userId, username, isPlayer });
      
      // Get current room state
      const ChessRoom = (await import("../models/chessRoom.model.js")).default;
      const roomData = await ChessRoom.findOne({ roomId });
      
      // Get unique spectators and players
      const { spectators, players } = getRoomUsers(room);
      
      // Send room state to the joining client
      if (roomData) {
        socket.emit("roomState", roomData.toObject());
      }
      
      // Send initial data to the joining client
      if (typeof callback === 'function') {
        callback({ spectators, players });
      }
      
      // Broadcast updated user list to all in the room
      io.to(roomId).emit('spectatorsUpdate', { spectators, players });
      
    } catch (error) {
      console.error('[Socket.IO] Error joining chess room:', error);
      socket.emit('chessError', { error: 'Failed to join room' });
      if (typeof callback === 'function') {
        callback({ spectators: [], players: [] });
      }
    }
  });
  
  // Handle get spectators request
  socket.on('getSpectators', (roomId, callback) => {
    try {
      if (!roomId) {
        return callback({ spectators: [], players: [] });
      }
      
      const room = roomSpectators.get(roomId);
      const { spectators, players } = getRoomUsers(room);
      
      callback({ spectators, players });
      
    } catch (error) {
      console.error('[Socket.IO] Error getting spectators:', error);
      callback({ spectators: [], players: [] });
    }
  });
  
  // Handle user role update (spectator to player)
  socket.on('updateUserRole', async ({ roomId, userId, isPlayer }) => {
    try {
      if (!roomId || !userId) {
        throw new Error('Room ID and User ID are required');
      }
      
      const room = roomSpectators.get(roomId);
      if (!room) return;
      
      // Find and update the user's role
      for (const [socketId, user] of room.entries()) {
        if (user.userId === userId) {
          room.set(socketId, { ...user, isPlayer });
        }
      }
      
      // Get updated user lists
      const { spectators, players } = getRoomUsers(room);
      
      // Broadcast updated lists to all in the room
      io.to(roomId).emit('spectatorsUpdate', { spectators, players });
      
    } catch (error) {
      console.error('[Socket.IO] Error updating user role:', error);
      socket.emit('chessError', { error: 'Failed to update user role' });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    try {
      const roomId = socket.roomId;
      if (!roomId) return;
      
      const room = roomSpectators.get(roomId);
      if (!room) return;
      
      // Remove user from room
      room.delete(socket.id);
      
      // If room is empty, clean up
      if (room.size === 0) {
        roomSpectators.delete(roomId);
      } else {
        // Get updated user lists
        const { spectators, players } = getRoomUsers(room);
        
        // Broadcast updated lists to remaining users
        io.to(roomId).emit('spectatorsUpdate', { spectators, players });
      }
    } catch (error) {
      console.error('[Socket.IO] Disconnect error:', error);
    }
  });

  // Handle chess moves
  socket.on("chessMove", async ({ roomId, from, to, san, fen, userId, username }) => {
    try {
      if (!from || !to || !san || !fen) {
        socket.emit("chessError", { error: "Missing move data." });
        return;
      }
      const ChessRoom = (await import("../models/chessRoom.model.js")).default;
      const room = await ChessRoom.findOne({ roomId }).populate({
        path: "chessPlayers.user",
        select: "_id username",
      });
      if (!room) {
        socket.emit("chessError", { error: "Room not found." });
        return;
      }
      room.moves.push({ from, to, san, timestamp: new Date() });
      if (room.moves.length === 1) {
        room.status = "ongoing";
      }
      room.fen = fen;
      await room.save();
      await room.populate({
        path: "chessPlayers.user",
        select: "_id username",
      });
      const roomObj = room.toObject();
      io.to(roomId).emit("chessMove", roomObj);
    } catch (err) {
      console.error("[Socket.IO] chessMove error:", err);
      socket.emit("chessError", { error: "Failed to make move." });
    }
  });
}
