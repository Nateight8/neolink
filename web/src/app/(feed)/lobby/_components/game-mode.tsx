"use client";

import { Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GameModeSelectorProps {
  onSelectGameMode: () => void;
}

export function GameModeSelector({ onSelectGameMode }: GameModeSelectorProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="relative bg-black/50 border border-cyan-900/50 rounded-sm backdrop-blur-sm overflow-hidden group hover:border-cyan-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 group-hover:opacity-50 transition-opacity" />
          <Button
            className="relative w-full h-16 sm:h-20 bg-transparent hover:bg-transparent p-0 border-0"
            onClick={onSelectGameMode}
          >
            <div className="absolute inset-0.5 bg-gradient-to-br from-black/70 to-black/50 rounded-sm pointer-events-none" />
            <div className="relative z-10 flex items-center w-full h-full px-4 sm:px-6">
              <div className="hidden sm:flex p-1.5 sm:p-2.5 mr-3 sm:mr-4 rounded-md bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 backdrop-blur-sm border border-cyan-500/20 group-hover:border-cyan-400/40 transition-all">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
              </div>
              <div className="text-left">
                <div className="font-bold text-base sm:text-lg bg-gradient-to-r from-cyan-200 to-fuchsia-200 bg-clip-text text-transparent">
                  Quick Match
                </div>
                <div className="text-xs sm:text-sm text-cyan-300/80 group-hover:text-cyan-200/90 transition-colors">
                  Randoms or AI
                </div>
              </div>
            </div>
          </Button>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative bg-black/50 border border-fuchsia-900/50 rounded-sm backdrop-blur-sm overflow-hidden group hover:border-fuchsia-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 group-hover:opacity-50 transition-opacity" />
              <Button className="relative w-full h-16 sm:h-20 bg-transparent hover:bg-transparent p-0 border-0">
                <div className="absolute inset-0.5 bg-gradient-to-br from-black/70 to-black/50 rounded-sm pointer-events-none" />
                <div className="relative z-10 flex items-center w-full h-full px-4 sm:px-6">
                  <div className="hidden sm:flex p-1.5 sm:p-2.5 mr-3 sm:mr-4 rounded-md bg-gradient-to-br from-fuchsia-400/20 to-cyan-500/20 backdrop-blur-sm border border-fuchsia-500/20 group-hover:border-fuchsia-400/40 transition-all">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-fuchsia-300 group-hover:text-fuchsia-200 transition-colors" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base sm:text-lg bg-gradient-to-r from-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
                      Create Room
                    </div>
                    <div className="text-xs sm:text-sm text-fuchsia-300/80 group-hover:text-fuchsia-200/90 transition-colors">
                      Friends
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent variant="production">
            Feature still in production. Try Quick Match!
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

// {
//   id: "blitz",
//   name: "Blitz",
//   time: "3+2",
//   icon: Zap,
//   color: "cyan",
// },
// {
//   id: "rapid",
//   name: "Rapid",
//   time: "10+5",
//   icon: Clock,
//   color: "fuchsia",
// },
// {
//   id: "classical",
//   name: "Classical",
//   time: "30+0",
//   icon: Crown,
//   color: "yellow",
// },
// {
//   id: "custom",
//   name: "Custom",
//   time: "Custom",
//   icon: Settings,
//   color: "green",
// },
