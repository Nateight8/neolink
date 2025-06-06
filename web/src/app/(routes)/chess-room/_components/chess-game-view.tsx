"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CyberpunkChessboard } from "./cyberpunk-chessboard";
import {
  Clock,
  Flag,
  Handshake,
  Users,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { Player, Spectator } from "./chess-room";

interface ChessGameViewProps {
  roomId: string;
  players: Player[];
  spectators: Spectator[];
  currentUser: Player;
  onLeaveRoom: () => void;
}

export function ChessGameView({
  roomId,
  players,
  spectators,
  currentUser,
  onLeaveRoom,
}: ChessGameViewProps) {
  const [gameTime, setGameTime] = useState({ white: 600, black: 600 }); // 10 minutes each
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white"
  );
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gamePosition, setGamePosition] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [soundEnabled, setSoundEnabled] = useState(true);

  const whitePlayer = players[0];
  const blackPlayer = players[1];
  const isPlayerTurn =
    currentPlayer === "white"
      ? whitePlayer?.id === currentUser.id
      : blackPlayer?.id === currentUser.id;
  const playerColor = whitePlayer?.id === currentUser.id ? "white" : "black";

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime((prev) => ({
        ...prev,
        [currentPlayer]: Math.max(0, prev[currentPlayer] - 1),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer]);

  const handleMove = (move: string) => {
    setMoveHistory((prev) => [...prev, move]);
    setCurrentPlayer(currentPlayer === "white" ? "black" : "white");

    // Play move sound effect (if sound is enabled)
    if (soundEnabled) {
      // In a real app, you'd play an actual sound file
      console.log("🔊 Move sound:", move);
    }
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

  const handleOfferDraw = () => {
    // In a real app, this would send a draw offer to the opponent
    console.log("Draw offered");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white font-cyber">
              NEURAL CHESS DUEL
            </h1>
            <Badge
              variant="outline"
              className="bg-cyan-950/50 border-cyan-500 text-cyan-400"
            >
              ROOM: {roomId}
            </Badge>
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
              onClick={onLeaveRoom}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-950/30"
            >
              <X className="h-4 w-4 mr-2" />
              DISCONNECT
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Black Player */}
          <div className="space-y-4">
            <div className="bg-black/80 border border-fuchsia-900 rounded-sm p-4">
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
                    RATING: {blackPlayer?.rating}
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
            <div className="bg-black/80 border border-gray-800 rounded-sm p-4 space-y-3">
              <h4 className="text-cyan-400 font-cyber text-sm">
                GAME CONTROLS
              </h4>

              <Button
                variant="outline"
                className="w-full border-red-500 text-red-400 hover:bg-red-950/30"
                onClick={handleResign}
                disabled={!isPlayerTurn}
              >
                <Flag className="h-4 w-4 mr-2" />
                RESIGN
              </Button>

              <Button
                variant="outline"
                className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-950/30"
                onClick={handleOfferDraw}
                disabled={!isPlayerTurn}
              >
                <Handshake className="h-4 w-4 mr-2" />
                OFFER DRAW
              </Button>
            </div>
          </div>

          {/* Center - Chess Board */}
          <div className="lg:col-span-2 flex bg-red-950 p-4 items-center justify-center">
            <CyberpunkChessboard
              playerColor={playerColor}
              onMove={handleMove}
              gamePosition={gamePosition}
              isPlayerTurn={isPlayerTurn}
            />
          </div>

          {/* Right Panel - White Player & Spectators */}
          <div className="space-y-4">
            {/* White Player */}
            <div className="bg-black/80 border border-cyan-900 rounded-sm p-4">
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
                    RATING: {whitePlayer?.rating}
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
            <div className="bg-black/80 border border-gray-800 rounded-sm p-4">
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
            <div className="bg-black/80 border border-gray-800 rounded-sm p-4">
              <h4 className="text-gray-400 font-cyber text-sm mb-3">
                MOVE HISTORY
              </h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {moveHistory.map((move, index) => (
                  <div
                    key={index}
                    className="text-xs font-mono text-gray-300 flex"
                  >
                    <span className="w-8 text-gray-500">
                      {Math.floor(index / 2) + 1}.
                    </span>
                    <span
                      className={
                        index % 2 === 0 ? "text-cyan-400" : "text-fuchsia-400"
                      }
                    >
                      {move}
                    </span>
                  </div>
                ))}
                {moveHistory.length === 0 && (
                  <p className="text-gray-500 text-xs">No moves yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
