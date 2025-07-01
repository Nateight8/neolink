import { type Chess } from "chess.js";
import {
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
  IconChess,
} from "@tabler/icons-react";

interface GameStatusProps {
  game: Chess;
  gameTime: { white: number; black: number };
  onPlayAgain?: () => void;
  onExit?: () => void;
  onViewBoard?: () => void;
  className?: string;
  winnerUserId?: string;
  loggedInUserId?: string;
}

export default function GameStatus({
  game,
  gameTime,
  onPlayAgain,
  onExit,
  onViewBoard,
  className = "",
  winnerUserId,
  loggedInUserId,
}: GameStatusProps) {
  const getStatusMessage = () => {
    if (
      (game.isGameOver() || gameTime.white <= 0 || gameTime.black <= 0) &&
      winnerUserId &&
      loggedInUserId
    ) {
      return {
        result: winnerUserId === loggedInUserId ? "YOU WON" : "YOU LOST",
        reason: game.isCheckmate()
          ? "CHECKMATE"
          : gameTime.white <= 0 || gameTime.black <= 0
          ? "TIME FORFEIT"
          : game.isStalemate()
          ? "STALEMATE"
          : game.isThreefoldRepetition()
          ? "THREEFOLD REPETITION"
          : game.isInsufficientMaterial()
          ? "INSUFFICIENT MATERIAL"
          : "GAME OVER",
      };
    }
    if (gameTime.white <= 0)
      return { result: "BLACK WINS", reason: "TIME FORFEIT" };
    if (gameTime.black <= 0)
      return { result: "WHITE WINS", reason: "TIME FORFEIT" };
    if (game.isCheckmate())
      return {
        result: `${game.turn() === "w" ? "BLACK" : "WHITE"} WINS`,
        reason: "CHECKMATE",
      };
    if (game.isStalemate()) return { result: "DRAW", reason: "STALEMATE" };
    if (game.isThreefoldRepetition())
      return { result: "DRAW", reason: "THREEFOLD REPETITION" };
    if (game.isInsufficientMaterial())
      return { result: "DRAW", reason: "INSUFFICIENT MATERIAL" };
    return {
      result: "IN PROGRESS",
      reason: game.turn() === "w" ? "WHITE'S TURN" : "BLACK'S TURN",
    };
  };

  const { result, reason } = getStatusMessage();
  const isGameOver = result.includes("WINS") || result === "DRAW";
  const isDraw = result === "DRAW";
  const isInProgress = result === "IN PROGRESS";

  return (
    <div
      className={`bg-black/80 border border-cyan-500/20 rounded-sm p-4 ${className}`}
    >
      <div className="relative">
        {/* Scan line effect */}
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(34,211,238,0.03)_50%,transparent_100%)] opacity-30"
          style={{ backgroundSize: "100% 0.25rem" }}
        />

        <div className="relative z-10">
          <div className={`flex items-center justify-between mb-1`}>
            <h3
              className={`text-xs uppercase tracking-wider font-cyber ${
                isGameOver
                  ? isDraw
                    ? "text-cyan-400"
                    : "text-fuchsia-400"
                  : "text-gray-400"
              }`}
            >
              {result}
            </h3>
            <div className="h-2 w-2 rounded-full bg-cyan-400/80 animate-pulse" />
          </div>

          <p
            className={`text-xs font-mono ${
              isGameOver
                ? isDraw
                  ? "text-cyan-300"
                  : "text-fuchsia-300"
                : "text-gray-300"
            }`}
          >
            {reason}
          </p>

          {isInProgress ? (
            <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500/80 transition-all duration-500"
                style={{ width: "50%" }}
              />
            </div>
          ) : (
            <div className="flex flex-col space-y-3 mt-4">
              {onPlayAgain && (
                <button
                  onClick={onPlayAgain}
                  className="group w-full flex items-center justify-center gap-2 px-4 py-2 rounded-sm border border-cyan-500/30 bg-cyan-900/20 hover:bg-cyan-800/30 text-cyan-300 hover:text-cyan-200 transition-colors duration-200"
                  aria-label="Play again"
                >
                  <IconPlayerPlayFilled className="h-4 w-4" />
                  <span>Play Again</span>
                </button>
              )}

              {onExit && (
                <button
                  onClick={onExit}
                  className="group w-full flex items-center justify-center gap-2 px-4 py-2 rounded-sm border border-fuchsia-500/30 bg-fuchsia-900/20 hover:bg-fuchsia-800/30 text-fuchsia-300 hover:text-fuchsia-200 transition-colors duration-200"
                  aria-label="Exit game"
                >
                  <IconPlayerStopFilled className="h-4 w-4" />
                  <span>Exit Game</span>
                </button>
              )}

              {onViewBoard && (
                <button
                  onClick={onViewBoard}
                  className="group w-full flex items-center justify-center gap-2 px-4 py-2 rounded-sm border border-emerald-500/30 bg-emerald-900/10 hover:bg-emerald-800/20 text-emerald-300 hover:text-emerald-200 transition-colors duration-200"
                  aria-label="View board"
                >
                  <IconChess className="h-4 w-4" />
                  <span>View Board</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
