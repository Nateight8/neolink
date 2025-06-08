"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CyberPanel } from "./cyber-pannel";
import { Swords, Crown, Trophy, Users, Plus } from "lucide-react";
import { useTransition } from "@/components/provider/page-transition-provider";

const GAME_ROOMS = [
  {
    id: "chess",
    name: "Neural Chess",
    players: 128,
    status: "active",
    description: "Classic strategy with AI enhancements",
    icon: <Swords className="h-5 w-5" />,
    color: "from-cyan-600 to-cyan-500",
    href: "/lobby",
  },
  {
    id: "coming-soon-1",
    name: "Coming Soon",
    players: 0,
    status: "locked",
    description: "New game modes in development",
    icon: <Crown className="h-5 w-5" />,
    color: "from-gray-600 to-gray-500",
    disabled: true,
    href: undefined,
  },
  {
    id: "coming-soon-2",
    name: "Coming Soon",
    players: 0,
    status: "locked",
    description: "Exciting new challenges ahead",
    icon: <Trophy className="h-5 w-5" />,
    color: "from-gray-600 to-gray-500",
    disabled: true,
    href: undefined,
  },
];

export function GameRoomsSidebar() {
  const { navigateWithTransition, isTransitioning } = useTransition();

  const activeRoom = "chess";

  return (
    <div className="sticky top-20 space-y-6 w-72">
      <CyberPanel title="GAME LOBBY">
        <div className="space-y-4">
          {/* Create New Room */}
          <Button
            className="w-full hidden rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            onClick={() => {
              if (!isTransitioning) {
                navigateWithTransition("/lobby");
              }
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            CREATE ROOM
          </Button>

          {/* Game Room List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {GAME_ROOMS.map((room) => (
              <motion.div
                key={room.id}
                className={`p-3 rounded-sm cursor-pointer transition-all duration-200 ${
                  activeRoom === room.id
                    ? "bg-gradient-to-r from-cyan-900/30 to-cyan-800/20 border hover:border-x-transparent border-cyan-500/50"
                    : "bg-black/30 border border-gray-800 hover:border-cyan-500/30"
                } ${room.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (!isTransitioning) {
                    navigateWithTransition(room.href ?? "");
                  }
                }}
                // whileHover={!room.disabled ? { scale: 1.01 } : {}}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-sm bg-gradient-to-r ${room.color}`}
                  >
                    {room.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white truncate">
                        {room.name}
                      </h3>
                      {!room.disabled && (
                        <span className="text-xs text-cyan-400 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {room.players}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {room.description}
                    </p>
                  </div>
                </div>
                {room.status === "locked" && (
                  <div className="mt-2 text-center">
                    <span className="text-xs text-amber-400">COMING SOON</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </CyberPanel>

      {/* Active Players */}
      {/* <CyberPanel title="ONLINE PLAYERS">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 hover:bg-gray-900/50 rounded-sm"
            >
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 flex items-center justify-center text-xs">
                  {i}
                </div>
                <span className="text-sm text-white">Player_{i}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-cyan-400 hover:text-cyan-300 text-xs h-6"
              >
                Challenge
              </Button>
            </div>
          ))}
        </div>
      </CyberPanel> */}
    </div>
  );
}
