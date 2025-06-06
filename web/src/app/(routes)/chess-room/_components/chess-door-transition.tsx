"use client";

import type React from "react";

import { useState, useEffect, JSX, useMemo } from "react";
import { motion } from "motion/react";
import {
  Crown,
  Swords,
  Shuffle,
  Brain,
  Clock,
  Flag,
  Handshake,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

interface ChessDoorTransitionProps {
  matchType: "friend" | "random" | null;
  onTransitionComplete: () => void;
}

export function ChessDoorTransition({
  matchType,
  onTransitionComplete,
}: ChessDoorTransitionProps) {
  const [doorOpen, setDoorOpen] = useState(false);
  const [showMatchFound, setShowMatchFound] = useState(false);
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [gameTime, setGameTime] = useState({ white: 600, black: 600 }); // 10 minutes each
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

  // Mock player data
  const players = [
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
  ];

  // Mock spectators
  const spectators = [
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
  ];

  const whitePlayer = players[0];
  const blackPlayer = players[1];
  const playerColor = "white"; // For demo purposes
  const currentPlayer = game.turn() === "w" ? "white" : "black";

  useEffect(() => {
    // Show "match found" message first
    const matchFoundTimer = setTimeout(() => {
      setShowMatchFound(true);
    }, 1000);

    // Then open doors
    const doorTimer = setTimeout(() => {
      setDoorOpen(true);
    }, 3000);

    return () => {
      clearTimeout(matchFoundTimer);
      clearTimeout(doorTimer);
    };
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (doorOpen && !game.isGameOver()) {
      const timer = setInterval(() => {
        setGameTime((prev) => ({
          ...prev,
          [currentPlayer]: Math.max(0, prev[currentPlayer] - 1),
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentPlayer, doorOpen, game]);

  const makeMove = (sourceSquare: string, targetSquare: string) => {
    const gameCopy = new Chess(game.fen());

    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // Always promote to queen for simplicity
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

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    // Only allow moves if it's the player's turn
    if (
      (game.turn() === "w" && playerColor !== "white") ||
      (game.turn() === "b" && playerColor !== "black")
    ) {
      return false;
    }

    return makeMove(sourceSquare, targetSquare);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  const onSquareClick = (square: string) => {
    // If it's not the player's turn, don't allow interaction
    if (
      (game.turn() === "w" && playerColor !== "white") ||
      (game.turn() === "b" && playerColor !== "black")
    ) {
      return;
    }

    // If clicking on the same square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    // If a square is already selected, try to make a move
    if (selectedSquare) {
      const moveSuccessful = makeMove(selectedSquare, square);
      if (moveSuccessful) {
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else {
        // If move failed, select the new square if it has a piece
        const piece = game.get(square);
        if (
          piece &&
          ((game.turn() === "w" && piece.color === "w") ||
            (game.turn() === "b" && piece.color === "b"))
        ) {
          setSelectedSquare(square);
          const moves = game.moves({ square, verbose: true });
          setPossibleMoves(moves.map((move) => move.to));
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      // Select the square if it has a piece of the current player
      const piece = game.get(square);
      if (
        piece &&
        ((game.turn() === "w" && piece.color === "w") ||
          (game.turn() === "b" && piece.color === "b"))
      ) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves.map((move) => move.to));
      }
    }
  };

  const getCustomSquareStyles = () => {
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
      const piece = game.get(square);
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

      {/* Match found notification */}
      {showMatchFound && !doorOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center z-40"
        >
          <div className="bg-black/90 border-4 border-cyan-500 rounded-sm p-8 text-center backdrop-blur-sm relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px] -z-10" />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="w-16 h-16 mx-auto mb-4"
            >
              {matchType === "friend" ? (
                <Swords className="w-full h-full text-cyan-400" />
              ) : (
                <Shuffle className="w-full h-full text-fuchsia-400" />
              )}
            </motion.div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-2 font-cyber neon-text">
              {matchType === "friend"
                ? "NEURAL DUEL ACCEPTED!"
                : "OPPONENT SYNCHRONIZED!"}
            </h2>
            <p className="text-cyan-300 font-cyber">
              INITIALIZING BATTLE MATRIX...
            </p>
          </div>
        </motion.div>
      )}

      {/* Door panels */}
      <motion.div
        className="absolute inset-0 z-30 flex flex-col"
        initial={{ opacity: 1 }}
        animate={{ opacity: doorOpen ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        style={{ pointerEvents: doorOpen ? "none" : "auto" }}
      >
        {/* Top door panel */}
        <motion.div
          className="h-1/2 w-full bg-gradient-to-b from-gray-900 to-gray-800 border-b-4 border-cyan-500 relative"
          initial={{ y: 0 }}
          animate={{ y: doorOpen ? "-100%" : 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 border-4 border-cyan-500 rounded-sm bg-black flex items-center justify-center mx-auto mb-4 neural-pulse">
                <Brain className="h-16 w-16 text-cyan-400" />
              </div>
              <h3 className="text-cyan-400 text-xl font-bold font-cyber neon-text">
                NEURAL CHESS MATRIX
              </h3>
              <p className="text-cyan-300 text-sm mt-2">
                LOADING BATTLE PROTOCOLS...
              </p>
            </div>
          </div>

          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern
                id="circuit-top"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 50 L 50 50 L 50 0 M 50 50 L 100 50"
                  fill="none"
                  stroke="#00ffff"
                  strokeWidth="1"
                />
                <circle cx="50" cy="50" r="3" fill="#00ffff" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#circuit-top)" />
            </svg>
          </div>

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </motion.div>

        {/* Bottom door panel */}
        <motion.div
          className="h-1/2 w-full bg-gradient-to-t from-gray-900 to-gray-800 border-t-4 border-fuchsia-500 relative"
          initial={{ y: 0 }}
          animate={{ y: doorOpen ? "100%" : 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 border-4 border-fuchsia-500 rounded-sm bg-black flex items-center justify-center mx-auto mb-4 neural-pulse">
                <Crown className="h-16 w-16 text-fuchsia-400" />
              </div>
              <h3 className="text-fuchsia-400 text-xl font-bold font-cyber neon-text-pink">
                ENTER THE GRID
              </h3>
              <p className="text-fuchsia-300 text-sm mt-2">
                WHERE MINDS COLLIDE...
              </p>
            </div>
          </div>

          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern
                id="circuit-bottom"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 50 L 50 50 L 50 100 M 50 50 L 100 50"
                  fill="none"
                  stroke="#ff00ff"
                  strokeWidth="1"
                />
                <circle cx="50" cy="50" r="3" fill="#ff00ff" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#circuit-bottom)" />
            </svg>
          </div>

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Chess game room revealed behind doors */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: doorOpen ? 1 : 0, scale: doorOpen ? 1 : 0.9 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute inset-0 z-20 p-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-cyan-400 font-cyber neon-text">
                NEURAL CHESS DUEL
              </h1>
              <Badge
                variant="outline"
                className="bg-cyan-950/50 border-cyan-500 text-cyan-400"
              >
                ROOM: #NX-7842
              </Badge>
              {game.isGameOver() && (
                <Badge
                  variant="outline"
                  className="bg-red-950/50 border-red-500 text-red-400"
                >
                  {game.isCheckmate()
                    ? "CHECKMATE"
                    : game.isDraw()
                    ? "DRAW"
                    : "GAME OVER"}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="outline"
                size="icon"
                className={`border-gray-600 ${
                  soundEnabled ? "text-cyan-400" : "text-gray-400"
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>

              <Button
                onClick={onTransitionComplete}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-950/30"
              >
                DISCONNECT
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Panel - Black Player */}
            <div className="space-y-4">
              <div className="bg-black/80 border border-fuchsia-900 rounded-sm p-4 relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-fuchsia-500/30 to-fuchsia-500/10 rounded-sm opacity-30 blur-[1px] -z-10" />
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-12 w-12 border-2 border-fuchsia-500">
                    <AvatarImage
                      src={blackPlayer?.avatar || "/placeholder.svg"}
                      alt={blackPlayer?.username}
                    />
                    <AvatarFallback className="bg-black text-fuchsia-400">
                      {blackPlayer?.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-white font-cyber">
                      {blackPlayer?.username}
                    </h3>
                    <p className="text-fuchsia-400 text-sm">
                      NEURAL RATING: {blackPlayer?.rating}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-fuchsia-400" />
                    <span
                      className={`font-mono text-lg ${
                        currentPlayer === "black"
                          ? "text-fuchsia-400"
                          : "text-gray-400"
                      } ${gameTime.black <= 60 ? "animate-pulse" : ""}`}
                    >
                      {formatTime(gameTime.black)}
                    </span>
                  </div>
                  {currentPlayer === "black" && (
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse" />
                  )}
                </div>
              </div>

              {/* Game Controls */}
              <div className="bg-black/80 border border-gray-800 rounded-sm p-4 space-y-3 relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-gray-700/20 to-gray-700/10 rounded-sm opacity-30 blur-[1px] -z-10" />
                <h4 className="text-cyan-400 font-cyber text-sm">
                  NEURAL CONTROLS
                </h4>

                <Button
                  onClick={handleResign}
                  variant="outline"
                  className="w-full border-red-500 text-red-400 hover:bg-red-950/30"
                  disabled={
                    game.isGameOver() ||
                    (game.turn() === "w"
                      ? playerColor !== "white"
                      : playerColor !== "black")
                  }
                >
                  <Flag className="h-4 w-4 mr-2" />
                  SURRENDER
                </Button>

                <Button
                  onClick={handleDrawOffer}
                  variant="outline"
                  className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-950/30"
                  disabled={
                    game.isGameOver() ||
                    (game.turn() === "w"
                      ? playerColor !== "white"
                      : playerColor !== "black")
                  }
                >
                  <Handshake className="h-4 w-4 mr-2" />
                  OFFER DRAW
                </Button>
              </div>
            </div>

            {/* Center - Chess Board */}
            <div className="lg:col-span-2 flex items-center justify-center">
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
            </div>

            {/* Right Panel - White Player & Spectators */}
            <div className="space-y-4">
              {/* White Player */}
              <div className="bg-black/80 border border-cyan-900 rounded-sm p-4 relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/30 to-cyan-500/10 rounded-sm opacity-30 blur-[1px] -z-10" />
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-12 w-12 border-2 border-cyan-500">
                    <AvatarImage
                      src={whitePlayer?.avatar || "/placeholder.svg"}
                      alt={whitePlayer?.username}
                    />
                    <AvatarFallback className="bg-black text-cyan-400">
                      {whitePlayer?.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-white font-cyber">
                      {whitePlayer?.username}
                    </h3>
                    <p className="text-cyan-400 text-sm">
                      NEURAL RATING: {whitePlayer?.rating}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <span
                      className={`font-mono text-lg ${
                        currentPlayer === "white"
                          ? "text-cyan-400"
                          : "text-gray-400"
                      } ${gameTime.white <= 60 ? "animate-pulse" : ""}`}
                    >
                      {formatTime(gameTime.white)}
                    </span>
                  </div>
                  {currentPlayer === "white" && (
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  )}
                </div>
              </div>

              {/* Spectators */}
              <div className="bg-black/80 border border-gray-800 rounded-sm p-4 relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-gray-700/20 to-gray-700/10 rounded-sm opacity-30 blur-[1px] -z-10" />
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-4 w-4 text-gray-400" />
                  <h4 className="text-gray-400 font-cyber text-sm">
                    SPECTATORS ({spectators.length})
                  </h4>
                </div>

                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {spectators.map((spectator) => (
                    <div
                      key={spectator.id}
                      className="flex items-center space-x-2"
                    >
                      <Avatar className="h-6 w-6 border border-gray-600">
                        <AvatarImage
                          src={spectator.avatar || "/placeholder.svg"}
                          alt={spectator.username}
                        />
                        <AvatarFallback className="bg-black text-gray-400 text-xs">
                          {spectator.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-300 text-sm">
                        {spectator.username}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Move History */}
              <div className="bg-black/80 border border-gray-800 rounded-sm p-4 relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-gray-700/20 to-gray-700/10 rounded-sm opacity-30 blur-[1px] -z-10" />
                <h4 className="text-gray-400 font-cyber text-sm mb-3">
                  MOVE HISTORY
                </h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {moveHistory.length > 0 ? (
                    moveHistory.map((move, index) => (
                      <div
                        key={index}
                        className="text-xs font-mono text-gray-300 flex"
                      >
                        <span className="w-8 text-gray-500">
                          {Math.floor(index / 2) + 1}.
                        </span>
                        <span
                          className={
                            index % 2 === 0
                              ? "text-cyan-400"
                              : "text-fuchsia-400"
                          }
                        >
                          {move}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-xs">AWAITING FIRST MOVE</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
