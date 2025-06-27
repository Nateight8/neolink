// Socket.IO chess event handlers
export function registerChessSocketHandlers(io, socket) {
  // Join a chess room
  socket.on("joinChessRoom", async (roomId) => {
    try {
      socket.join(roomId);
    } catch (err) {
      console.error("[Socket.IO] joinChessRoom error:", err);
      socket.emit("chessError", { error: "Failed to join chess room." });
    }
  });

  // Handle chess moves
  socket.on("chessMove", async ({ roomId, from, to, san, fen }) => {
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
