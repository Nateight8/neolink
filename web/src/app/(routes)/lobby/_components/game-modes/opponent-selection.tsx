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
    <div className="relative bg-black/50 border border-cyan-900 rounded-sm backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20" />
      <div className="relative space-y-6 p-6">
        <Button
          variant="ghost"
          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 text-xs"
          onClick={onBack}
        >
          <ChevronLeft className="h-3 w-3 ml-1" />
          Back to Game Modes
        </Button>

        <div className="relative">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Choose Your Opponent
          </h2>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Button
            variant="outline"
            className="h-32 flex-col gap-2 bg-gray-900/50 hover:bg-gray-800/50 border-gray-800 hover:border-cyan-500/50 transition-colors"
            onClick={() => onSelect("bot")}
          >
            <Bot className="w-12 h-12 text-cyan-400" />
            <span className="text-lg text-cyan-300">Play vs Bot</span>
            <span className="text-sm text-cyan-200/70">
              Practice against AI
            </span>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="h-32 flex-col gap-2 bg-gray-900/50 hover:bg-gray-800/50 border-gray-800 hover:border-fuchsia-500/50 transition-colors"
                onClick={() => onSelect("human")}
              >
                <User className="w-12 h-12 text-fuchsia-400" />
                <span className="text-lg text-fuchsia-300">Play vs Human</span>
                <span className="text-sm text-fuchsia-200/70">
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
