"use client";

import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { motion } from "motion/react";

interface ChessBoardProps {
  playerColor?: "white" | "black";
  onMove?: (move: string) => void;
  gamePosition?: string;
  isPlayerTurn?: boolean;
}

export function ChessBoard({
  playerColor = "white",
  onMove,
  gamePosition,
  isPlayerTurn = true,
}: ChessBoardProps) {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState("");
  const [moveTo, setMoveTo] = useState<string | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});

  // Update game position when prop changes
  useEffect(() => {
    if (gamePosition && gamePosition !== game.fen()) {
      const newGame = new Chess(gamePosition);
      setGame(newGame);
    }
  }, [gamePosition, game]);

  function getMoveOptions(square: string) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, any> = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(255,0,255,.4) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,255,255,.4) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(0, 255, 255, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square: string) {
    setRightClickedSquares({});

    // If it's not the player's turn, don't allow moves
    if (!isPlayerTurn) return;

    // If no piece is selected
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // If clicking the same square, deselect
    if (moveFrom === square) {
      setMoveFrom("");
      setOptionSquares({});
      return;
    }

    // Attempt to make a move
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: moveFrom,
      to: square,
      promotion: "q", // Always promote to queen for simplicity
    });

    // If the move is legal
    if (move) {
      setGame(gameCopy);
      setMoveFrom("");
      setOptionSquares({});

      // Highlight the move
      setMoveSquares({
        [moveFrom]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
        [square]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      });

      // Call the onMove callback
      if (onMove) {
        onMove(move.san);
      }
    } else {
      // If the move is illegal, try to select the new square
      const hasMoveOptions = getMoveOptions(square);
      setMoveFrom(hasMoveOptions ? square : "");
    }
  }

  function onSquareRightClick(square: string) {
    const colour = "rgba(0, 255, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  // Custom piece style for cyberpunk theme
  const customPieces = [
    "wP",
    "wN",
    "wB",
    "wR",
    "wQ",
    "wK",
    "bP",
    "bN",
    "bB",
    "bR",
    "bQ",
    "bK",
  ].reduce((acc, piece) => {
    const isWhite = piece[0] === "w";
    acc[piece] = ({ squareWidth }: { squareWidth: number }) => (
      <div
        style={{
          width: squareWidth,
          height: squareWidth,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: squareWidth * 0.7,
          filter: isWhite
            ? "drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))"
            : "drop-shadow(0 0 8px rgba(255, 0, 255, 0.8))",
          color: isWhite ? "#00ffff" : "#ff00ff",
        }}
      >
        {/* Use default piece rendering but with custom styling */}
        <span
          style={{
            textShadow: isWhite
              ? "0 0 10px rgba(0, 255, 255, 0.5)"
              : "0 0 10px rgba(255, 0, 255, 0.5)",
          }}
        >
          {getUnicodePiece(piece)}
        </span>
      </div>
    );
    return acc;
  }, {} as Record<string, any>);

  function getUnicodePiece(piece: string) {
    const pieces: Record<string, string> = {
      wK: "♔",
      wQ: "♕",
      wR: "♖",
      wB: "♗",
      wN: "♘",
      wP: "♙",
      bK: "♚",
      bQ: "♛",
      bR: "♜",
      bB: "♝",
      bN: "♞",
      bP: "♟",
    };
    return pieces[piece] || "";
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      {/* Cyberpunk border effect */}
      <div className="relative p-4 bg-black border-2 border-cyan-500 rounded-sm">
        <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500/50 to-fuchsia-500/50 rounded-sm blur-sm -z-10" />

        {/* Neural scanning effect */}
        <div className="absolute inset-0 chess-board-scan opacity-30 pointer-events-none rounded-sm" />

        <Chessboard
          id="cyberpunk-chess"
          position={game.fen()}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          boardOrientation={playerColor}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
          }}
          customDarkSquareStyle={{
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(0, 255, 255, 0.1)",
          }}
          customLightSquareStyle={{
            backgroundColor: "#2a2a2a",
            border: "1px solid rgba(0, 255, 255, 0.1)",
          }}
          customSquareStyles={{
            ...moveSquares,
            ...optionSquares,
            ...rightClickedSquares,
          }}
          customPieces={customPieces}
          boardWidth={400}
        />

        {/* Coordinate labels with cyberpunk styling */}
        <div className="absolute left-1 top-4 flex flex-col justify-between h-[400px] text-cyan-400 text-xs font-mono pointer-events-none">
          {(playerColor === "white"
            ? ["8", "7", "6", "5", "4", "3", "2", "1"]
            : ["1", "2", "3", "4", "5", "6", "7", "8"]
          ).map((num) => (
            <span key={num} className="h-12 flex items-center">
              {num}
            </span>
          ))}
        </div>

        <div className="absolute bottom-1 left-4 flex justify-between w-[400px] text-cyan-400 text-xs font-mono pointer-events-none">
          {(playerColor === "white"
            ? ["a", "b", "c", "d", "e", "f", "g", "h"]
            : ["h", "g", "f", "e", "d", "c", "b", "a"]
          ).map((letter) => (
            <span key={letter} className="w-12 text-center">
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Game status indicator */}
      {game.isGameOver() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-sm"
        >
          <div className="text-center p-6 bg-black border border-cyan-500 rounded-sm">
            <h3 className="text-2xl font-bold text-white mb-2">GAME OVER</h3>
            <p className="text-cyan-400">
              {game.isCheckmate()
                ? "CHECKMATE"
                : game.isDraw()
                ? "DRAW"
                : "GAME ENDED"}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
