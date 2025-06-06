"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  Clock,
  Users,
  MessageCircle,
  ChevronLeft,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Send,
  BarChart3,
  History,
  Zap,
  Share2,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { CyberpunkChessboard } from "../../../_components/cyberpunk-chessboard";
import { ChessBoard } from "../../../_components/v2/chess-board";

// Mock data for the live game
const GAME_DATA = {
  id: "NEURAL_MATCH_42X7",
  white: {
    username: "QUANTUM_KNIGHT",
    avatar: "/placeholder.svg?height=64&width=64&text=QK",
    rating: 2150,
    title: "Neural Master",
    country: "US",
    timeLeft: 420, // seconds
  },
  black: {
    username: "CYBER_BISHOP",
    avatar: "/placeholder.svg?height=64&width=64&text=CB",
    rating: 2080,
    title: "Data Grandmaster",
    country: "JP",
    timeLeft: 380, // seconds
  },
  gameType: "Blitz",
  timeControl: "5+2",
  moveCount: 18,
  currentTurn: "white",
  startTime: "15:30",
  duration: "12:45",
  spectatorCount: 42,
  status: "in_progress", // in_progress, white_won, black_won, draw
};

// Mock move history
const MOVE_HISTORY = [
  { notation: "e4", player: "white", time: "5:00", evaluation: 0.2 },
  { notation: "e5", player: "black", time: "4:58", evaluation: 0.1 },
  { notation: "Nf3", player: "white", time: "4:55", evaluation: 0.3 },
  { notation: "Nc6", player: "black", time: "4:52", evaluation: 0.2 },
  { notation: "Bc4", player: "white", time: "4:48", evaluation: 0.4 },
  { notation: "Nf6", player: "black", time: "4:45", evaluation: 0.3 },
  { notation: "d3", player: "white", time: "4:40", evaluation: 0.3 },
  { notation: "Bc5", player: "black", time: "4:35", evaluation: 0.2 },
  { notation: "O-O", player: "white", time: "4:30", evaluation: 0.5 },
  { notation: "O-O", player: "black", time: "4:25", evaluation: 0.3 },
  { notation: "Re1", player: "white", time: "4:20", evaluation: 0.6 },
  { notation: "d6", player: "black", time: "4:15", evaluation: 0.4 },
  { notation: "h3", player: "white", time: "4:10", evaluation: 0.5 },
  { notation: "h6", player: "black", time: "4:05", evaluation: 0.4 },
  { notation: "c3", player: "white", time: "4:00", evaluation: 0.7 },
  { notation: "a6", player: "black", time: "3:55", evaluation: 0.5 },
  { notation: "Nbd2", player: "white", time: "3:50", evaluation: 0.8 },
  { notation: "Re8", player: "black", time: "3:45", evaluation: 0.6 },
];

// Mock spectators
const SPECTATORS = [
  {
    id: 1,
    username: "NeuralFan",
    avatar: "/placeholder.svg?height=32&width=32&text=NF",
    rating: 1850,
    status: "online",
  },
  {
    id: 2,
    username: "DataMaster",
    avatar: "/placeholder.svg?height=32&width=32&text=DM",
    rating: 2200,
    status: "online",
  },
  {
    id: 3,
    username: "CyberRook",
    avatar: "/placeholder.svg?height=32&width=32&text=CR",
    rating: 1920,
    status: "online",
  },
  {
    id: 4,
    username: "QuantumPawn",
    avatar: "/placeholder.svg?height=32&width=32&text=QP",
    rating: 1750,
    status: "online",
  },
  {
    id: 5,
    username: "AlgoKnight",
    avatar: "/placeholder.svg?height=32&width=32&text=AK",
    rating: 2050,
    status: "online",
  },
  {
    id: 6,
    username: "ByteQueen",
    avatar: "/placeholder.svg?height=32&width=32&text=BQ",
    rating: 1980,
    status: "online",
  },
];

