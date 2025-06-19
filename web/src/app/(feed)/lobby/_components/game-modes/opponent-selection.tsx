"use client";

import { Button } from "@/components/ui/button";
import { Bot, User, ChevronLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OpponentSelectionProps {
  onSelect: (opponent: "bot" | "human") => void;
  onBack: () => void;
}

export function OpponentSelection({
  onSelect,
  onBack,
}: OpponentSelectionProps) {
  return (
    <div className="relative bg-black/50 border border-cyan-900/50 rounded-sm backdrop-blur-sm overflow-hidden w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20" />
      <div className="relative space-y-4 sm:space-y-6 p-4 sm:p-6">
        <Button
          variant="ghost"
          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 text-xs px-2 py-1.5 -ml-2"
          onClick={onBack}
        >
          <ChevronLeft className="h-3.5 w-3.5 sm:h-3 sm:w-3 mr-1" />
          <span className="text-xs sm:text-sm">Back</span>
        </Button>

        <div className="relative">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Choose Your Opponent
          </h2>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30"></div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 pt-1 sm:pt-2">
          <Button
            variant="outline"
            className="h-24 sm:h-28 md:h-32 flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-gray-900/50 hover:bg-gray-800/50 border-gray-800 hover:border-cyan-500/50 transition-colors"
            onClick={() => onSelect("bot")}
          >
            <Bot className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-cyan-400 flex-shrink-0" />
            <span className="text-base sm:text-lg font-medium text-cyan-300">Play vs Bot</span>
            <span className="text-xs sm:text-sm text-cyan-200/70 text-center">
              Practice against AI
            </span>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="h-24 sm:h-28 md:h-32 flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-gray-900/50 hover:bg-gray-800/50 border-gray-800 hover:border-fuchsia-500/50 transition-colors"
                onClick={() => onSelect("human")}
              >
                <User className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-fuchsia-400 flex-shrink-0" />
                <span className="text-base sm:text-lg font-medium text-fuchsia-300">Play vs Human</span>
                <span className="text-xs sm:text-sm text-fuchsia-200/70 text-center">
                  Challenge real players
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs" variant="production">
              This feature is still in production. You can see the UI but
              functionality is not available yet.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
