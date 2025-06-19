"use client";

import { useState } from "react";
import { useTransition } from "@/components/provider/page-transition-provider";

import { GameModeSelector } from "./game-mode";
import Live from "./live";

import { OpponentSelection } from "./game-modes/opponent-selection";
import { BotConfig } from "./game-modes/bot-config";
import { HumanChallenge } from "./game-modes/human-challenge";
// import Left from "./layout/left";
// import Right from "./layout/right";
import { Zap } from "lucide-react";

// // Mock data
// const currentUser = {
//   id: 1,
//   username: "NeuralMaster",
//   avatar: "/placeholder.svg?height=64&width=64&text=NM",
//   status: "online",
//   rating: 1850,
//   xp: 2750,
//   maxXp: 3000,
//   level: 12,
//   title: "Cyber Knight",
// };

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

type GameModeView =
  | "main"
  | "opponent-selection"
  | "bot-config"
  | "human-challenge"
  | "game";

export function ChessLobby() {
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
      navigateWithTransition("/chess");
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
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gray-900/50 border border-cyan-900/50 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10" />
            <div className="relative z-10 w-full max-w-md mx-auto px-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
                <div className="animate-pulse">
                  <Zap className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 text-cyan-400" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Initializing Neural Duel
                </h3>
                <p className="text-cyan-300/80 text-sm sm:text-base">
                  Loading AI opponent and game environment...
                </p>
                <div className="w-full max-w-xs h-1.5 bg-cyan-900/50 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-500 ease-out"
                    style={{ width: isGameStarting ? "100%" : "0%" }}
                  />
                </div>
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
    <div className=" text-white ">
      {/* Cyberpunk background effects */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-fuchsia-900/20" />
        <div className="scan-lines" />
      </div>

      <div className="min-h-screen">
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {renderGameModeContent()}
        </div>
      </div>
    </div>
  );
}