// Mock chat messages
const INITIAL_CHAT_MESSAGES = [
  {
    id: 1,
    username: "NeuralFan",
    avatar: "/placeholder.svg?height=32&width=32&text=NF",
    message: "Great opening by Quantum Knight!",
    timestamp: "2 min ago",
  },
  {
    id: 2,
    username: "DataMaster",
    avatar: "/placeholder.svg?height=32&width=32&text=DM",
    message: "I think black should have played d5 instead",
    timestamp: "1 min ago",
  },
  {
    id: 3,
    username: "CyberRook",
    avatar: "/placeholder.svg?height=32&width=32&text=CR",
    message: "The Italian Game opening, classic choice",
    timestamp: "45 sec ago",
  },
  {
    id: 4,
    username: "SYSTEM",
    message:
      "Welcome to the neural spectator chat. Please keep discussions respectful.",
    timestamp: "just now",
    isSystem: true,
  },
];

export function LiveGameSpectator() {
  const [gameData, setGameData] = useState(GAME_DATA);
  const [moveHistory, setMoveHistory] = useState(MOVE_HISTORY);
  const [spectators, setSpectators] = useState(SPECTATORS);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(
    moveHistory.length - 1
  );
  const [isLive, setIsLive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reactionCount, setReactionCount] = useState({
    thumbsUp: 12,
    thumbsDown: 3,
  });
  const [showSpectators, setShowSpectators] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Simulate game clock ticking
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setGameData((prev) => ({
        ...prev,
        white: {
          ...prev.white,
          timeLeft:
            prev.currentTurn === "white"
              ? Math.max(0, prev.white.timeLeft - 1)
              : prev.white.timeLeft,
        },
        black: {
          ...prev.black,
          timeLeft:
            prev.currentTurn === "black"
              ? Math.max(0, prev.black.timeLeft - 1)
              : prev.black.timeLeft,
        },
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Simulate new spectator joining
  useEffect(() => {
    const timeout = setTimeout(() => {
      const newSpectator = {
        id: spectators.length + 1,
        username: `Neural${Math.floor(Math.random() * 1000)}`,
        avatar: `/placeholder.svg?height=32&width=32&text=N${
          spectators.length + 1
        }`,
        rating: 1700 + Math.floor(Math.random() * 500),
        status: "online",
      };

      setSpectators((prev) => [...prev, newSpectator]);

      // Add system message about new spectator
      const newMessage = {
        id: chatMessages.length + 1,
        username: "SYSTEM",
        message: `${newSpectator.username} has joined the spectator room.`,
        timestamp: "just now",
        isSystem: true,
      };

      setChatMessages((prev) => [...prev, newMessage]);
    }, 15000); // New spectator every 15 seconds

    return () => clearTimeout(timeout);
  }, [spectators, chatMessages]);

  // Simulate occasional chat messages
  useEffect(() => {
    if (!isLive) return;

    const timeout = setTimeout(() => {
      const randomSpectator =
        spectators[Math.floor(Math.random() * spectators.length)];
      const messages = [
        "Interesting position developing here.",
        "I think white has a slight advantage.",
        "Black's knight is in a strong position.",
        "That last move was unexpected!",
        "The time pressure is building up.",
        "I'd play Qd4 here.",
        "Neural analysis suggests Rook to e5.",
        "Both players handling the middle game well.",
      ];

      const newMessage = {
        id: chatMessages.length + 1,
        username: randomSpectator.username,
        avatar: randomSpectator.avatar,
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: "just now",
      };

      setChatMessages((prev) => [...prev, newMessage]);
    }, 8000 + Math.random() * 10000); // Random interval between 8-18 seconds

    return () => clearTimeout(timeout);
  }, [chatMessages, spectators, isLive]);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current && activeTab === "chat") {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  // Simulate a new move occasionally
  useEffect(() => {
    if (!isLive || moveHistory.length >= 30) return;

    const timeout = setTimeout(() => {
      const nextPlayer = moveHistory.length % 2 === 0 ? "white" : "black";
      const possibleMoves = [
        "Qd4",
        "Nf5",
        "Bd7",
        "a4",
        "Rab1",
        "Qc7",
        "h4",
        "Nh5",
        "Bb5",
        "Rec8",
        "Nf3",
      ];
      const randomMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      const evaluation = Number.parseFloat(
        (Math.random() * 1.5 - 0.5).toFixed(1)
      );

      const newMove = {
        notation: randomMove,
        player: nextPlayer,
        time:
          nextPlayer === "white"
            ? formatTime(gameData.white.timeLeft)
            : formatTime(gameData.black.timeLeft),
        evaluation,
      };

      setMoveHistory((prev) => [...prev, newMove]);
      setCurrentMoveIndex((prev) => prev + 1);
      setGameData((prev) => ({
        ...prev,
        moveCount: prev.moveCount + 1,
        currentTurn: nextPlayer === "white" ? "black" : "white",
      }));

      // Add system message about the move
      const newMessage = {
        id: chatMessages.length + 1,
        username: "SYSTEM",
        message: `Move ${gameData.moveCount + 1}: ${
          nextPlayer === "white" ? "White" : "Black"
        } plays ${randomMove}`,
        timestamp: "just now",
        isSystem: true,
      };

      setChatMessages((prev) => [...prev, newMessage]);
    }, 20000 + Math.random() * 10000); // Random interval between 20-30 seconds

    return () => clearTimeout(timeout);
  }, [moveHistory, isLive, gameData]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      username: "You",
      avatar: "/placeholder.svg?height=32&width=32&text=YOU",
      message: chatInput,
      timestamp: "just now",
      isYou: true,
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput("");
  };

  const handleReaction = (type: "thumbsUp" | "thumbsDown") => {
    setReactionCount((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  const handleMoveNavigation = (direction: "prev" | "next") => {
    if (direction === "prev" && currentMoveIndex > 0) {
      setCurrentMoveIndex((prev) => prev - 1);
      setIsLive(false);
    } else if (
      direction === "next" &&
      currentMoveIndex < moveHistory.length - 1
    ) {
      setCurrentMoveIndex((prev) => prev + 1);
    } else if (
      direction === "next" &&
      currentMoveIndex === moveHistory.length - 1
    ) {
      setIsLive(true);
    }
  };

  const goToLive = () => {
    setCurrentMoveIndex(moveHistory.length - 1);
    setIsLive(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cyberpunk background effects */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-fuchsia-900/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/80 backdrop-blur-md border-b border-cyan-900">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                onClick={() => window.history.back()}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div>
                <h1 className="text-xl font-bold text-white">
                  Live Neural Chess Match
                </h1>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <span className="font-mono">ID: {gameData.id}</span>
                  <Badge
                    variant="outline"
                    className="border-cyan-500 text-cyan-400"
                  >
                    {gameData.gameType.toUpperCase()}
                  </Badge>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {gameData.timeControl}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm">
                <Eye className="h-4 w-4 text-fuchsia-400" />
                <span className="text-gray-400">
                  {spectators.length} watching
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`border-gray-700 ${
                  soundEnabled ? "text-cyan-400" : "text-gray-500"
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-950/30"
                onClick={() => setShowAnalysis(!showAnalysis)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {showAnalysis ? "Hide Analysis" : "Show Analysis"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar - Player info & move history */}
          <div className="lg:col-span-3 space-y-4">
            {/* White player */}
            <div
              className={`bg-black/50 border ${
                gameData.currentTurn === "white"
                  ? "border-cyan-500"
                  : "border-gray-800"
              } rounded-sm p-4 backdrop-blur-sm`}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarImage
                    src={gameData.white.avatar || "/placeholder.svg"}
                    alt={gameData.white.username}
                  />
                  <AvatarFallback className="bg-black text-white">
                    {gameData.white.username.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white">
                      {gameData.white.username}
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-cyan-500 text-cyan-400 text-xs"
                    >
                      {gameData.white.title}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    Rating: {gameData.white.rating}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-white" />
                  <span className="text-gray-400 text-sm">White</span>
                </div>
                <div
                  className={`font-mono text-xl font-bold ${
                    gameData.currentTurn === "white"
                      ? "text-cyan-400"
                      : "text-gray-400"
                  }`}
                >
                  {formatTime(gameData.white.timeLeft)}
                </div>
              </div>

              {gameData.currentTurn === "white" && (
                <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-500"
                    animate={{ width: ["100%", "0%"] }}
                    transition={{
                      duration: gameData.white.timeLeft,
                      ease: "linear",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Black player */}
            <div
              className={`bg-black/50 border ${
                gameData.currentTurn === "black"
                  ? "border-fuchsia-500"
                  : "border-gray-800"
              } rounded-sm p-4 backdrop-blur-sm`}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 border-2 border-gray-800">
                  <AvatarImage
                    src={gameData.black.avatar || "/placeholder.svg"}
                    alt={gameData.black.username}
                  />
                  <AvatarFallback className="bg-black text-gray-400">
                    {gameData.black.username.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white">
                      {gameData.black.username}
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-fuchsia-500 text-fuchsia-400 text-xs"
                    >
                      {gameData.black.title}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    Rating: {gameData.black.rating}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-600" />
                  <span className="text-gray-400 text-sm">Black</span>
                </div>
                <div
                  className={`font-mono text-xl font-bold ${
                    gameData.currentTurn === "black"
                      ? "text-fuchsia-400"
                      : "text-gray-400"
                  }`}
                >
                  {formatTime(gameData.black.timeLeft)}
                </div>
              </div>

              {gameData.currentTurn === "black" && (
                <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-fuchsia-500"
                    animate={{ width: ["100%", "0%"] }}
                    transition={{
                      duration: gameData.black.timeLeft,
                      ease: "linear",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Move history */}
            <div className="bg-black/50 border border-cyan-900 rounded-sm p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-cyan-400 font-bold flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  Move History
                </h3>
                <Badge
                  variant="outline"
                  className="border-cyan-500 text-cyan-400"
                >
                  {gameData.moveCount}
                </Badge>
              </div>

              <ScrollArea className="h-64 pr-4">
                <div className="space-y-1">
                  {moveHistory.map((move, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-1 rounded-sm ${
                        index === currentMoveIndex
                          ? "bg-cyan-950/30 border border-cyan-500"
                          : "hover:bg-gray-900/50 cursor-pointer"
                      }`}
                      onClick={() => {
                        setCurrentMoveIndex(index);
                        setIsLive(index === moveHistory.length - 1);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 text-xs w-6">
                          {Math.floor(index / 2) + 1}
                          {index % 2 === 0 ? "." : "..."}
                        </span>
                        <span
                          className={`font-mono text-sm ${
                            move.player === "white"
                              ? "text-cyan-400"
                              : "text-fuchsia-400"
                          }`}
                        >
                          {move.notation}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 text-xs">
                          {move.time}
                        </span>
                        {showAnalysis && (
                          <span
                            className={`text-xs ${
                              move.evaluation > 0
                                ? "text-cyan-400"
                                : move.evaluation < 0
                                ? "text-fuchsia-400"
                                : "text-gray-400"
                            }`}
                          >
                            {move.evaluation > 0 ? "+" : ""}
                            {move.evaluation}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Move navigation controls */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-700 text-gray-400"
                    onClick={() => setCurrentMoveIndex(0)}
                    disabled={currentMoveIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="h-4 w-4 -ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-700 text-gray-400"
                    onClick={() => handleMoveNavigation("prev")}
                    disabled={currentMoveIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>

                {!isLive && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-cyan-500 text-cyan-400 hover:bg-cyan-950/30 text-xs"
                    onClick={goToLive}
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    GO LIVE
                  </Button>
                )}

                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-700 text-gray-400"
                    onClick={() => handleMoveNavigation("next")}
                    disabled={isLive}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-700 text-gray-400"
                    onClick={() => {
                      setCurrentMoveIndex(moveHistory.length - 1);
                      setIsLive(true);
                    }}
                    disabled={isLive}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4 -ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Chess board */}
          <div className="lg:col-span-6">
            <div className="bg-black/50 border border-cyan-900 rounded-sm p-4 backdrop-blur-sm">
              {/* Live indicator */}
              {isLive && (
                <div className="flex items-center justify-center mb-3">
                  <div className="flex items-center space-x-2 bg-cyan-950/30 border border-cyan-500 rounded-full px-3 py-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-cyan-400 text-xs font-bold">
                      LIVE
                    </span>
                  </div>
                </div>
              )}

              {/* Chess board */}
              <ChessBoard playerColor="white" />

              {/* Analysis bar (conditionally rendered) */}
              {showAnalysis && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-cyan-400">
                      White advantage
                    </span>
                    <span className="text-xs text-fuchsia-400">
                      Black advantage
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-cyan-400">+0.8</span>
                    <span className="text-xs text-gray-500">
                      Neural evaluation
                    </span>
                  </div>
                </div>
              )}

              {/* Game controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-cyan-500 text-cyan-400 hover:bg-cyan-950/30"
                    onClick={() => handleReaction("thumbsUp")}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {reactionCount.thumbsUp}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-950/30"
                    onClick={() => handleReaction("thumbsDown")}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {reactionCount.thumbsDown}
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-400 hover:bg-gray-900"
                    onClick={() => setShowSpectators(!showSpectators)}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Spectators
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-400 hover:bg-gray-900"
                    onClick={() => setShowChat(!showChat)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-400 hover:bg-gray-900"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar - Chat & Spectators */}
          <div className="lg:col-span-3">
            <AnimatePresence>
              {(showChat || showSpectators) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-black/50 border border-cyan-900 rounded-sm backdrop-blur-sm"
                >
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between px-4 pt-4">
                      <TabsList className="bg-black/50 border border-cyan-900">
                        <TabsTrigger value="chat" className="text-xs">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </TabsTrigger>
                        <TabsTrigger value="spectators" className="text-xs">
                          <Users className="h-4 w-4 mr-1" />
                          Spectators ({spectators.length})
                        </TabsTrigger>
                      </TabsList>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-300"
                        onClick={() => {
                          setShowChat(false);
                          setShowSpectators(false);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <TabsContent value="chat" className="p-4 pt-2">
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-3">
                          {chatMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className="flex items-start space-x-2"
                            >
                              {!msg.isSystem && (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={msg.avatar || "/placeholder.svg"}
                                    alt={msg.username}
                                  />
                                  <AvatarFallback
                                    className={`text-xs ${
                                      msg.isYou
                                        ? "bg-cyan-950 text-cyan-400"
                                        : "bg-black text-gray-400"
                                    }`}
                                  >
                                    {msg.username.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  {msg.isSystem ? (
                                    <span className="text-xs text-gray-500">
                                      {msg.username}
                                    </span>
                                  ) : (
                                    <span
                                      className={`text-sm font-medium ${
                                        msg.isYou
                                          ? "text-cyan-400"
                                          : "text-fuchsia-400"
                                      }`}
                                    >
                                      {msg.username}
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {msg.timestamp}
                                  </span>
                                </div>
                                <p
                                  className={`text-sm ${
                                    msg.isSystem
                                      ? "text-gray-500 italic"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {msg.message}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div ref={chatEndRef} />
                        </div>
                      </ScrollArea>

                      <div className="flex space-x-2 mt-3">
                        <Input
                          placeholder="Send a message..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSendChat()
                          }
                          className="flex-1 bg-black/50 border-cyan-900 text-white placeholder-gray-500"
                        />
                        <Button
                          size="sm"
                          className="bg-cyan-600 hover:bg-cyan-500"
                          onClick={handleSendChat}
                          disabled={!chatInput.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="spectators" className="p-4 pt-2">
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-2">
                          {spectators.map((spectator) => (
                            <div
                              key={spectator.id}
                              className="flex items-center justify-between p-2 rounded-sm hover:bg-gray-900/50"
                            >
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={spectator.avatar || "/placeholder.svg"}
                                    alt={spectator.username}
                                  />
                                  <AvatarFallback className="bg-black text-gray-400 text-xs">
                                    {spectator.username.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm text-white">
                                    {spectator.username}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Rating: {spectator.rating}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                                >
                                  <MessageCircle className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                                >
                                  <Users className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Neural analysis panel */}
            {showAnalysis && (
              <div className="bg-black/50 border border-fuchsia-900 rounded-sm p-4 backdrop-blur-sm mt-4">
                <h3 className="text-fuchsia-400 font-bold mb-3 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Neural Analysis
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">
                        Position evaluation
                      </span>
                      <span className="text-xs text-cyan-400">+0.8</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500"
                        style={{ width: "58%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Best move</span>
                      <span className="text-xs font-mono text-fuchsia-400">
                        Nf6
                      </span>
                    </div>
                    <div className="p-2 bg-black/30 border border-gray-800 rounded-sm">
                      <p className="text-xs text-gray-300">
                        Knight to f6 develops the piece and controls the center.
                        This move prepares for castling and improves piece
                        coordination.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">
                        Win probability
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                          style={{ width: "62%" }}
                        ></div>
                      </div>
                      <span className="text-xs text-cyan-400">62%</span>
                      <span className="text-xs text-fuchsia-400">38%</span>
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-fuchsia-400 to-fuchsia-500"
                          style={{ width: "38%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-950/30 text-xs"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Full Neural Analysis
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
