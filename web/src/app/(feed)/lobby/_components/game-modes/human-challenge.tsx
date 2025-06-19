"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Zap,
  Users,
  Clock,
  Award as BulletIcon,
  Flame as BlitzIcon,
  Gauge as RapidIcon,
  Clock as ClassicalIcon,
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HumanChallengeProps {
  onBack: () => void;
  onCreateChallenge: (settings: {
    timeControl: string;
    rated: boolean;
  }) => void;
}

export function HumanChallenge({
  onBack,
  onCreateChallenge,
}: HumanChallengeProps) {
  const [timeControl, setTimeControl] = useState("5+0");
  const [rated, setRated] = useState(true);

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
            Create Challenge
          </h2>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30"></div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
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
                          onClick={() => setTimeControl(mode.timeControl)}
                          className={`h-16 sm:h-20 w-full p-0 overflow-hidden transition-all duration-300 ${
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
              <div className="w-1.5 h-5 bg-cyan-400 rounded-full"></div>
              <h3 className="text-base sm:text-lg font-medium text-cyan-300">Game Type</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                {
                  type: "Rated",
                  description: "Official ranked games that affect your rating",
                  icon: <Zap className="w-4 h-4 text-yellow-400" />,
                },
                {
                  type: "Casual",
                  description: "Unofficial games that don't affect your rating",
                  icon: <Users className="w-4 h-4 text-blue-400" />,
                },
              ].map((gameType) => {
                const isSelected = (gameType.type === "Rated") === rated;

                return (
                  <Tooltip key={gameType.type}>
                    <TooltipTrigger asChild>
                      <div className="relative group">
                        <Button
                          variant="ghost"
                          onClick={() => setRated(gameType.type === "Rated")}
                          className={`h-16 sm:h-20 w-full p-0 overflow-hidden transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30"
                              : "bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-cyan-500/30"
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full mb-1.5 ${
                                isSelected
                                  ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                                  : "bg-gray-800/50 border border-gray-700/50"
                              }`}
                            >
                              {gameType.icon}
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                isSelected
                                  ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"
                                  : "text-gray-300 group-hover:text-white"
                              }`}
                            >
                              {gameType.type}
                            </span>
                          </div>
                        </Button>
                        {isSelected && (
                          <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent variant="production" className="max-w-xs">
                      <p className="font-medium">{gameType.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {gameType.description}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <Button
              className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white font-medium py-5 sm:py-6 text-base sm:text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              size="lg"
              onClick={() => onCreateChallenge({ timeControl, rated })}
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Create Challenge</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const chessGameModes = [
  {
    name: "Bullet",
    description:
      "Ultra-fast games where each player has less than 3 minutes total.",
    timeControl: "1+0", // 1 minute with 0 increment
  },
  {
    name: "Blitz",
    description:
      "Fast-paced games, typically between 3 to 5 minutes per player.",
    timeControl: "5+0", // 5 minutes with 0 increment
  },
  {
    name: "Rapid",
    description: "Medium-paced games with more time for deeper calculation.",
    timeControl: "10+0", // 10 minutes with 0 increment
  },
  {
    name: "Classical",
    description:
      "Long games often used in tournaments with deep strategic play.",
    timeControl: "30+0", // 30 minutes with 0 increment
  },
];
