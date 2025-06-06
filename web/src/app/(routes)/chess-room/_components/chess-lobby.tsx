"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Shuffle, Swords, Zap } from "lucide-react";
import { ChessDoorTransition } from "./chess-door-transition";

interface Friend {
  id: string;
  username: string;
  avatar: string;
  status: "online" | "playing" | "offline";
  rating: number;
}

interface ChessLobbyProps {
  currentUser: {
    username: string;
    avatar: string;
    rating: number;
  };
  friends: Friend[];
  onFriendChallenge: (friendId: string) => void;
  onRandomMatch: () => void;
}

export function ChessLobby({
  currentUser,
  friends,
  onFriendChallenge,
  onRandomMatch,
}: ChessLobbyProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [draggedFriend, setDraggedFriend] = useState<string | null>(null);
  const [showDoorTransition, setShowDoorTransition] = useState(false);
  const [matchType, setMatchType] = useState<"friend" | "random" | null>(null);
  const friendChallengeRef = useRef<HTMLButtonElement>(null);

  const handleMainButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFriendChallenge = (friendId?: string) => {
    setMatchType("friend");
    setShowDoorTransition(true);
    if (friendId) {
      onFriendChallenge(friendId);
    }
  };

  const handleRandomMatch = () => {
    setMatchType("random");
    setShowDoorTransition(true);
    onRandomMatch();
  };

  const handleDragStart = (friendId: string) => {
    setDraggedFriend(friendId);
  };

  const handleDragEnd = () => {
    setDraggedFriend(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedFriend) {
      handleFriendChallenge(draggedFriend);
    }
  };

  if (showDoorTransition) {
    return (
      <ChessDoorTransition
        matchType={matchType}
        onTransitionComplete={() => {
          // Handle transition to game
          console.log("Transition to game complete");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="cyber-grid"
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
          <rect width="100%" height="100%" fill="url(#cyber-grid)" />
        </svg>
      </div>

      {/* Neural scan lines */}
      <div className="absolute inset-0 scan-lines opacity-30" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-cyan-500 neural-pulse">
              <AvatarImage
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.username}
              />
              <AvatarFallback className="bg-black text-cyan-400">
                {currentUser.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-cyan-400 neon-text font-cyber">
                {currentUser.username}
              </h2>
              <p className="text-cyan-300 text-sm">
                NEURAL RATING: {currentUser.rating}
              </p>
            </div>
          </div>
          <Badge className="bg-cyan-950/50 text-cyan-400 border-cyan-500 font-cyber">
            <Zap className="h-4 w-4 mr-1" />
            NEURAL CHAMBER
          </Badge>
        </div>
      </div>

      {/* Friends sidebar */}
      <div className="absolute left-6 top-24 bottom-6 w-64 bg-black/80 backdrop-blur-sm border border-cyan-900 rounded-sm p-4">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-30 blur-[1px] -z-10" />

        <h3 className="text-cyan-400 font-bold mb-4 flex items-center font-cyber">
          <Users className="h-5 w-5 mr-2" />
          NEURAL ALLIES
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {friends.map((friend) => (
            <motion.div
              key={friend.id}
              draggable
              onDragStart={() => handleDragStart(friend.id)}
              onDragEnd={handleDragEnd}
              className="flex items-center space-x-3 p-2 rounded-sm bg-black/50 border border-cyan-900 cursor-grab active:cursor-grabbing hover:bg-cyan-950/30 transition-colors relative"
              whileHover={{ scale: 1.02 }}
              whileDrag={{ scale: 1.05, rotate: 2 }}
            >
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm opacity-0 hover:opacity-100 transition-opacity -z-10" />

              <Avatar className="h-10 w-10 border border-cyan-500">
                <AvatarImage
                  src={friend.avatar || "/placeholder.svg"}
                  alt={friend.username}
                />
                <AvatarFallback className="bg-black text-cyan-400 text-sm">
                  {friend.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-cyan-400 font-medium truncate font-cyber">
                  {friend.username}
                </p>
                <p className="text-cyan-300 text-xs">{friend.rating}</p>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${
                  friend.status === "online"
                    ? "bg-cyan-400 neural-pulse"
                    : friend.status === "playing"
                    ? "bg-fuchsia-400"
                    : "bg-gray-600"
                }`}
              />
            </motion.div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-cyan-950/20 rounded-sm border border-cyan-900">
          <p className="text-cyan-300 text-xs text-center">
            DRAG ALLY AVATAR TO FRIEND CHALLENGE BUTTON TO INITIATE NEURAL DUEL
          </p>
        </div>
      </div>

      {/* Central button system */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          {/* Main knight button */}
          <motion.div
            className="relative z-20"
            initial={{ scale: 1 }}
            animate={{ scale: isExpanded ? 0.9 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              onClick={handleMainButtonClick}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 border-4 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)] relative group neural-pulse"
            >
              <Crown className="h-12 w-12 text-white" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300/20 to-fuchsia-300/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </motion.div>

          {/* Expanded buttons */}
          <AnimatePresence>
            {isExpanded && (
              <>
                {/* Friend Challenge Button */}
                <motion.div
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: -120, y: 0 }}
                  exit={{ scale: 0, x: 0, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: 0.1,
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <Button
                    ref={friendChallengeRef}
                    onClick={() => handleFriendChallenge()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 border-4 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)] relative group"
                  >
                    <Swords className="h-8 w-8 text-white" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {draggedFriend && (
                      <div className="absolute inset-0 rounded-full border-4 border-cyan-300 animate-pulse" />
                    )}
                  </Button>
                  <p className="text-cyan-400 text-sm text-center mt-2 font-medium font-cyber">
                    ALLY DUEL
                  </p>
                </motion.div>

                {/* Random Match Button */}
                <motion.div
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: 120, y: 0 }}
                  exit={{ scale: 0, x: 0, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <Button
                    onClick={handleRandomMatch}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-600 to-fuchsia-800 hover:from-fuchsia-500 hover:to-fuchsia-700 border-4 border-fuchsia-400 shadow-[0_0_15px_rgba(255,0,255,0.4)] relative group"
                  >
                    <Shuffle className="h-8 w-8 text-white" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                  <p className="text-fuchsia-400 text-sm text-center mt-2 font-medium font-cyber">
                    RANDOM NEURAL
                  </p>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Instruction text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isExpanded ? 0 : 1, y: isExpanded ? 20 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-32 left-1/2 transform -translate-x-1/2 text-center"
          >
            <p className="text-cyan-400 text-lg font-medium font-cyber neon-text">
              INITIATE NEURAL CHESS PROTOCOL
            </p>
            <p className="text-cyan-300 text-sm mt-1">
              SELECT YOUR BATTLE MODE
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-cyan-500 text-sm opacity-70 font-cyber">
          "IN THE NEURAL GRID, EVERY MOVE ECHOES THROUGH ETERNITY"
        </p>
      </div>
    </div>
  );
}
