"use client";
import { useGameState } from "@/hooks/api/use-game-state";
import { cn } from "@/lib/utils";
import { GameControllerIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function GameButton() {
  const { activeGame } = useGameState();
  const router = useRouter();

  const handleChessPlay = () => {
    if (activeGame?.type === "bot") {
      router.push(activeGame.url);
    }
    if (activeGame?.type === "pvp") {
      router.push(activeGame.url);
    }
  };

  return (
    <div className="flex-1 flex justify-center">
      <button
        onClick={handleChessPlay}
        className={cn(
          "flex flex-col items-center justify-center transition-colors"
        )}
      >
        <GameControllerIcon className="size-6 text-muted-foreground" />
        {/* <span className="text-xs text-muted-foreground">{name}</span> */}
      </button>
    </div>
  );
}
