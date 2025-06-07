"use client";

import { Button } from "@/components/ui/button";
import { Clock, Crown, Eye } from "lucide-react";

interface Game {
  id: number;
  white: string;
  black: string;
  time: string;
  spectators: number;
  whiteRating: number;
  blackRating: number;
}

export default function Live({
  ongoingGames,
}: {
  ongoingGames: Game[];
}) {
  return (
    <>
      <div className="bg-black/50 border border-cyan-900 rounded-sm p-6 backdrop-blur-sm">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm -z-10" />

        <h3 className="text-cyan-400 font-bold mb-4 flex items-center">
          <Eye className="h-5 w-5 mr-2" />
          Live Neural Duels
        </h3>

        <div className="space-y-3">
          {ongoingGames.map((game) => (
            <div
              key={game.id}
              className="flex items-center space-x-4 p-3 bg-black/30 rounded-sm hover:bg-cyan-950/20 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-900 to-fuchsia-900 rounded-sm flex items-center justify-center">
                <Crown className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{game.white}</span>
                  <span className="text-xs text-cyan-400">
                    ({game.whiteRating})
                  </span>
                  <span className="text-fuchsia-400">vs</span>
                  <span className="text-white font-medium">{game.black}</span>
                  <span className="text-xs text-fuchsia-400">
                    ({game.blackRating})
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-400">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {game.time}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {game.spectators}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-950/30"
              >
                <Eye className="h-4 w-4 mr-1" />
                Watch
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
