"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChessBoard } from "../../../_components/v2/chess-board";

import {
  Clock,
  MessageCircle,
  Flag,
  Handshake,
  Settings,
  LogOut,
  Send,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Player {
  id: string;
  username: string;
  rating: number;
  avatar: string;
  timeRemaining: number;
  isOnline: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  avatar: string;
}

interface Move {
  id: string;
  notation: string;
  timestamp: Date;
  player: "white" | "black";
}

export function AllyChessGame() {
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white"
  );
  const [gameStatus, setGameStatus] = useState<
    "active" | "check" | "checkmate" | "draw"
  >("active");
  const [moveCount, setMoveCount] = useState(1);
  const [chatExpanded, setChatExpanded] = useState(true);
  const [chatMessage, setChatMessage] = useState("");

  // Mock data for the current user (playing as white)
  const user: Player = {
    id: "user1",
    username: "CyberKnight",
    rating: 1847,
    avatar: "/placeholder.svg?height=40&width=40",
    timeRemaining: 8 * 60 + 45, // 8:45
    isOnline: true,
  };

  // Mock data for the ally (playing as black)
  const ally: Player = {
    id: "ally1",
    username: "QuantumRook",
    rating: 1923,
    avatar: "/placeholder.svg?height=40&width=40",
    timeRemaining: 9 * 60 + 12, // 9:12
    isOnline: true,
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      userId: "ally1",
      username: "QuantumRook",
      message: "Good luck! May the best neural network win 🤖",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      userId: "user1",
      username: "CyberKnight",
      message: "Thanks! This should be a great game 🎮",
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]);

  const [moveHistory, setMoveHistory] = useState<Move[]>([
    {
      id: "1",
      notation: "1. e4",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      player: "white",
    },
    {
      id: "2",
      notation: "1... e5",
      timestamp: new Date(Date.now() - 4 * 60 * 1000),
      player: "black",
    },
    {
      id: "3",
      notation: "2. Nf3",
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      player: "white",
    },
    {
      id: "4",
      notation: "2... Nc6",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      player: "black",
    },
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: user.id,
        username: user.username,
        message: chatMessage,
        timestamp: new Date(),
        avatar: user.avatar,
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const isUserTurn = currentPlayer === "white";
  const currentPlayerData = currentPlayer === "white" ? user : ally;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Game Info & Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Game Status */}
            <Card className="bg-gray-900/50 border-cyan-500/30 p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Game Status</span>
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-400"
                  >
                    {gameStatus.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Move</span>
                  <span className="text-white font-mono">{moveCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Turn</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        currentPlayer === "white" ? "bg-white" : "bg-gray-800"
                      }`}
                    />
                    <span className="text-sm capitalize">{currentPlayer}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Game Controls */}
            <Card className="bg-gray-900/50 border-cyan-500/30 p-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Game Controls
                </h3>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  disabled={!isUserTurn}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Resign
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                  disabled={!isUserTurn}
                >
                  <Handshake className="w-4 h-4 mr-2" />
                  Offer Draw
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Leave Game
                </Button>
              </div>
            </Card>

            {/* Move History */}
            <Card className="bg-gray-900/50 border-cyan-500/30 p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                Move History
              </h3>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {moveHistory.map((move) => (
                    <div
                      key={move.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-mono text-white">
                        {move.notation}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {move.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Center - Chess Board */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Opponent Info (Black - Ally) */}
              <Card className="bg-gray-900/50 border-fuchsia-500/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-fuchsia-500/50">
                      <AvatarImage src={ally.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{ally.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ally.username}</span>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            ally.isOnline ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />
                      </div>
                      <span className="text-sm text-gray-400">
                        Rating: {ally.rating}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`flex items-center gap-2 ${
                        currentPlayer === "black"
                          ? "text-fuchsia-400"
                          : "text-gray-400"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span
                        className={`font-mono text-lg ${
                          ally.timeRemaining < 60 ? "text-red-400" : ""
                        }`}
                      >
                        {formatTime(ally.timeRemaining)}
                      </span>
                    </div>
                    {currentPlayer === "black" && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse" />
                        <span className="text-xs text-fuchsia-400">
                          Their turn
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Chess Board */}
              <div className="flex justify-center">
                <div className="w-full max-w-lg">
                  <ChessBoard
                    playerColor="white"
                    isPlayerTurn={isUserTurn}
                    onMove={(move) => {
                      console.log("Move made:", move);
                      setCurrentPlayer(
                        currentPlayer === "white" ? "black" : "white"
                      );
                      setMoveCount(
                        currentPlayer === "black" ? moveCount + 1 : moveCount
                      );
                    }}
                  />
                </div>
              </div>

              {/* User Info (White - Current User) */}
              <Card className="bg-gray-900/50 border-cyan-500/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-cyan-500/50">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.username}</span>
                        <Badge
                          variant="outline"
                          className="border-cyan-500 text-cyan-400 text-xs"
                        >
                          You
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-400">
                        Rating: {user.rating}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`flex items-center gap-2 ${
                        currentPlayer === "white"
                          ? "text-cyan-400"
                          : "text-gray-400"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span
                        className={`font-mono text-lg ${
                          user.timeRemaining < 60 ? "text-red-400" : ""
                        }`}
                      >
                        {formatTime(user.timeRemaining)}
                      </span>
                    </div>
                    {currentPlayer === "white" && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                        <span className="text-xs text-cyan-400">Your turn</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Sidebar - Chat */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/50 border-cyan-500/30 h-full">
              <div className="p-4 border-b border-gray-700">
                <button
                  onClick={() => setChatExpanded(!chatExpanded)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium">Private Chat</span>
                  </div>
                  {chatExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {chatExpanded && (
                <div className="flex flex-col h-96">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="flex gap-3">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage
                              src={message.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {message.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-sm font-medium ${
                                  message.userId === user.id
                                    ? "text-cyan-400"
                                    : "text-fuchsia-400"
                                }`}
                              >
                                {message.username}
                              </span>
                              <span className="text-xs text-gray-500">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300 break-words">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-gray-700">
                    <div className="flex gap-2">
                      <Input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
