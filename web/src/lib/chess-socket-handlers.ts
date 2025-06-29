import { Server, Socket } from "socket.io";
import { Chess } from "chess.js";

interface ChessRoom {
  roomId: string;
  fen: string;
  moves: { from: string; to: string; san: string; timestamp: string }[];
  timeControl: string;
  rated: boolean;
  status: string;
  chessPlayers: {
    _id: string;
    username: string;
    role: string;
    color: "white" | "black";
  }[];
}

interface ChessUser {
  _id: string;
  username: string;
  isPlayer: boolean;
  socketId: string;
}

interface ChessRoomState {
  users: Map<string, ChessUser>; // socketId -> user
  game: Chess;
  roomState: ChessRoom;
}

const rooms = new Map<string, ChessRoomState>();

export function setupChessSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Handle joining a chess room
    socket.on(
      "joinChessRoom",
      (
        {
          roomId,
          userId,
          username,
          isPlayer,
        }: {
          roomId: string;
          userId: string;
          username: string;
          isPlayer: boolean;
        },
        callback: (spectators: { _id: string; username: string }[]) => void
      ) => {
        if (!roomId) return;

        // Join the socket room
        socket.join(roomId);

        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
          const initialGame = new Chess();
          rooms.set(roomId, {
            users: new Map(),
            game: initialGame,
            roomState: {
              roomId,
              fen: initialGame.fen(),
              moves: [],
              timeControl: "5+0",
              rated: false,
              status: "playing",
              chessPlayers: [],
            },
          });
        }

        const room = rooms.get(roomId)!;

        // Add user to room
        room.users.set(socket.id, {
          _id: userId,
          username,
          isPlayer,
          socketId: socket.id,
        });

        // Send current room state to the user
        socket.emit("roomState", room.roomState);

        // Notify others about the new spectator
        const spectators = Array.from(room.users.values())
          .filter((user) => !user.isPlayer)
          .map(({ _id, username }) => ({ _id, username }));

        io.to(roomId).emit("spectatorsUpdate", spectators);

        // Send current spectators to the new user
        callback(spectators);
      }
    );

    // Handle chess moves
    socket.on(
      "chessMove",
      ({
        roomId,
        from,
        to,
        san,
        fen,
      }: {
        roomId: string;
        from: string;
        to: string;
        san: string;
        fen: string;
        userId: string;
        username: string;
      }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        try {
          // Update the game state
          room.game.move({
            from,
            to,
            promotion: "q", // Always promote to queen for simplicity
          });

          // Update room state
          room.roomState.fen = fen;
          room.roomState.moves.push({
            from,
            to,
            san,
            timestamp: new Date().toISOString(),
          });

          // Broadcast the updated state to all clients in the room
          io.to(roomId).emit("chessMove", room.roomState);
        } catch (error) {
          console.error("Invalid move:", error);
          // Send error back to the sender
          socket.emit("moveError", { error: "Invalid move" });
        }
      }
    );

    // Handle user role updates (spectator -> player)
    socket.on(
      "updateUserRole",
      ({
        roomId,
        userId,
        isPlayer,
      }: {
        roomId: string;
        userId: string;
        isPlayer: boolean;
      }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        // Find and update the user
        for (const user of room.users.values()) {
          if (user._id === userId) {
            user.isPlayer = isPlayer;
            break;
          }
        }

        // Update spectators list
        const spectators = Array.from(room.users.values())
          .filter((user) => !user.isPlayer)
          .map(({ _id, username }) => ({ _id, username }));

        io.to(roomId).emit("spectatorsUpdate", spectators);
      }
    );

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);

      // Find and remove the user from all rooms
      for (const [roomId, room] of rooms.entries()) {
        if (room.users.has(socket.id)) {
          room.users.delete(socket.id);

          // If no users left, clean up the room
          if (room.users.size === 0) {
            rooms.delete(roomId);
          } else {
            // Update spectators list
            const spectators = Array.from(room.users.values())
              .filter((user) => !user.isPlayer)
              .map(({ _id, username }) => ({ _id, username }));

            io.to(roomId).emit("spectatorsUpdate", spectators);
          }

          break;
        }
      }
    });
  });
}

export function getChessRoom(roomId: string): ChessRoomState | undefined {
  return rooms.get(roomId);
}
