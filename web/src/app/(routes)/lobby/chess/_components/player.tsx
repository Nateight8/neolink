import { motion } from "motion/react";
import { useMemo } from "react";

export interface PlayerData {
  id: string;
  username: string;
  avatar?: string;
  rating: number;
}

interface PlayerProps {
  player: PlayerData;
  isCurrentPlayer: boolean;
  timeRemaining: number;
  capturedPieces: string[];
  color: "white" | "black";
  isLoggedIn?: boolean;
}

export default function Player({
  player,
  isCurrentPlayer,
  timeRemaining,
  capturedPieces,
  color,
  isLoggedIn,
}: PlayerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const borderColor =
    color === "black" ? "border-fuchsia-500" : "border-cyan-500";
  const textColor = color === "black" ? "text-fuchsia-400" : "text-cyan-400";
  const bgGradient =
    color === "black"
      ? "from-fuchsia-500/30 to-fuchsia-500/10"
      : "from-cyan-500/30 to-cyan-500/10";

  // Define all possible pieces in the correct order (pawn, knight, bishop, rook, queen, king)
  const pieceDefinitions = useMemo(
    () =>
      ({
        // Black pieces (captured by white)
        p: { symbol: "♟", max: 8 },
        n: { symbol: "♞", max: 2 },
        b: { symbol: "♝", max: 2 },
        r: { symbol: "♜", max: 2 },
        q: { symbol: "♛", max: 1 },
        k: { symbol: "♚", max: 1 },
        // White pieces (captured by black)
        P: { symbol: "♙", max: 8 },
        N: { symbol: "♘", max: 2 },
        B: { symbol: "♗", max: 2 },
        R: { symbol: "♖", max: 2 },
        Q: { symbol: "♕", max: 1 },
        K: { symbol: "♔", max: 1 },
      } as const),
    []
  );

  // Define piece type based on the definitions
  type PieceKey = keyof typeof pieceDefinitions;
  type Color = "white" | "black";

  // Get the pieces that this player can capture (opposite color)
  const capturedPieceTypes = useMemo<Record<Color, PieceKey[]>>(
    () => ({
      white: ["p", "n", "b", "r", "q", "k"], // Black pieces (captured by white)
      black: ["P", "N", "B", "R", "Q", "K"], // White pieces (captured by black)
    }),
    []
  );

  // Filter pieces based on player color
  const allPieces = useMemo(() => {
    const pieceKeys =
      color === "white"
        ? capturedPieceTypes.white // White captures black pieces
        : capturedPieceTypes.black; // Black captures white pieces

    return pieceKeys.map((key) => ({
      key,
      symbol: pieceDefinitions[key as PieceKey].symbol,
      max: pieceDefinitions[key as PieceKey].max,
    }));
  }, [color, pieceDefinitions, capturedPieceTypes]);

  // Create a count of each captured piece with memoization
  const capturedCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    // Get the piece types this player can capture (opposite color pieces)
    const validPieces =
      color === "white" ? capturedPieceTypes.white : capturedPieceTypes.black;

    // Initialize counts for all possible pieces
    validPieces.forEach((piece) => {
      counts[piece] = 0;
    });

    // Count actual captured pieces
    capturedPieces.forEach((piece) => {
      // Convert to the correct case based on player color
      const pieceToCheck =
        color === "white" ? piece.toLowerCase() : piece.toUpperCase();

      // Make sure the piece is one this player can capture
      if (validPieces.includes(pieceToCheck as PieceKey)) {
        counts[pieceToCheck] = (counts[pieceToCheck] || 0) + 1;
      }
    });

    return counts;
  }, [capturedPieces, color, capturedPieceTypes]);

  return (
    <div className="w-full">
      <div
        className={`relative overflow-hidden rounded-xl border-2 ${borderColor} bg-gradient-to-r ${bgGradient} p-4 backdrop-blur-md transition-all duration-300 ${
          isCurrentPlayer
            ? "ring-2 ring-offset-2 ring-offset-gray-900"
            : "opacity-80"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-700">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {player.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              {isLoggedIn && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-gray-900 bg-green-500" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">
                {player.username}
              </h3>
              <p className="text-xs text-gray-400">{player.rating} ELO</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-white">
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* Captured pieces */}
        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-1">
            {allPieces.map((piece, pieceIndex) => {
              const count = capturedCounts[piece.key] || 0;
              const glowColor =
                color === "black"
                  ? "rgba(236, 72, 153, 0.8)"
                  : "rgba(6, 182, 212, 0.8)";

              return (
                <div key={piece.key} className="flex items-center">
                  {Array.from({ length: piece.max }).map((_, i) => {
                    const isCaptured = i < count;
                    return (
                      <motion.span
                        key={`${piece.key}-${i}`}
                        className={`${textColor} text-lg`}
                        initial={{ opacity: 0.3, scale: 0.9 }}
                        animate={{
                          opacity: isCaptured ? 1 : 0.3,
                          scale: isCaptured ? 1 : 0.9,
                          filter: isCaptured
                            ? `drop-shadow(0 0 4px ${glowColor})`
                            : "none",
                        }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut",
                        }}
                      >
                        {piece.symbol}
                      </motion.span>
                    );
                  })}
                  {pieceIndex < allPieces.length - 1 && (
                    <span className="mx-1 text-gray-500/50">·</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
