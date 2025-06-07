"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";
import { useState } from "react";

export default function Ranking({
  leaderboard,
}: {
  leaderboard: {
    rank: number;
    username: string;
    rating: number;
    change: string;
    avatar: string;
  }[];
}) {
  const [leaderboardFilter, setLeaderboardFilter] = useState("daily");

  return (
    <>
      {" "}
      <div className="bg-black/50 border border-cyan-900 rounded-sm p-4 backdrop-blur-sm">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm -z-10" />

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-cyan-400 font-bold flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Neural Rankings
          </h3>
          <Tabs
            value={leaderboardFilter}
            onValueChange={setLeaderboardFilter}
            className="w-auto"
          >
            <TabsList className="bg-black/50 border border-cyan-900">
              <TabsTrigger value="daily" className="text-xs">
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs">
                Weekly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          {leaderboard.map((player) => (
            <div
              key={player.rank}
              className="flex items-center space-x-3 p-2 rounded-sm bg-black/30"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  player.rank === 1
                    ? "bg-yellow-500 text-black"
                    : player.rank === 2
                    ? "bg-gray-400 text-black"
                    : player.rank === 3
                    ? "bg-orange-500 text-black"
                    : "bg-gray-700 text-white"
                }`}
              >
                {player.rank}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={player.avatar || "/placeholder.svg"}
                  alt={player.username}
                />
                <AvatarFallback className="bg-black text-cyan-400 text-xs">
                  {player.username.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {player.username}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-cyan-400">{player.rating}</span>
                  <span
                    className={`text-xs ${
                      player.change.startsWith("+")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {player.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
