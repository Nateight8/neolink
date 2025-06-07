"use client";

import { useState } from "react";

import { Crown, Zap, Trophy, Star } from "lucide-react";
import LobbyHeader from "./lobby-header";
import GlobalChat from "./global-chat";
import AllyList from "./ally-list";
import GameModeSelector from "./game-mode";
import Live from "./live";
import Ranking from "./ranking";
import Achievements from "./achievements";

// Mock data
const currentUser = {
  id: 1,
  username: "NeuralMaster",
  avatar: "/placeholder.svg?height=64&width=64&text=NM",
  status: "online",
  rating: 1850,
  xp: 2750,
  maxXp: 3000,
  level: 12,
  title: "Cyber Knight",
};

const friends = [
  {
    id: 1,
    username: "QuantumQueen",
    avatar: "/placeholder.svg?height=40&width=40&text=QQ",
    status: "online",
    rating: 1920,
    lastSeen: "now",
  },
  {
    id: 2,
    username: "DataGrandmaster",
    avatar: "/placeholder.svg?height=40&width=40&text=DG",
    status: "playing",
    rating: 2100,
    lastSeen: "5m ago",
  },
  {
    id: 3,
    username: "CodeWarrior",
    avatar: "/placeholder.svg?height=40&width=40&text=CW",
    status: "online",
    rating: 1780,
    lastSeen: "now",
  },
  {
    id: 4,
    username: "AlgoAssassin",
    avatar: "/placeholder.svg?height=40&width=40&text=AA",
    status: "away",
    rating: 1650,
    lastSeen: "15m ago",
  },
  {
    id: 5,
    username: "ByteBishop",
    avatar: "/placeholder.svg?height=40&width=40&text=BB",
    status: "offline",
    rating: 1590,
    lastSeen: "2h ago",
  },
];

const leaderboard = [
  {
    rank: 1,
    username: "CyberGrandmaster",
    rating: 2450,
    change: "+25",
    avatar: "/placeholder.svg?height=32&width=32&text=CG",
  },
  {
    rank: 2,
    username: "NeuralNetwork",
    rating: 2380,
    change: "+12",
    avatar: "/placeholder.svg?height=32&width=32&text=NN",
  },
  {
    rank: 3,
    username: "QuantumLogic",
    rating: 2340,
    change: "-8",
    avatar: "/placeholder.svg?height=32&width=32&text=QL",
  },
  {
    rank: 4,
    username: "DataMaster",
    rating: 2290,
    change: "+18",
    avatar: "/placeholder.svg?height=32&width=32&text=DM",
  },
  {
    rank: 5,
    username: "CodeChampion",
    rating: 2250,
    change: "+5",
    avatar: "/placeholder.svg?height=32&width=32&text=CC",
  },
];

const achievements = [
  {
    id: 1,
    name: "First Victory",
    description: "Win your first game",
    icon: Trophy,
    unlocked: true,
    rarity: "common",
  },
  {
    id: 2,
    name: "Speed Demon",
    description: "Win 10 blitz games",
    icon: Zap,
    unlocked: true,
    rarity: "rare",
  },
  {
    id: 3,
    name: "Neural Link",
    description: "Play 100 games",
    icon: Crown,
    unlocked: false,
    rarity: "epic",
  },
  {
    id: 4,
    name: "Grandmaster",
    description: "Reach 2000 rating",
    icon: Star,
    unlocked: false,
    rarity: "legendary",
  },
];

const ongoingGames = [
  {
    id: 1,
    white: "CyberKnight",
    black: "DataLord",
    time: "15:32",
    spectators: 12,
    whiteRating: 1850,
    blackRating: 1920,
  },
  {
    id: 2,
    white: "QuantumQueen",
    black: "AlgoMaster",
    time: "08:45",
    spectators: 8,
    whiteRating: 1920,
    blackRating: 1780,
  },
  {
    id: 3,
    white: "NeuralNet",
    black: "CodeWarrior",
    time: "22:18",
    spectators: 15,
    whiteRating: 2100,
    blackRating: 1890,
  },
];

const chatMessages = [
  {
    id: 1,
    username: "CyberKnight",
    message: "Anyone up for a quick blitz?",
    time: "2m ago",
    avatar: "/placeholder.svg?height=24&width=24&text=CK",
  },
  {
    id: 2,
    username: "QuantumQueen",
    message: "GG everyone! Great tournament",
    time: "5m ago",
    avatar: "/placeholder.svg?height=24&width=24&text=QQ",
  },
  {
    id: 3,
    username: "DataMaster",
    message: "New neural chess algorithm is insane!",
    time: "8m ago",
    avatar: "/placeholder.svg?height=24&width=24&text=DM",
  },
];

const notifications = [
  {
    id: 1,
    type: "challenge",
    from: "QuantumQueen",
    message: "challenged you to a game",
    time: "2m ago",
  },
  {
    id: 2,
    type: "friend",
    from: "CodeWarrior",
    message: "sent you a friend request",
    time: "5m ago",
  },
  {
    id: 3,
    type: "system",
    message: "Tournament starting in 10 minutes",
    time: "8m ago",
  },
];

export function ChessLobby() {
  const [chatMessage, setChatMessage] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Cyberpunk background effects */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-fuchsia-900/20" />
        <div className="scan-lines" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header with User Profile */}
        <LobbyHeader
          currentUser={currentUser}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />

        {/* Main Layout Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Friends & Chat */}
          <div className="col-span-3 space-y-6">
            {/* Friends List */}
            <AllyList friends={friends} />

            {/* Global Chat */}
            <GlobalChat
              chatMessages={chatMessages}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
            />
          </div>

          {/* Center Content */}
          <div className="col-span-6 space-y-6">
            {/* Game Modes */}
            <GameModeSelector />

            {/* Ongoing Games */}
            <Live ongoingGames={ongoingGames} />
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Leaderboard */}
            <Ranking leaderboard={leaderboard} />

            {/* Achievements */}
            <Achievements achievements={achievements} />
          </div>
        </div>
      </div>
    </div>
  );
}
