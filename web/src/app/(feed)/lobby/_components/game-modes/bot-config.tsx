"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ChevronLeft,
  Zap,
  Award as BulletIcon,
  Flame as BlitzIcon,
  Gauge as RapidIcon,
  Clock,
  Clock as ClassicalIcon,
  Shuffle,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { IconChessRook, IconChessRookFilled } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const chessGameModes = [
  {
    name: "Bullet",
    description:
      "Ultra-fast games where each player has less than 3 minutes total.",
    timeControl: "1+0",
  },
  {
    name: "Blitz",
    description:
      "Fast-paced games, typically between 3 to 5 minutes per player.",
    timeControl: "5+0",
  },
  {
    name: "Rapid",
    description: "Medium-paced games with more time for deeper calculation.",
    timeControl: "10+0",
  },
  {
    name: "Classical",
    description:
      "Long games often used in tournaments with deep strategic play.",
    timeControl: "30+0",
  },
];

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayColor, setDisplayColor] = useState<"white" | "black">(() =>
    settings.color === "random"
      ? "white"
      : (settings.color as "white" | "black")
  );
  const animationRef = useRef<number | null>(null);
  const animationStartTime = useRef<number>(0);

  const currentSettings = isAnimating
    ? { ...settings, color: displayColor }
    : settings;

  const { difficulty, timeControl, color } = currentSettings;

  // Update settings and save to localStorage
  const updateSettings = (
    updates: Partial<BotGameSettings>,
    skipSave = false
  ) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    if (typeof window !== "undefined" && !skipSave) {
      localStorage.setItem("botGameSettings", JSON.stringify(newSettings));
    }
    return newSettings;
  };

  // Animation loop for random color selection
  const animateColor = (timestamp: number) => {
    if (!animationStartTime.current) {
      animationStartTime.current = timestamp;
    }

    const elapsed = timestamp - animationStartTime.current;
    const totalDuration = 2000; // 2 seconds total
    const toggleSpeed = 100; // ms between toggles

    // Toggle between white and black during animation
    setDisplayColor((prev) => (prev === "white" ? "black" : "white"));

    if (elapsed < totalDuration) {
      // Continue animation
      setTimeout(() => {
        if (animationRef.current !== null) {
          animationRef.current = requestAnimationFrame(animateColor);
        }
      }, toggleSpeed);
    } else {
      // Animation complete, set final color
      const finalColor = Math.random() < 0.5 ? "white" : "black";
      setDisplayColor(finalColor);
      updateSettings({ color: finalColor });

      // Show redirecting message
      const button = document.querySelector(".start-button");
      if (button) {
        button.innerHTML = `
          <span class="inline-flex items-center">
            <span>Starting as </span>
            <span class="mx-1 font-bold text-cyan-300">${
              finalColor.charAt(0).toUpperCase() + finalColor.slice(1)
            }</span>
            <span>...</span>
          </span>
        `;
      }

      // Start the game after a short delay
      setTimeout(() => {
        setIsAnimating(false);
        onStart({ ...settings, color: finalColor });
      }, 800);
    }
  };

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  const handleRandomClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    animationStartTime.current = 0;
    if (animationRef.current === null) {
      animationRef.current = requestAnimationFrame(animateColor);
    }
  };

  // Show return to game prompt if there's an existing game
  if (hasExistingGame) {
    return (
      <div className="relative w-full h-[50svh] bg-black/50 border border-cyan-900 rounded-sm backdrop-blur-sm overflow-hidden flex items-center justify-center">
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
    <div className="relative w-full h-full bg-black/50 border border-cyan-900/50 rounded-sm backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20" />
      <div className="relative space-y-4 sm:space-y-6 p-4">
        <Button
          variant="ghost"
          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 text-xs px-2 py-1.5 -ml-2"
          onClick={onBack}
        >
          <ChevronLeft className="h-3.5 w-3.5 sm:h-3 sm:w-3 mr-1" />
          <span className="text-xs sm:text-sm">Back</span>
        </Button>

        <div className="relative">
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Neural Agent Settings
          </h2>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30"></div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 bg-cyan-400 rounded-full"></div>
              <h3 className="text-base sm:text-lg font-medium text-cyan-300">
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

          <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 bg-fuchsia-400 rounded-full"></div>
              <h3 className="text-base sm:text-lg font-medium text-fuchsia-300">
                Time Control
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {chessGameModes.map((mode) => {
                const isSelected = timeControl === mode.timeControl;
                const iconMap = {
                  Bullet: <BulletIcon className="w-4 h-4 text-yellow-400" />,
                  Blitz: <BlitzIcon className="w-4 h-4 text-orange-400" />,
                  Rapid: <RapidIcon className="w-4 h-4 text-green-400" />,
                  Classical: (
                    <ClassicalIcon className="w-4 h-4 text-blue-400" />
                  ),
                };
                const icon = iconMap[mode.name as keyof typeof iconMap] || (
                  <Clock className="w-4 h-4" />
                );

                return (
                  <Tooltip key={mode.name}>
                    <TooltipTrigger asChild>
                      <div className="relative group">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            updateSettings({
                              timeControl: mode.timeControl as TimeControl,
                            })
                          }
                          className={`h-20 w-full p-0 overflow-hidden transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-to-br from-fuchsia-900/30 to-cyan-900/30 border border-fuchsia-500/30"
                              : "bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-fuchsia-500/30"
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full mb-1.5 ${
                                isSelected
                                  ? "bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-500/30"
                                  : "bg-gray-800/50 border border-gray-700/50"
                              }`}
                            >
                              {icon}
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                isSelected
                                  ? "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-cyan-300"
                                  : "text-gray-300 group-hover:text-white"
                              }`}
                            >
                              {mode.name}
                            </span>
                            <span
                              className={`text-xs mt-0.5 ${
                                isSelected
                                  ? "text-fuchsia-200/80"
                                  : "text-gray-400 group-hover:text-gray-200"
                              }`}
                            >
                              {mode.timeControl}
                            </span>
                          </div>
                        </Button>
                        {isSelected && (
                          <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent variant="production" className="max-w-xs">
                      <p className="font-medium">
                        {mode.name} ({mode.timeControl})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {mode.description}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 bg-purple-400 rounded-full"></div>
              <h3 className="text-base sm:text-lg font-medium text-purple-300">
                Your Color
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => updateSettings({ color: "white" })}
                    className={`h-20 w-full p-0 overflow-hidden transition-all duration-300 relative ${
                      color === "white"
                        ? "bg-gradient-to-br from-gray-100/10 to-gray-300/10 border border-gray-300/30"
                        : "bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-gray-400/30"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100/5 to-gray-300/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full mb-1.5 ${
                          color === "white"
                            ? "bg-gradient-to-br from-gray-200/20 to-gray-400/20 border border-gray-300/30"
                            : "bg-gray-800/50 border border-gray-700/50"
                        }`}
                      >
                        <IconChessRook className="w-5 h-5 text-cyan-300" />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          color === "white"
                            ? "text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400"
                            : "text-gray-300 group-hover:text-white"
                        }`}
                      >
                        White
                      </span>
                    </div>
                    {color === "white" && (
                      <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-gray-300 to-gray-100 rounded-full" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent variant="production">
                  <p>Play as White (moves first)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => updateSettings({ color: "black" })}
                    className={`h-20 w-full p-0 overflow-hidden transition-all duration-300 relative ${
                      color === "black"
                        ? "bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-400/50 shadow-lg shadow-gray-900/30"
                        : "bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-gray-600/30"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800/5 to-gray-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full mb-1.5 ${
                          color === "black"
                            ? "bg-gradient-to-br from-gray-700/50 to-gray-900/50 border border-gray-500/50"
                            : "bg-gray-800/50 border border-gray-700/50"
                        }`}
                      >
                        <IconChessRookFilled className="w-5 h-5 text-fuchsia-300" />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          color === "black"
                            ? "text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400"
                            : "text-gray-300 group-hover:text-white"
                        }`}
                      >
                        Black
                      </span>
                    </div>
                    {color === "black" && (
                      <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent variant="production">
                  <p>Play as Black (moves second)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={handleRandomClick}
                    disabled={isAnimating}
                    className={`h-20 w-full p-0 overflow-hidden transition-all duration-300 relative ${
                      color === "random" || isAnimating
                        ? "bg-gradient-to-br from-purple-900/10 to-fuchsia-900/10 border border-fuchsia-500/30"
                        : "bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-fuchsia-500/30"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full mb-1.5 ${
                          color === "random" || isAnimating
                            ? "bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-fuchsia-500/30"
                            : "bg-gray-800/50 border border-gray-700/50"
                        }`}
                      >
                        {isAnimating ? (
                          <Loader2 className="w-5 h-5 text-fuchsia-300 animate-spin" />
                        ) : (
                          <Shuffle
                            className={`w-5 h-5 ${
                              color === "random"
                                ? "text-fuchsia-300"
                                : "text-gray-500 group-hover:text-gray-300"
                            }`}
                          />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          color === "random" || isAnimating
                            ? "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-purple-300"
                            : "text-gray-300 group-hover:text-white"
                        }`}
                      >
                        {isAnimating ? "Choosing..." : "Random"}
                      </span>
                    </div>
                    {color === "random" && (
                      <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent variant="production">
                  <p>Let the system randomly choose your color</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="pt-2">
            <Button
              className="start-button w-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white font-medium py-5 sm:py-6 text-base sm:text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              size="lg"
              onClick={() => onStart(settings)}
              disabled={isAnimating}
            >
              {isAnimating ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              )}
              {isAnimating ? (
                <span className="inline-flex items-center text-sm sm:text-base">
                  <span>Preparing match</span>
                  <span className="animate-pulse">...</span>
                </span>
              ) : (
                <span className="text-sm sm:text-base">Start Neural Duel</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
