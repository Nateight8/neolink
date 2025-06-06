"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CyberPanel } from "./cyber-pannel";
import { Crown, Eye, Users, Clock, Zap, Trophy, Gamepad2 } from "lucide-react";

// Mock data for chess rooms
const CHESS_ROOMS = [
  {
    id: 1,
    type: "waiting",
    player1: {
      username: "CyberKnight",
      avatar: "/placeholder.svg?height=32&width=32&text=CK",
      rating: 1850,
    },
    player2: null,
    spectators: 0,
    timeElapsed: null,
    status: "WAITING FOR OPPONENT",
  },
  {
    id: 2,
    type: "active",
    player1: {
      username: "NeuralMaster",
      avatar: "/placeholder.svg?height=32&width=32&text=NM",
      rating: 2100,
    },
    player2: {
      username: "QuantumQueen",
      avatar: "/placeholder.svg?height=32&width=32&text=QQ",
      rating: 1950,
    },
    spectators: 12,
    timeElapsed: "15:32",
    status: "NEURAL DUEL ACTIVE",
  },
  {
    id: 3,
    type: "tournament",
    player1: {
      username: "DataGrandmaster",
      avatar: "/placeholder.svg?height=32&width=32&text=DG",
      rating: 2300,
    },
    player2: {
      username: "CodeWarrior",
      avatar: "/placeholder.svg?height=32&width=32&text=CW",
      rating: 2250,
    },
    spectators: 45,
    timeElapsed: "08:15",
    status: "TOURNAMENT FINALS",
  },
  {
    id: 4,
    type: "waiting",
    player1: {
      username: "ByteBishop",
      avatar: "/placeholder.svg?height=32&width=32&text=BB",
      rating: 1720,
    },
    player2: null,
    spectators: 0,
    timeElapsed: null,
    status: "SEEKING NEURAL LINK",
  },
  {
    id: 5,
    type: "active",
    player1: {
      username: "AlgoAssassin",
      avatar: "/placeholder.svg?height=32&width=32&text=AA",
      rating: 1980,
    },
    player2: {
      username: "LogicLord",
      avatar: "/placeholder.svg?height=32&width=32&text=LL",
      rating: 2050,
    },
    spectators: 8,
    timeElapsed: "22:47",
    status: "INTENSE BATTLE",
  },
];

export function ChessRoomsSidebar() {
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);

  const getRoomIcon = (type: string) => {
    switch (type) {
      case "waiting":
        return <Gamepad2 className="h-3 w-3" />;
      case "active":
        return <Zap className="h-3 w-3" />;
      case "tournament":
        return <Trophy className="h-3 w-3" />;
      default:
        return <Crown className="h-3 w-3" />;
    }
  };

  const getRoomColor = (type: string) => {
    switch (type) {
      case "waiting":
        return "border-cyan-500 text-cyan-400";
      case "active":
        return "border-fuchsia-500 text-fuchsia-400";
      case "tournament":
        return "border-yellow-500 text-yellow-400";
      default:
        return "border-cyan-500 text-cyan-400";
    }
  };

  const getActionButton = (room: { type: string }) => {
    if (room.type === "waiting") {
      return (
        <Button
          size="sm"
          className="w-full rounded-sm bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs"
        >
          JOIN GAME
        </Button>
      );
    } else if (room.type === "tournament") {
      return (
        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-sm border-yellow-500 text-yellow-400 hover:bg-yellow-950/30 text-xs"
        >
          ENTER TOURNAMENT
        </Button>
      );
    } else {
      return (
        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-sm border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-950/30 text-xs"
        >
          SPECTATE
        </Button>
      );
    }
  };

  return (
    <div className="sticky top-20 space-y-6">
      {/* Quick Challenge */}
      <CyberPanel title="NEURAL CHESS">
        <div className="space-y-3">
          <Button className="w-full rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]">
            <Crown className="h-4 w-4 mr-2" />
            QUICK DUEL
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-sm border-cyan-500 text-cyan-400 hover:bg-cyan-950/30"
          >
            <Trophy className="h-4 w-4 mr-2" />
            JOIN TOURNAMENT
          </Button>
        </div>
      </CyberPanel>

      {/* Active Rooms */}
      <CyberPanel title="ACTIVE_ROOMS">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {CHESS_ROOMS.map((room) => (
            <motion.div
              key={room.id}
              className={`p-3 border rounded-sm bg-black/50 transition-all duration-200 cursor-pointer ${
                hoveredRoom === room.id
                  ? "border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                  : "border-gray-800"
              }`}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              whileHover={{ scale: 1.02 }}
            >
              {/* Room Status Badge */}
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant="outline"
                  className={`text-xs bg-black ${getRoomColor(room.type)}`}
                >
                  {getRoomIcon(room.type)}
                  <span className="ml-1">{room.status}</span>
                </Badge>
                {room.type === "active" && (
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {room.timeElapsed}
                  </div>
                )}
              </div>

              {/* Players */}
              <div className="space-y-2 mb-3">
                {/* Player 1 */}
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6 border border-cyan-500">
                    <AvatarImage
                      src={room.player1.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-black text-cyan-400 text-xs">
                      {room.player1.username.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">
                      {room.player1.username}
                    </p>
                    <p className="text-xs text-cyan-400">
                      {room.player1.rating}
                    </p>
                  </div>
                </div>

                {/* VS or Waiting */}
                <div className="text-center">
                  {room.player2 ? (
                    <span className="text-xs text-fuchsia-400 font-mono">
                      VS
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 font-mono">
                      WAITING...
                    </span>
                  )}
                </div>

                {/* Player 2 or Empty Slot */}
                {room.player2 ? (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6 border border-fuchsia-500">
                      <AvatarImage
                        src={room.player2.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="bg-black text-fuchsia-400 text-xs">
                        {room.player2.username.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">
                        {room.player2.username}
                      </p>
                      <p className="text-xs text-fuchsia-400">
                        {room.player2.rating}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 opacity-50">
                    <div className="h-6 w-6 border border-dashed border-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-600">?</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Open Slot</p>
                      <p className="text-xs text-gray-600">Join Now</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Spectators and Action */}
              <div className="flex items-center justify-between">
                {room.spectators > 0 && (
                  <div className="flex items-center text-xs text-gray-400">
                    <Eye className="h-3 w-3 mr-1" />
                    <Users className="h-3 w-3 mr-1" />
                    {room.spectators}
                  </div>
                )}
                <div className="flex-1 ml-2">{getActionButton(room)}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 text-xs"
        >
          VIEW_ALL_ROOMS.SYS
        </Button>
      </CyberPanel>
    </div>
  );
}
