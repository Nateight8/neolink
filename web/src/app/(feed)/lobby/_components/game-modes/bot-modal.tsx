import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "@/components/provider/page-transition-provider";
import { BotConfig } from "./bot-config";
import type { BotGameSettings } from "./bot-config";
import { InitializingNeuralDuel } from "./initializing-neural-duel";
// import { nanoid } from "nanoid";

export default function BotModal() {
  const [open, setOpen] = useState(false);
  const [hasBotGame, setHasBotGame] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const router = useRouter();
  const { navigateWithTransition } = useTransition();

  useEffect(() => {
    if (open) {
      setHasBotGame(!!localStorage.getItem("chessBotGame"));
    }
  }, [open]);

  const handleContinue = () => {
    setOpen(false);
    router.push("/room/chess/bot");
  };

  const handleRestart = () => {
    localStorage.removeItem("chessBotGame");
    setHasBotGame(false);
  };

  const handleStartBotGame = (settings: BotGameSettings) => {
    setIsInitializing(true);
    // const id = `CHZ-${nanoid(4)}`;
    localStorage.setItem("botGameSettings", JSON.stringify(settings));
    // After 1.2s, close the modal, then after 0.3s, trigger the transition
    const closeTimer = setTimeout(() => {
      setIsInitializing(false);
      setOpen(false);
      const transitionTimer = setTimeout(() => {
        navigateWithTransition(`/room/chess/bot`);
      }, 300);
      // Cleanup transition timer if needed
      return () => clearTimeout(transitionTimer);
    }, 1200);
    // Cleanup close timer if needed
    return () => clearTimeout(closeTimer);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white font-medium py-3 text-base sm:text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Open Bot Modal
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#181c24] rounded-lg p-8 w-full max-w-md shadow-lg border border-cyan-900">
        {isInitializing ? (
          <InitializingNeuralDuel duration={1200} />
        ) : hasBotGame ? (
          <div className="flex flex-col items-center justify-center gap-6 p-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent mb-2">
              Game in Progress
            </div>
            <div className="text-cyan-200 mb-4 text-center">
              You have an ongoing neural duel. Would you like to continue or
              start a new game?
            </div>
            <Button
              className="w-full bg-cyan-600 text-white"
              onClick={handleContinue}
            >
              Continue Session
            </Button>
            <Button
              variant="ghost"
              className="w-full text-gray-400"
              onClick={handleRestart}
            >
              Restart
            </Button>
          </div>
        ) : (
          <BotConfig onStart={handleStartBotGame} />
        )}
      </DialogContent>
    </Dialog>
  );
}
