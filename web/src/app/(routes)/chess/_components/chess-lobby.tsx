"use client";

import { useState, useEffect, useMemo, type JSX } from "react";
import { motion } from "motion/react";

import { Chessboard } from "react-chessboard";
import { Chess, type Square } from "chess.js";
import GameController from "./game-control";
import Spectators from "./spectators";
import ChessHeader from "./chess-header";
import Player, { type PlayerData } from "./player";

type PlayerColor = "white" | "black";

// Define a custom move type that's compatible with chess.js Move
type ChessMove = {
  to: string;
  from: string;
  piece: string;
  color: "w" | "b";
  flags: string;
  san: string;
  // Add other properties from Move that you need
};

interface ChessGameCleanProps {
  matchType: "friend" | "random" | null;
  onDisconnect: () => void;
}

export function ChessGameClean({
  matchType,
  onDisconnect,
}: ChessGameCleanProps) {
  const [game, setGame] = useState<Chess>(new Chess());
  const [gamePosition, setGamePosition] = useState<string>(game.fen());
  const [gameTime, setGameTime] = useState<{ white: number; black: number }>({
    white: 600,
    black: 600,
  }); // 10 minutes each
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

  // Player data
  const [players] = useState<PlayerData[]>([
    {
      id: "1",
      username: "NeuralKnight",
      avatar: "/placeholder.svg?height=48&width=48&text=NK",
      rating: 1750,
    },
    {
      id: "2",
      username: "CyberQueen",
      avatar: "/placeholder.svg?height=48&width=48&text=CQ",
      rating: 1820,
    },
  ]);

  // Destructure players
  const [whitePlayer, blackPlayer] = players;

  // Spectators
  const [spectators] = useState([
    {
      id: "3",
      username: "GridWatcher",
      avatar: "/placeholder.svg?height=32&width=32&text=GW",
    },
    {
      id: "4",
      username: "NeonBishop",
      avatar: "/placeholder.svg?height=32&width=32&text=NB",
    },
  ]);

  const playerColor: PlayerColor = "white";
  const isWhiteTurn = game.turn() === "w";
  const currentPlayer = isWhiteTurn ? ("white" as const) : ("black" as const);

  // Timer countdown effect
  useEffect(() => {
    if (!game.isGameOver()) {
      const timer = setInterval(() => {
        setGameTime((prev) => ({
          ...prev,
          [isWhiteTurn ? "white" : "black"]: Math.max(
            0,
            prev[isWhiteTurn ? "white" : "black"] - 1
          ),
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isWhiteTurn, game]);

  const makeMove = (sourceSquare: string, targetSquare: string): boolean => {
    const gameCopy = new Chess(game.fen());

    try {
      const move = gameCopy.move({
        from: sourceSquare as Square,
        to: targetSquare as Square,
        promotion: "q",
      });

      if (move) {
        setGame(gameCopy);
        setGamePosition(gameCopy.fen());
        setMoveHistory(gameCopy.history());
        return true;
      }
    } catch (error) {
      console.log("Invalid move:", error);
    }

    return false;
  };

  const onDrop = (sourceSquare: string, targetSquare: string): boolean => {
    if (playerColor !== currentPlayer) return false;
    return makeMove(sourceSquare, targetSquare);
  };

  const handleResign = () => {
    // In a real app, this would send a resignation to the server
    console.log("Player resigned");
  };

  const handleDrawOffer = () => {
    // In a real app, this would send a draw offer to the opponent
    console.log("Draw offered");
  };

  const customPieces = useMemo(() => {
    return () => {
      const pieces = [
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
      ];
      const pieceComponents: {
        [key: string]: ({
          squareWidth,
        }: {
          squareWidth: number;
        }) => JSX.Element;
      } = {};

      pieces.forEach((piece) => {
        const isWhite = piece[0] === "w";

        pieceComponents[piece] = ({ squareWidth }) => (
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
      });

      return pieceComponents;
    };
  }, []);

  function getUnicodePiece(piece: string) {
    const pieces: Record<string, string> = {
      wK: "♔",
      wQ: "♕",
      wR: "♖",
      wB: "♗",
      wN: "♘",
      wP: "♙",
      bK: "♔",
      bQ: "♕",
      bR: "♖",
      bB: "♗",
      bN: "♘",
      bP: "♙",
    };
    return pieces[piece] || "";
  }

  // Helper function to check if it's the current player's turn
  const isPlayersTurn = (): boolean => {
    const currentTurn = game.turn();

    // Use a type guard to ensure type safety
    const isWhiteTurn = () => playerColor === "white" && currentTurn === "w";
    const isBlackTurn = () => playerColor === "black" && currentTurn === "b";

    return isWhiteTurn() || isBlackTurn();
  };

  const onSquareClick = (square: string) => {
    // Check if it's the current player's turn
    if (!isPlayersTurn()) return;

    // If a piece is already selected and the clicked square is a valid move, make the move
    if (selectedSquare) {
      if (possibleMoves.includes(square)) {
        makeMove(selectedSquare, square);
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }
      // If clicking on the same square, deselect it
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }
    }

    // Check if the clicked square has a piece of the current player's color
    const piece = game.get(square as Square);
    if (
      piece &&
      ((game.turn() === "w" && piece.color === "w") ||
        (game.turn() === "b" && piece.color === "b"))
    ) {
      setSelectedSquare(square);
      const moves = game.moves({
        square: square as Square,
        verbose: true,
      }) as ChessMove[];
      setPossibleMoves(moves.map((move) => move.to));
    }
  };

  const getCustomSquareStyles = (): {
    [square: string]: React.CSSProperties;
  } => {
    const styles: { [square: string]: React.CSSProperties } = {};

    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: "rgba(0, 255, 255, 0.4)",
        boxShadow: "inset 0 0 20px rgba(0, 255, 255, 0.6)",
      };
    }

    // Highlight possible moves
    possibleMoves.forEach((square) => {
      const piece = game.get(square as Square);
      styles[square] = {
        background: piece
          ? "radial-gradient(circle, rgba(255,0,255,0.4) 85%, transparent 85%)" // Capture move
          : "radial-gradient(circle, rgba(0,255,255,0.4) 25%, transparent 25%)", // Normal move
        borderRadius: piece ? "0%" : "50%",
      };
    });

    return styles;
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cyberpunk background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />

      {/* Neural grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="neural-grid"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#00ffff"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>

      {/* Chess game interface */}
      <div className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <ChessHeader
            isGameOver={game.isGameOver()}
            isCheckmate={game.isCheckmate()}
            isDraw={game.isDraw()}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onDisconnect={onDisconnect}
            roomId="NX-7842"
          />

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 max-w-7xl mx-auto mt-6">
            {/* Left Panel - Controls */}
            <GameController
              onResign={handleResign}
              onDrawOffer={handleDrawOffer}
              isGameOver={game.isGameOver()}
              isPlayerTurn={
                (game.turn() === "w" && playerColor === "white") ||
                (game.turn() === "b" && playerColor === "black")
              }
            />

            {/* Center - Game Area */}
            <div className="lg:col-span-3 border flex flex-col items-center space-y-6">
              {/* Top Player (Black/Opponent) */}
              <Player
                player={players[0]}
                isCurrentPlayer={playerColor === "black" && !game.isGameOver()}
                timeRemaining={gameTime.black}
                capturedPieces={["♘", "♙", "♖", "♗", "♕", "♔"]} // TODO: Track captured pieces
                color="black"
                isLoggedIn={false}
              />

              {/* Chess Board */}
              <div className="w-full aspect-square max-w-[600px] relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-sm -z-10" />

                <Chessboard
                  position={gamePosition}
                  onPieceDrop={onDrop}
                  onSquareClick={onSquareClick}
                  customBoardStyle={{
                    borderRadius: "4px",
                    boxShadow: "0 0 30px rgba(0, 255, 255, 0.3)",
                  }}
                  customDarkSquareStyle={{ backgroundColor: "#1f2937" }}
                  customLightSquareStyle={{ backgroundColor: "#374151" }}
                  customSquareStyles={getCustomSquareStyles()}
                  customPieces={customPieces()}
                  boardOrientation={playerColor === "black" ? "black" : "white"}
                />

                {/* Scan line animation overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-sm">
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-400/30"
                    animate={{ y: ["0%", "100%"] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                </div>

                {/* Game status overlay */}
                {game.isGameOver() && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-sm">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-2 font-cyber neon-text">
                        {game.isCheckmate()
                          ? `${game.turn() === "w" ? "BLACK" : "WHITE"} WINS!`
                          : "NEURAL DRAW"}
                      </h2>
                      <p className="text-cyan-300">
                        {game.isCheckmate()
                          ? "CHECKMATE"
                          : game.isStalemate()
                          ? "STALEMATE"
                          : game.isThreefoldRepetition()
                          ? "THREEFOLD REPETITION"
                          : game.isInsufficientMaterial()
                          ? "INSUFFICIENT MATERIAL"
                          : "DRAW"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Player (White/You) */}
              <Player
                player={whitePlayer}
                isCurrentPlayer={playerColor === "white" && !game.isGameOver()}
                timeRemaining={gameTime.white}
                capturedPieces={["♘", "♙", "♖", "♗", "♕", "♔"]} // TODO: Track captured pieces
                color="white"
                isLoggedIn={true}
              />
            </div>

            {/* Right Panel - Spectators */}
            <Spectators spectators={spectators} moveHistory={moveHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}
