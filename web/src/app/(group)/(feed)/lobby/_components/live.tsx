"use client";

import { Button } from "@/components/ui/button";
import { Clock, Crown, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Game {
  id: number;
  white: string;
  black: string;
  time: string;
  spectators: number;
  whiteRating: number;
  blackRating: number;
}

export default function Live({ ongoingGames }: { ongoingGames: Game[] }) {
  return (
    <div className="relative group ">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative bg-black/70 border border-cyan-900/50 rounded-sm p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-fuchsia-500/5 rounded-sm -z-10" />

        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent flex items-center">
            <div className="relative mr-2">
              <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
              <span className="absolute inset-0 bg-cyan-400 rounded-full opacity-20 animate-ping" />
            </div>
            <span className="text-sm sm:text-base md:text-lg lg:text-xl">
              Live Duels
            </span>
          </h3>
          <div className="flex items-center space-x-1 bg-cyan-900/30 px-2 py-1 rounded-md">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-cyan-400 font-mono">
              {ongoingGames.length}
            </span>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {ongoingGames.map((game) => {
            const isHighRating =
              game.whiteRating > 2000 || game.blackRating > 2000;
            return (
              <div
                key={game.id}
                className="group relative p-0 rounded-sm bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 hover:from-cyan-500/20 hover:to-fuchsia-500/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              >
                <div className="absolute inset-0.5 bg-black/80 rounded-sm" />
                <div className="relative flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gradient-to-b from-gray-900/70 to-black/70">
                  <div
                    className={`relative hidden md:flex w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-sm flex-shrink-0  items-center justify-center overflow-hidden ${
                      isHighRating ? "animate-pulse" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/80 to-fuchsia-900/80" />
                    <Crown
                      className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${
                        isHighRating ? "text-yellow-400" : "text-cyan-400"
                      }`}
                    />
                    {isHighRating && (
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2 gap-y-0.5">
                      <span className="text-xs sm:text-sm font-medium text-cyan-300 truncate max-w-[70px] xs:max-w-[90px] sm:max-w-[100px] md:max-w-[120px]">
                        {game.white}
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono text-cyan-400/80">
                        {game.whiteRating}
                      </span>
                      <span className="text-fuchsia-400 text-[10px] sm:text-xs px-0.5">
                        vs
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-fuchsia-300 truncate max-w-[70px] xs:max-w-[90px] sm:max-w-[100px] md:max-w-[120px]">
                        {game.black}
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono text-fuchsia-400/80">
                        {game.blackRating}
                      </span>
                    </div>

                    <div className="flex items-center flex-wrap gap-x-2 sm:gap-x-3 mt-0.5">
                      <span className="flex items-center text-[10px] sm:text-xs text-gray-400 group-hover:text-cyan-300 transition-colors">
                        <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 sm:mr-1.5 text-cyan-400" />
                        {game.time}
                      </span>
                      <span className="flex items-center text-[10px] sm:text-xs text-gray-400 group-hover:text-fuchsia-300 transition-colors">
                        <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 sm:mr-1.5 text-fuchsia-400" />
                        {game.spectators}
                      </span>
                    </div>
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="relative z-10 h-8 sm:h-9 px-2 sm:px-3 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-white hover:border-cyan-400/50 transition-all group/button flex-shrink-0"
                        >
                          <span className="absolute inset-0 rounded-sm bg-gradient-to-r from-cyan-500/20 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity" />
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 md:mr-1.5" />
                          <span className="hidden md:block sm:text-xs">
                            Watch
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent variant="production" side="top">
                        <p className="text-xs">Spectate this game</p>
                        <p className="text-xxs text-gray-400">Coming soon</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
