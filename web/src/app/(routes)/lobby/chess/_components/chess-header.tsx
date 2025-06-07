import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface ChessHeaderProps {
  isGameOver: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onDisconnect: () => void;
  roomId: string;
}

export default function ChessHeader({
  isGameOver,
  isCheckmate,
  isDraw,
  soundEnabled,
  onToggleSound,
  onDisconnect,
  roomId = "#NX-7842", // Default value for backward compatibility
}: ChessHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-cyan-400 font-cyber neon-text">
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

      <div className="flex items-center space-x-2">
        <Button
          onClick={onToggleSound}
          variant="outline"
          size="icon"
          className={`border-gray-600 ${
            soundEnabled ? "text-cyan-400" : "text-gray-400"
          }`}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>

        <Button
          onClick={onDisconnect}
          variant="outline"
          className="border-red-500 text-red-400 hover:bg-red-950/30"
        >
          DISCONNECT
        </Button>
      </div>
    </div>
  );
}
