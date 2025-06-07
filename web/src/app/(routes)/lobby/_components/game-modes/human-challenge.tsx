"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Zap } from "lucide-react";
import { useState } from "react";

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
    <div className="relative w-full h-full bg-black/50 border border-cyan-900 rounded-sm backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20" />
      <div className="relative space-y-6 p-6">
        <Button
          variant="ghost"
          className=" text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 text-xs"
          onClick={onBack}
        >
          <ChevronLeft className="h-3 w-3 ml-1" />
          Back to Opponent Selection
        </Button>

        <div className="relative">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Create Challenge
          </h2>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30"></div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 bg-fuchsia-400 rounded-full"></div>
              <h3 className="text-lg font-medium text-fuchsia-300">
                Time Control
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["1+0", "3+0", "5+0", "10+0", "15+10", "30+0"].map((tc) => (
                <Button
                  key={tc}
                  variant={timeControl === tc ? "default" : "outline"}
                  onClick={() => setTimeControl(tc)}
                >
                  {tc}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-5 bg-cyan-400 rounded-full"></div>
              <h3 className="text-lg font-medium text-cyan-300">Game Type</h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant={rated ? "default" : "outline"}
                onClick={() => setRated(true)}
                className="flex-1"
              >
                Rated
              </Button>
              <Button
                variant={!rated ? "default" : "outline"}
                onClick={() => setRated(false)}
                className="flex-1"
              >
                Casual
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button
              className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white font-medium py-6 text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              size="lg"
              onClick={() => onCreateChallenge({ timeControl, rated })}
            >
              <Zap className="w-5 h-5 mr-2" />
              Create Challenge
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
