"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CyberpunkChessboard } from "./cyberpunk-chessboard";
import {
  Clock,
  Users,
  X,
  Eye,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";
import type { Player, Spectator } from "./chess-room";

interface ChessSpectatorViewProps {
  roomId: string;
  players: Player[];
  spectators: Spectator[];
  currentUser: Player;
  onLeaveRoom: () => void;
}

export function ChessSpectatorView({
  roomId,
  players,
  spectators,
  currentUser,
  onLeaveRoom,
}: ChessSpectatorViewProps) {
  const [gameTime] = useState({ white: 480, black: 520 }); // Mock game time
  const [currentPlayer] = useState<"white" | "black">("white");
  const [moveHistory] = useState<string[]>(["e4", "e5", "Nf3", "Nc6", "Bb5"]); // Mock moves
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [followingPlayer, setFollowingPlayer] = useState<
    "white" | "black" | "auto"
  >("auto");

  const whitePlayer = players[0];
  const blackPlayer = players[1];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white font-cyber">
              SPECTATING NEURAL DUEL
            </h1>
            <Badge
              variant="outline"
              className="bg-purple-950/50 border-purple-500 text-purple-400"
            >
              <Eye className="h-3 w-3 mr-1" />
              OBSERVER MODE
            </Badge>
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
              LEAVE ROOM
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
                    }`}
                  >
                    {formatTime(gameTime.black)}
                  </span>
                </div>
                {currentPlayer === "black" && (
                  <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse" />
                )}
              </div>
            </div>

            {/* Spectator Controls */}
            <div className="bg-black/80 border border-gray-800 rounded-sm p-4 space-y-3">
              <h4 className="text-purple-400 font-cyber text-sm">
                SPECTATOR CONTROLS
              </h4>

              <div className="space-y-2">
                <p className="text-gray-400 text-xs">FOLLOW PLAYER:</p>
                <div className="grid grid-cols-3 gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFollowingPlayer("white")}
                    className={`text-xs ${
                      followingPlayer === "white"
                        ? "border-cyan-500 text-cyan-400 bg-cyan-950/30"
                        : "border-gray-600 text-gray-400"
                    }`}
                  >
                    WHITE
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFollowingPlayer("black")}
                    className={`text-xs ${
                      followingPlayer === "black"
                        ? "border-fuchsia-500 text-fuchsia-400 bg-fuchsia-950/30"
                        : "border-gray-600 text-gray-400"
                    }`}
                  >
                    BLACK
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFollowingPlayer("auto")}
                    className={`text-xs ${
                      followingPlayer === "auto"
                        ? "border-purple-500 text-purple-400 bg-purple-950/30"
                        : "border-gray-600 text-gray-400"
                    }`}
                  >
                    AUTO
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-gray-600 text-gray-400 hover:bg-gray-950/30"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                REPLAY GAME
              </Button>
            </div>
          </div>

          {/* Center - Chess Board */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <CyberpunkChessboard
              playerColor={followingPlayer === "black" ? "black" : "white"}
              isPlayerTurn={false} // Spectators can't make moves
            />
          </div>

          {/* Right Panel - White Player & Other Spectators */}
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
                    }`}
                  >
                    {formatTime(gameTime.white)}
                  </span>
                </div>
                {currentPlayer === "white" && (
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                )}
              </div>
            </div>

            {/* Other Spectators */}
            <div className="bg-black/80 border border-gray-800 rounded-sm p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="h-4 w-4 text-gray-400" />
                <h4 className="text-gray-400 font-cyber text-sm">
                  OTHER SPECTATORS ({spectators.length - 1})
                </h4>
              </div>

              <div className="space-y-2 max-h-32 overflow-y-auto">
                {spectators
                  .filter((spectator) => spectator.id !== currentUser.id)
                  .map((spectator) => (
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
