import { useEffect, useCallback } from "react";
import { socket } from "@/lib/socket";

// Minimal ChessRoom type for socket events
export type ChessRoom = {
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
};

export function useChessSocket(
  roomId: string,
  onMoveReceived: (roomState: ChessRoom) => void
) {
  // Join room and set up listeners
  useEffect(() => {
    if (!roomId) return;
    if (!socket.connected) socket.connect();
    socket.emit("joinChessRoom", roomId);

    const handleMove = (roomState: ChessRoom) => {
      onMoveReceived(roomState);
    };
    socket.on("chessMove", handleMove);

    return () => {
      socket.off("chessMove", handleMove);
      // Optionally leave room or disconnect if needed
      // socket.emit("leaveChessRoom", roomId);
      // socket.disconnect(); // Only if you want to fully disconnect
    };
  }, [roomId, onMoveReceived]);

  // Send a move
  const sendMove = useCallback(
    (move: { from: string; to: string; san: string; fen: string }) => {
      if (!roomId) return;
      socket.emit("chessMove", { roomId, ...move });
    },
    [roomId]
  );

  return { sendMove };
}
