"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, Zap } from "lucide-react";
import { useState, useEffect } from "react";

type TimeControl = "1+0" | "3+0" | "5+0" | "10+0" | "15+10" | "30+0";

interface BotGameSettings {
  difficulty: number;
  timeControl: TimeControl;
  color: "white" | "black" | "random";
}

interface BotConfigProps {
  onBack: () => void;
  onStart: (settings: BotGameSettings) => void;
}

export function BotConfig({ onBack, onStart }: BotConfigProps) {
  const [hasExistingGame, setHasExistingGame] = useState(false);

  // Check for existing game on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const existingGame = localStorage.getItem("chessBotGame");
      setHasExistingGame(!!existingGame);
    }
  }, []);

  // Handle return to existing game
  const handleReturnToGame = () => {
    onStart(loadSettings()); // Start with existing settings
  };
  // Load saved settings from localStorage or use defaults
  const loadSettings = (): BotGameSettings => {
    if (typeof window === "undefined") {
      return {
        difficulty: 3,
        timeControl: "5+0",
        color: "random",
      };
    }
    const saved = localStorage.getItem("botGameSettings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved bot settings", e);
      }
    }
    return {
      difficulty: 3,
      timeControl: "5+0",
      color: "random",
    };
  };

  const [settings, setSettings] = useState<BotGameSettings>(loadSettings);
  const { difficulty, timeControl, color } = settings;
  const timeControls: TimeControl[] = [
    "1+0",
    "3+0",
    "5+0",
    "10+0",
    "15+10",
    "30+0",
  ];

  // Update settings and save to localStorage
  const updateSettings = (updates: Partial<BotGameSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    if (typeof window !== "undefined") {
      localStorage.setItem("botGameSettings", JSON.stringify(newSettings));
    }
    return newSettings;
  };

  // Show return to game prompt if there's an existing game
  if (hasExistingGame) {
    return (
      <div className="relative w-full h-full bg-black/50 border border-cyan-900 rounded-sm backdrop-blur-sm overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20" />
        <div className="relative bg-gray-900/80 p-8 rounded-lg border border-cyan-500/30 max-w-md w-full mx-4 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Game in Progress
          </h2>
          <p className="text-gray-300 text-center mb-6">
            You have an ongoing game against the bot. Would you like to return
            to it?
          </p>
          <div className="flex flex-col space-y-3">
            <Button
              onClick={handleReturnToGame}
              className="bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white"
            >
              Return to Game
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("chessBotGame");
                setHasExistingGame(false);
              }}
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              Start New Game
            </Button>
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-gray-200"
            >
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black/50 border border-cyan-900 rounded-sm backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20" />
      <div className="relative space-y-6 p-6">
        <Button
          variant="ghost"
          className=" text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 text-xs"
          onClick={onBack}
        >
          <ChevronLeft className="h-3 w-3 ml-1" />
          Back to Opponent Selection
        </Button>

        <div className="relative">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Neural Agent Settings
          </h2>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30"></div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 bg-cyan-400 rounded-full"></div>
              <h3 className="text-lg font-medium text-cyan-300">
                Agent Intelligence
              </h3>
            </div>
            <div className="px-4">
              <Slider
                value={[difficulty]}
                onValueChange={(value) =>
                  updateSettings({ difficulty: value[0] })
                }
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Beginner</span>
                <span>Grandmaster</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 bg-fuchsia-400 rounded-full"></div>
              <h3 className="text-lg font-medium text-fuchsia-300">
                Time Control
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {timeControls.map((tc: TimeControl) => (
                <Button
                  key={tc}
                  variant={timeControl === tc ? "default" : "outline"}
                  onClick={() => updateSettings({ timeControl: tc })}
                >
                  {tc}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 bg-purple-400 rounded-full"></div>
              <h3 className="text-lg font-medium text-purple-300">
                Your Color
              </h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant={color === "white" ? "default" : "outline"}
                onClick={() => updateSettings({ color: "white" })}
              >
                White
              </Button>
              <Button
                variant={color === "black" ? "default" : "outline"}
                onClick={() => updateSettings({ color: "black" })}
              >
                Black
              </Button>
              {/* <Button
                variant={color === "random" ? "default" : "outline"}
                onClick={() => {
                  const randomColor = Math.random() < 0.5 ? "white" : "black";
                  updateSettings({ color: randomColor });
                }}
              >
                Random
              </Button> */}
            </div>
          </div>

          <div className="pt-4">
            <Button
              className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white font-medium py-6 text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              size="lg"
              onClick={() => onStart(settings)}
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Neural Duel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
