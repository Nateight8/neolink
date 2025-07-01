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

  // Fetch room state for both bot games and friend games
  const query = useChessRoomState(roomid, true);
  const roomState = query.data;
  const isRoomLoading = query.isLoading;
  const roomError = query.error;

  useEffect(() => {
    // Load bot settings from localStorage
    const loadBotSettings = () => {
      try {
        const savedSettings = localStorage.getItem("botGameSettings");
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings) as BotGameSettings;
          setBotSettings(parsedSettings);
        } else if (isBotGame) {
          // Only redirect to home if this is a bot game and we don't have settings
          if (!isTransitioning) {
            navigateWithTransition("/");
            return;
          }
        }
      } catch (error) {
        console.error("Error loading bot settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBotSettings();
  }, [isTransitioning, navigateWithTransition, isBotGame]);

  const handleDisconnect = () => {
    localStorage.removeItem("botGameSettings");
    localStorage.removeItem("chessBotGame");
    setBotSettings(null);

    if (!isTransitioning) {
      navigateWithTransition("/lobby");
    }
  };

  if (isLoading || (isRoomLoading && !isBotGame)) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-cyan-400">
            {isBotGame ? 'Setting up bot game...' : 'Loading game configuration...'}
          </p>
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

  // For bot games, we can proceed directly with the bot settings
  if (isBotGame && botSettings) {
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

  // For friend games, check if we have valid room state
  if (!isBotGame && roomState) {
    return (
      <ChessGameClean
        roomid={roomid}
        matchType={gameType}
        onDisconnect={handleDisconnect}
        botSettings={null}
        roomState={roomState}
      />
    );
  }

  // If we get here, something went wrong
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center space-y-4">
        <p className="text-red-400">
          {isBotGame 
            ? 'Failed to load bot settings. Please try again.'
            : 'Failed to load game. The room may not exist or you may not have permission to view it.'
          }
        </p>
        <button
          onClick={() => navigateWithTransition('/')}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
