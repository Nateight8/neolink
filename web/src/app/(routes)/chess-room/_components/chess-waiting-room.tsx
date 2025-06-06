"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Eye, Users, Clock, Shield } from "lucide-react";
import type { Player } from "./chess-room";

interface ChessWaitingRoomProps {
  roomId: string;
  currentUser: Player;
  onJoinGame: () => void;
  onSpectateGame: () => void;
}

export function ChessWaitingRoom({
  roomId,
  currentUser,
  onJoinGame,
  onSpectateGame,
}: ChessWaitingRoomProps) {
  const [doorOpen, setDoorOpen] = useState(false);
  const [hasJoinedGame, setHasJoinedGame] = useState(false);

  const handleJoinGame = () => {
    setHasJoinedGame(true);
    onJoinGame();
  };

  useEffect(() => {
    // Trigger door opening animation after a short delay
    const timer = setTimeout(() => {
      setDoorOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 overflow-hidden bg-black relative">
      {/* Circuit pattern background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="circuit-pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M10 10h80M10 10v80M90 10v80M10 90h80M50 10v80M10 50h80"
              stroke="cyan"
              strokeWidth="0.5"
              fill="none"
            />
            <circle cx="10" cy="10" r="2" fill="cyan" />
            <circle cx="90" cy="10" r="2" fill="cyan" />
            <circle cx="10" cy="90" r="2" fill="cyan" />
            <circle cx="90" cy="90" r="2" fill="cyan" />
            <circle cx="50" cy="50" r="3" fill="fuchsia" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      {/* Door panels */}
      <motion.div
        className="absolute inset-0 bg-black z-30 flex flex-col"
        initial={{ opacity: 1 }}
        animate={{ opacity: doorOpen ? 0 : 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        style={{ pointerEvents: doorOpen ? "none" : "auto" }}
      >
        {/* Top door panel */}
        <motion.div
          className="h-1/2 w-full bg-black border-b-2 border-cyan-500 relative"
          initial={{ y: 0 }}
          animate={{ y: doorOpen ? "-100%" : 0 }}
          transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
        >
          <div className="absolute inset-0 chess-neural-scan opacity-30" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-cyan-300 to-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.7)]" />

          {/* Circuit patterns */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 border-2 border-cyan-500 rounded-full relative mx-auto">
                <div className="absolute inset-2 border border-cyan-700 rounded-full" />
                <div className="absolute inset-6 border border-cyan-600 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="h-12 w-12 text-cyan-500" />
                </div>
              </div>
              <div className="text-cyan-400 font-cyber text-lg">
                NEURAL CHESS PROTOCOL
              </div>
              <div className="text-cyan-300 text-sm">
                WAITING FOR OPPONENT...
              </div>
            </div>
          </div>

          {/* Side indicators */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
            <div className="text-cyan-500 font-mono text-sm">
              NEURAL CHESS PROTOCOL
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            <div className="text-cyan-500 font-mono text-sm">
              SECURE CONNECTION
            </div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
          </div>
        </motion.div>

        {/* Bottom door panel */}
        <motion.div
          className="h-1/2 w-full bg-black border-t-2 border-fuchsia-500 relative"
          initial={{ y: 0 }}
          animate={{ y: doorOpen ? "100%" : 0 }}
          transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
        >
          <div className="absolute inset-0 chess-neural-scan opacity-30" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 via-fuchsia-300 to-fuchsia-500 shadow-[0_0_10px_rgba(255,0,255,0.7)]" />

          {/* Circuit patterns */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 border-2 border-fuchsia-500 rounded-full relative mx-auto">
                <div className="absolute inset-2 border border-fuchsia-700 rounded-full" />
                <div className="absolute inset-6 border border-fuchsia-600 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="h-12 w-12 text-fuchsia-500" />
                </div>
              </div>
              <div className="text-fuchsia-400 font-cyber text-lg">
                QUANTUM ENCRYPTION
              </div>
              <div className="text-fuchsia-300 text-sm">CHALLENGE SENT...</div>
            </div>
          </div>

          {/* Side indicators */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <div className="w-3 h-3 bg-fuchsia-500 rounded-full animate-pulse" />
            <div className="text-fuchsia-500 font-mono text-sm">
              QUANTUM ENCRYPTION
            </div>
          </div>

          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <div className="text-fuchsia-500 font-mono text-sm">
              SYSTEM READY
            </div>
            <div className="w-3 h-3 bg-fuchsia-500 rounded-full animate-pulse" />
          </div>
        </motion.div>
      </motion.div>

      {/* Main waiting room content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: doorOpen ? 1 : 0, scale: doorOpen ? 1 : 0.95 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="max-w-2xl w-full z-20"
      >
        {/* Main waiting interface */}
        <div className="bg-black/80 border border-cyan-900 rounded-sm p-8 relative">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30 rounded-sm blur-sm -z-10" />

          {/* Neural scanning effect */}
          <div className="absolute inset-0 chess-neural-scan opacity-20 pointer-events-none rounded-sm" />

          <div className="text-center space-y-6">
            {/* Header */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <h1 className="text-4xl font-bold text-white font-cyber">
                NEURAL CHESS CHAMBER
              </h1>
              <Badge
                variant="outline"
                className="bg-cyan-950/50 border-cyan-500 text-cyan-400"
              >
                ROOM: {roomId}
              </Badge>
            </motion.div>

            {/* Current user display */}
            <motion.div
              className="flex items-center justify-center space-x-4 py-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <Avatar className="h-16 w-16 border-2 border-cyan-500">
                <AvatarImage
                  src={currentUser.avatar || "/placeholder.svg"}
                  alt={currentUser.username}
                />
                <AvatarFallback className="bg-black text-cyan-400 text-lg">
                  {currentUser.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <h2 className="text-xl font-bold text-white font-cyber">
                  {currentUser.username}
                </h2>
                <p className="text-cyan-400">
                  NEURAL RATING: {currentUser.rating}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm">CONNECTED</span>
                </div>
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-cyan-400 font-cyber"
              >
                SCANNING FOR NEURAL OPPONENTS...
              </motion.div>

              {/* Scanning animation */}
              <div className="relative h-2 bg-gray-900 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full"
                  animate={{ width: ["0%", "100%", "0%"] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              <Button
                onClick={handleJoinGame}
                disabled={hasJoinedGame}
                className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)] relative group disabled:opacity-50"
              >
                <Zap className="h-4 w-4 mr-2" />
                {hasJoinedGame ? "CHALLENGE SENT" : "START NEURAL DUEL"}
              </Button>

              <Button
                onClick={onSpectateGame}
                variant="outline"
                className="border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-950/30 hover:text-fuchsia-300"
              >
                <Eye className="h-4 w-4 mr-2" />
                OBSERVE BATTLE
              </Button>
            </motion.div>

            {/* Room info */}
            <motion.div
              className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2 }}
            >
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-400 text-sm">ACTIVE PLAYERS</p>
                <p className="text-white font-bold">1,247</p>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-400 text-sm">AVG WAIT TIME</p>
                <p className="text-white font-bold">0:45</p>
              </div>
              <div className="text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-400 text-sm">NEURAL SYNC</p>
                <p className="text-green-400 font-bold">98.7%</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: doorOpen ? 1 : 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="mt-6 text-center text-gray-500 text-sm"
        >
          <p>
            Neural chess protocol v2.1 • Quantum-encrypted moves • Real-time
            synaptic feedback
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
