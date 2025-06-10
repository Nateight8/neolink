import { Button } from "@/components/ui/button";
import { Flag, Handshake, Pause, Play } from "lucide-react";

interface GameControllerProps {
  onResign: () => void;
  onDrawOffer: () => void;
  isGameOver: boolean;
  isPlayerTurn: boolean;
  isPaused: boolean;
  onPause: () => void;
}

export default function GameController({
  onResign,
  onDrawOffer,
  isGameOver,
  isPlayerTurn,
  isPaused,
  onPause,
}: GameControllerProps) {
  return (
    <>
      <div className="w-full ">
        <div className="bg-black/80 border border-gray-800 rounded-sm p-4 space-y-3 relative">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-gray-700/20 to-gray-700/10 rounded-sm opacity-30 blur-[1px] -z-10" />
          <h4 className="text-cyan-400 font-cyber text-sm">NEURAL CONTROLS</h4>

          <Button
            onClick={onResign}
            variant="outline"
            className="w-full border-red-500 text-red-400 hover:bg-red-950/30"
            disabled={isGameOver || !isPlayerTurn}
          >
            <Flag className="h-4 w-4 mr-2" />
            SURRENDER
          </Button>

          <Button
            onClick={onDrawOffer}
            variant="outline"
            className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-950/30"
            disabled={isGameOver || !isPlayerTurn}
          >
            <Handshake className="h-4 w-4 mr-2" />
            OFFER DRAW
          </Button>

          <Button
            onClick={onPause}
            variant="outline"
            className={`w-full ${isPaused ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-950/30' : 'border-amber-500 text-amber-400 hover:bg-amber-950/30'}`}
            disabled={isGameOver}
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                RESUME
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                PAUSE
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
