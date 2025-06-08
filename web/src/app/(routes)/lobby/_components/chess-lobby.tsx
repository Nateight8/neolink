"use client";

import { useState } from "react";
import { useTransition } from "@/components/provider/page-transition-provider";
import { Crown, Zap, Trophy, Star } from "lucide-react";
import LobbyHeader from "./lobby-header";
import GlobalChat from "./global-chat";
import AllyList from "./ally-list";
import { GameModeSelector } from "./game-mode";
import Live from "./live";
import Ranking from "./ranking";
import Achievements from "./achievements";
import { OpponentSelection } from "./game-modes/opponent-selection";
import { BotConfig } from "./game-modes/bot-config";
import { HumanChallenge } from "./game-modes/human-challenge";

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

type GameModeView =
  | "main"
  | "opponent-selection"
  | "bot-config"
  | "human-challenge"
  | "game";

export function ChessLobby() {
  const [chatMessage, setChatMessage] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [gameModeView, setGameModeView] = useState<GameModeView>("main");
  const [showLiveGames, setShowLiveGames] = useState(true);
  const [isGameStarting, setIsGameStarting] = useState(false);
  const transition = useTransition();
  const navigateWithTransition =
    transition?.navigateWithTransition ||
    ((path: string) => {
      if (typeof window !== "undefined") {
        window.location.href = path;
      }
    });

  const handleGameModeSelect = () => {
    setGameModeView("opponent-selection");
    setShowLiveGames(false);
  };

  const handleOpponentSelect = (opponent: "bot" | "human") => {
    setGameModeView(opponent === "bot" ? "bot-config" : "human-challenge");
  };

  const handleBackToGameModes = () => {
    setGameModeView("main");
    setShowLiveGames(true);
  };

  const handleBackToOpponentSelection = () => {
    setGameModeView("opponent-selection");
  };

  interface BotGameSettings {
    difficulty: number;
    timeControl: string;
    color: "white" | "black" | "random";
  }

  interface ChallengeSettings {
    timeControl: string;
    rated: boolean;
  }

  const handleStartBotGame = (settings: BotGameSettings) => {
    console.log("Starting bot game with settings:", settings);
    setIsGameStarting(true);
    setGameModeView("game");

    // After 5 seconds, redirect to the chess page with transition
    const timer = setTimeout(() => {
      navigateWithTransition("/lobby/chess");
    }, 5000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  };

  const handleCreateChallenge = (settings: ChallengeSettings) => {
    console.log("Creating challenge with settings:", settings);
    // TODO: Implement challenge creation logic
    setGameModeView("game");
  };

  const renderGameModeContent = () => {
    switch (gameModeView) {
      case "opponent-selection":
        return (
          <OpponentSelection
            onSelect={handleOpponentSelect}
            onBack={handleBackToGameModes}
          />
        );
      case "bot-config":
        return (
          <BotConfig
            onBack={handleBackToOpponentSelection}
            onStart={handleStartBotGame}
          />
        );
      case "human-challenge":
        return (
          <HumanChallenge
            onBack={handleBackToOpponentSelection}
            onCreateChallenge={handleCreateChallenge}
          />
        );
      case "game":
        return (
          <div className="w-full h-[600px] bg-gray-900/50 border border-cyan-900/50 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10" />
            <div className="relative z-10 text-center space-y-4">
              <div className="animate-pulse">
                <Zap className="h-16 w-16 mx-auto text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                Initializing Neural Duel
              </h3>
              <p className="text-cyan-300/80 max-w-md">
                Loading AI opponent and game environment...
              </p>
              <div className="w-48 h-1.5 bg-cyan-900/50 rounded-full overflow-hidden mx-auto mt-6">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-500 ease-out"
                  style={{ width: isGameStarting ? "100%" : "0%" }}
                />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <GameModeSelector onSelectGameMode={handleGameModeSelect} />
            {showLiveGames && <Live ongoingGames={ongoingGames} />}
          </>
        );
    }
  };

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
            <div className="relative group">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                <div className="bg-gradient-to-br from-cyan-900/30 to-fuchsia-900/30 border border-cyan-500/30 rounded-lg p-6 max-w-xs text-center">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-2">
                    Friends List
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Coming Soon: Connect with friends, see who&apos;s online,
                    and challenge them to a game.
                  </p>
                  <div className="text-xs text-gray-500">Release: Q3 2025</div>
                </div>
              </div>
              <AllyList friends={friends} />
            </div>

            {/* Global Chat */}
            <div className="relative group">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                <div className="bg-gradient-to-br from-cyan-900/30 to-fuchsia-900/30 border border-cyan-500/30 rounded-lg p-6 max-w-xs text-center">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-2">
                    Global Chat
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Coming Soon: Chat with the community, discuss strategies,
                    and make new friends.
                  </p>
                  <div className="text-xs text-gray-500">Release: Q3 2025</div>
                </div>
              </div>
              <GlobalChat
                chatMessages={chatMessages}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
              />
            </div>
          </div>

          {/* Center Content */}
          <div className="col-span-6 space-y-6">{renderGameModeContent()}</div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Leaderboard */}
            <div className="relative group">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                <div className="bg-gradient-to-br from-cyan-900/30 to-fuchsia-900/30 border border-cyan-500/30 rounded-lg p-6 max-w-xs text-center">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-2">
                    Leaderboard
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Coming Soon: Track top players, climb the ranks, and see how
                    you compare to the community.
                  </p>
                  <div className="text-xs text-gray-500">Release: Q3 2025</div>
                </div>
              </div>
              <Ranking leaderboard={leaderboard} />
            </div>

            {/* Achievements */}
            <div className="relative group">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                <div className="bg-gradient-to-br from-cyan-900/30 to-fuchsia-900/30 border border-cyan-500/30 rounded-lg p-6 max-w-xs text-center">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-2">
                    Achievements
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Coming Soon: Unlock achievements, complete challenges, and
                    show off your progress.
                  </p>
                  <div className="text-xs text-gray-500">Release: Q3 2025</div>
                </div>
              </div>
              <Achievements achievements={achievements} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
