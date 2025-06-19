import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  Flag,
  Handshake,
  ArrowBigLeftDashIcon,
} from "lucide-react";

import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChessHeaderProps {
  isGameOver: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  soundEnabled: boolean;
  isPaused?: boolean;
  showSpectators?: boolean;
  onToggleSound: () => void;
  onPauseResume: () => void;
  onSurrender: () => void;
  onOfferDraw: () => void;
  onToggleSpectators: () => void;
  roomId: string;
}

export default function ChessHeader({
  isGameOver,
  isCheckmate,
  isDraw,
  soundEnabled,
  onToggleSound,
  onPauseResume,
  onSurrender,
  onOfferDraw,
  onToggleSpectators,
  isPaused = false,
  showSpectators = false,
  roomId = "#NX-7842", // Default value for backward compatibility
}: ChessHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between md:mb-6 mb-4">
      <TooltipProvider>
        <div className="flex justify-between  items-center space-x-4">
          <h1 className=" md:text-2xl font-bold text-cyan-400 font-cyber neon-text">
            NEURAL CHESS DUEL
          </h1>
          <Badge
            variant="outline"
            className="bg-cyan-950/50 border-cyan-500 text-cyan-400"
          >
            ROOM: {roomId}
          </Badge>
          {isGameOver && (
            <Badge
              variant="outline"
              className="bg-red-950/50 border-red-500 text-red-400"
            >
              {isCheckmate ? "CHECKMATE" : isDraw ? "DRAW" : "GAME OVER"}
            </Badge>
          )}
        </div>

        <div className="flex md:items-center space-x-2 py-2">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="icon"
            className={`border-gray-600 hover:bg-gray-800 ${
              soundEnabled ? "text-cyan-400" : "text-gray-400"
            }`}
          >
            <ArrowBigLeftDashIcon />
          </Button>
          {/* Sound Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleSound}
                variant="outline"
                size="icon"
                className={`border-gray-600 hover:bg-gray-800 ${
                  soundEnabled ? "text-cyan-400" : "text-gray-400"
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{soundEnabled ? "Mute sound" : "Unmute sound"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Pause/Resume Game */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onPauseResume}
                variant="outline"
                size="icon"
                className="border-amber-600/50 text-amber-400 hover:bg-amber-950/30"
                disabled={isGameOver}
              >
                {isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isPaused ? "Resume game" : "Pause game"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Offer Draw */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onOfferDraw}
                variant="outline"
                size="icon"
                className="border-blue-600/50 text-blue-400 hover:bg-blue-950/30"
                disabled={isGameOver}
              >
                <Handshake className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Offer draw</p>
            </TooltipContent>
          </Tooltip>

          {/* Toggle Spectators */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleSpectators}
                variant="outline"
                size="icon"
                className={`border-purple-600/50 md:hidden hover:bg-purple-950/30 ${
                  showSpectators ? "text-purple-400" : "text-purple-400/60"
                }`}
              >
                <Users className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showSpectators ? "Hide spectators" : "Show spectators"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Surrender */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onSurrender}
                variant="outline"
                size="icon"
                className="border-red-600/50 text-red-400 hover:bg-red-950/30"
                disabled={isGameOver}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Surrender</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
