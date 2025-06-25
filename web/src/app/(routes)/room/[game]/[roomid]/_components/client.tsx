"use client";

import { useEffect, useState } from "react";

import { useTransition } from "@/components/provider/page-transition-provider";
import { ChessGameClean } from "./chess-lobby";
import { usePathname } from "next/navigation";
import { useChessRoomState } from "@/hooks/api/use-chess-play";

interface BotGameSettings {
  difficulty: number;
  timeControl: string;
  color: "white" | "black" | "random";
}

export default function ChessClient({ roomid }: { roomid: string }) {
  const [botSettings, setBotSettings] = useState<BotGameSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { navigateWithTransition, isTransitioning } = useTransition();
  const pathname = usePathname();

  // Extract the last segment from pathname to determine game type
  const lastPathSegment = pathname.split("/").pop() || "";
  const isBotGame = lastPathSegment === "bot";
  const gameType = isBotGame ? ("bot" as const) : ("friend" as const);

  // Only fetch room state if not a bot game
  const {
    data: roomState,
    isLoading: isRoomLoading,
    error: roomError,
  } = useChessRoomState(!isBotGame ? roomid : "");

  useEffect(() => {
    // Load bot settings from localStorage
    const loadBotSettings = () => {
      try {
        const savedSettings = localStorage.getItem("botGameSettings");
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings) as BotGameSettings;
          setBotSettings(parsedSettings);
        } else {
          if (!isTransitioning) {
            navigateWithTransition("/");
          }
        }
      } catch (error) {
        console.error("Error loading bot settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBotSettings();
  }, [isTransitioning, navigateWithTransition]);

  const handleDisconnect = () => {
    localStorage.removeItem("botGameSettings");
    localStorage.removeItem("chessBotGame");
    setBotSettings(null);

    if (!isTransitioning) {
      navigateWithTransition("/lobby");
    }
  };

  if (isLoading || isRoomLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-cyan-400">Loading game configuration...</p>
        </div>
      </div>
    );
  }

  if (roomError) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <p className="text-red-400">
            Failed to load chess room:{" "}
            {roomError instanceof Error ? roomError.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // For now, log the room state
  console.log("Chess room state:", roomState);

  return (
    <ChessGameClean
      roomid={roomid}
      matchType={gameType}
      onDisconnect={handleDisconnect}
      botSettings={botSettings}
      roomState={roomState}
    />
  );
}
