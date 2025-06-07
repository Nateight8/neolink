"use client";

import { useEffect, useState } from "react";
import { ChessGameClean } from "./_components/chess-lobby";
import { useTransition } from "@/components/provider/page-transition-provider";
interface BotGameSettings {
  difficulty: number;
  timeControl: string;
  color: "white" | "black" | "random";
}

export default function ChessGameCleanPage() {
  const [botSettings, setBotSettings] = useState<BotGameSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load bot settings from localStorage
    const loadBotSettings = () => {
      try {
        const savedSettings = localStorage.getItem("botGameSettings");
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings) as BotGameSettings;
          setBotSettings(parsedSettings);
          console.log("Loaded bot settings:", parsedSettings);
        } else {
          console.log("No saved bot settings found");
        }
      } catch (error) {
        console.error("Error loading bot settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBotSettings();
  }, []);

  const { navigateWithTransition, isTransitioning } = useTransition();

  const handleDisconnect = () => {
    localStorage.removeItem("botGameSettings");
    setBotSettings(null);

    if (!isTransitioning) {
      navigateWithTransition("/lobby");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-cyan-400">Loading game configuration...</p>
        </div>
      </div>
    );
  }

  // Determine if this is a bot game based on the presence of botSettings
  const gameType = botSettings ? ("bot" as const) : ("friend" as const);

  return (
    <ChessGameClean
      matchType={gameType}
      onDisconnect={handleDisconnect}
      botSettings={botSettings}
    />
  );
}
