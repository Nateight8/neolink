"use client";

import { Clock, Crown, Settings, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function GameModeSelector() {
  const [selectedGameMode, setSelectedGameMode] = useState("blitz");
  return (
    <>
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button className="h-16 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)]">
          <Zap className="h-6 w-6 mr-3" />
          <div className="text-left">
            <div className="font-bold">Quick Match</div>
            <div className="text-xs opacity-80">Find random opponent</div>
          </div>
        </Button>

        <Button className="h-16 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-400 text-white shadow-[0_0_20px_rgba(255,0,255,0.3)]">
          <Users className="h-6 w-6 mr-3" />
          <div className="text-left">
            <div className="font-bold">Challenge Friend</div>
            <div className="text-xs opacity-80">Invite ally to duel</div>
          </div>
        </Button>
      </div>
      <div className="bg-black/50 border border-cyan-900 rounded-sm p-6 backdrop-blur-sm">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm -z-10" />

        <h3 className="text-cyan-400 font-bold mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Neural Game Modes
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              id: "blitz",
              name: "Blitz",
              time: "3+2",
              icon: Zap,
              color: "cyan",
            },
            {
              id: "rapid",
              name: "Rapid",
              time: "10+5",
              icon: Clock,
              color: "fuchsia",
            },
            {
              id: "classical",
              name: "Classical",
              time: "30+0",
              icon: Crown,
              color: "yellow",
            },
            {
              id: "custom",
              name: "Custom",
              time: "Custom",
              icon: Settings,
              color: "green",
            },
          ].map((mode) => (
            <Button
              key={mode.id}
              variant={selectedGameMode === mode.id ? "default" : "outline"}
              className={`h-16 ${
                selectedGameMode === mode.id
                  ? `bg-${mode.color}-600 hover:bg-${mode.color}-500 text-white`
                  : `border-${mode.color}-500 text-${mode.color}-400 hover:bg-${mode.color}-950/30`
              }`}
              onClick={() => setSelectedGameMode(mode.id)}
            >
              <mode.icon className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-bold">{mode.name}</div>
                <div className="text-xs opacity-80">{mode.time}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
