import { useEffect, useCallback, useState } from "react";
import { socket } from "@/lib/socket";
import { useAuth } from "@/contexts/auth-context";

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

export type Spectator = {
  _id: string;
  username: string;
  avatar?: string;
};

export function useChessSocket(
  roomId: string,
  onMoveReceived: (roomState: ChessRoom) => void
) {
  const { user } = useAuth();
  const [spectators, setSpectators] = useState<Spectator[]>([]);

  // Filter out players and remove duplicate spectators
  const filterAndDedupeSpectators = useCallback(
    (spectators: Spectator[] = [], players: string[] = []): Spectator[] => {
      const uniqueSpectators = new Map<string, Spectator>();

      spectators.forEach((spectator) => {
        // Skip if this is a player
        if (players.includes(spectator._id)) return;
        // Keep the first occurrence of each spectator
        if (!uniqueSpectators.has(spectator._id)) {
          uniqueSpectators.set(spectator._id, spectator);
        }
      });

      return Array.from(uniqueSpectators.values());
    },
    []
  );

  // Join room and set up listeners
  useEffect(() => {
    if (!roomId) return;
    if (!socket.connected) socket.connect();

    let isMounted = true;

    const handleMove = (roomState: ChessRoom) => {
      if (isMounted) {
        onMoveReceived(roomState);
      }
    };

    const handleSpectatorsUpdate = (
      data: {
        spectators: Spectator[];
        players: string[];
      } = { spectators: [], players: [] }
    ) => {
      if (isMounted && data) {
        const filteredSpectators = filterAndDedupeSpectators(
          data.spectators || [],
          data.players || []
        );
        setSpectators(filteredSpectators);
      }
    };

    const handleError = (error: { error: string }) => {
      console.error("Socket error:", error);
    };

    // Set up event listeners
    socket.on("chessMove", handleMove);
    socket.on("spectatorsUpdate", handleSpectatorsUpdate);
    socket.on("chessError", handleError);

    // Join the room with user info
    const userData = {
      roomId,
      userId: user?._id || "anonymous",
      username: user?.username || "Anonymous",
      isPlayer: false, // Will be set to true when making a move
    };

    // Join the room and get initial data
    socket.emit(
      "joinChessRoom",
      userData,
      (
        data: {
          spectators: Spectator[];
          players: string[];
        } = { spectators: [], players: [] }
      ) => {
        if (isMounted && data) {
          const filteredSpectators = filterAndDedupeSpectators(
            data.spectators || [],
            data.players || []
          );
          setSpectators(filteredSpectators);
        }
      }
    );

    // Initial spectators fetch (as fallback)
    const fetchSpectators = () => {
      socket.emit(
        "getSpectators",
        roomId,
        (
          data: {
            spectators: Spectator[];
            players: string[];
          } = { spectators: [], players: [] }
        ) => {
          if (isMounted && data) {
            const filteredSpectators = filterAndDedupeSpectators(
              data.spectators || [],
              data.players || []
            );
            setSpectators(filteredSpectators);
          }
        }
      );
    };

    // Set up periodic refresh (every 30 seconds)
    const refreshInterval = setInterval(fetchSpectators, 30000);

    // Initial fetch
    fetchSpectators();

    return () => {
      isMounted = false;
      clearInterval(refreshInterval);

      // Clean up event listeners
      socket.off("chessMove", handleMove);
      socket.off("spectatorsUpdate", handleSpectatorsUpdate);
      socket.off("chessError", handleError);

      // Leave the room when component unmounts
      if (socket.connected) {
        socket.emit("leaveChessRoom", {
          roomId,
          userId: user?._id,
        });
      }
    };
  }, [
    roomId,
    onMoveReceived,
    user?._id,
    user?.username,
    filterAndDedupeSpectators,
  ]);

  // Send a move
  const sendMove = useCallback(
    (move: { from: string; to: string; san: string; fen: string }) => {
      if (!roomId || !socket.connected) return false;

      try {
        const moveData = {
          roomId,
          ...move,
          userId: user?._id || "anonymous",
          username: user?.username || "Anonymous",
        };

        socket.emit("chessMove", moveData);

        // Update user role to player after first move if not already a player
        if (user?._id) {
          socket.emit("updateUserRole", {
            roomId,
            userId: user._id,
            isPlayer: true,
          });
        }

        return true;
      } catch (error) {
        console.error("Error sending move:", error);
        return false;
      }
    },
    [roomId, user?._id, user?.username]
  );

  return { sendMove, spectators };
}
