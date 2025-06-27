import { Chess } from "chess.js";

/**
 * Checks if the game is over and returns a result object if so.
 * @param {string} fen - The current FEN string.
 * @param {Array} chessPlayers - The array of chessPlayers from the ChessRoom.
 * @param {Date} createdAt - The room creation time.
 * @returns {object|null} - The result object or null if not over.
 */
export function getGameOverResult(fen, chessPlayers, createdAt) {
  const chess = new Chess(fen);
  let isGameOver = false;
  let resultStatus = null;
  let resultReason = null;
  let winnerUser = null;

  if (chess.isCheckmate()) {
    isGameOver = true;
    resultStatus = "win";
    resultReason = "checkmate";
    // The side who just moved is the winner (opposite of turn)
    const winnerColor = chess.turn() === "w" ? "black" : "white";
    const winnerPlayer = chessPlayers.find((p) => p.color === winnerColor);
    winnerUser = winnerPlayer ? winnerPlayer.user : null;
  } else if (chess.isStalemate()) {
    isGameOver = true;
    resultStatus = "draw";
    resultReason = "stalemate";
  } else if (chess.isThreefoldRepetition()) {
    isGameOver = true;
    resultStatus = "draw";
    resultReason = "threefold_repetition";
  } else if (chess.isInsufficientMaterial()) {
    isGameOver = true;
    resultStatus = "draw";
    resultReason = "insufficient_material";
  }
  // TODO: Add timeout, resignation, agreement, abandonment as needed

  if (isGameOver) {
    return {
      status: resultStatus,
      reason: resultReason,
      winner: resultStatus === "win" ? winnerUser : null,
      ended: new Date(),
      duration: Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000),
    };
  }
  return null;
}
