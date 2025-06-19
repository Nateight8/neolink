"use client";

import Achievements from "../achievements";
import Ranking from "../ranking";
import { Crown, Zap, Trophy, Star } from "lucide-react";

export default function Right() {
  const leaderboard = [
    {
      rank: 1,
      username: "CyberGrandmaster",
      rating: 2450,
      change: "+25",
      avatar: "/placeholder.svg?height=32&width=32&text=CG",
    },
    {
      rank: 2,
      username: "NeuralNetwork",
      rating: 2380,
      change: "+12",
      avatar: "/placeholder.svg?height=32&width=32&text=NN",
    },
    {
      rank: 3,
      username: "QuantumLogic",
      rating: 2340,
      change: "-8",
      avatar: "/placeholder.svg?height=32&width=32&text=QL",
    },
    {
      rank: 4,
      username: "DataMaster",
      rating: 2290,
      change: "+18",
      avatar: "/placeholder.svg?height=32&width=32&text=DM",
    },
    {
      rank: 5,
      username: "CodeChampion",
      rating: 2250,
      change: "+5",
      avatar: "/placeholder.svg?height=32&width=32&text=CC",
    },
  ];

  const achievements = [
    {
      id: 1,
      name: "First Victory",
      description: "Win your first game",
      icon: Trophy,
      unlocked: true,
      rarity: "common",
    },
    {
      id: 2,
      name: "Speed Demon",
      description: "Win 10 blitz games",
      icon: Zap,
      unlocked: true,
      rarity: "rare",
    },
    {
      id: 3,
      name: "Neural Link",
      description: "Play 100 games",
      icon: Crown,
      unlocked: false,
      rarity: "epic",
    },
    {
      id: 4,
      name: "Grandmaster",
      description: "Reach 2000 rating",
      icon: Star,
      unlocked: false,
      rarity: "legendary",
    },
  ];

  return (
    <div>
      {" "}
      <div className="lg:col-span-3 hidden space-y-4 md:space-y-6 ">
        {/* Leaderboard */}
        <div className="relative group">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
            <div className="bg-gradient-to-br from-cyan-900/30 to-fuchsia-900/30 border border-cyan-500/30 rounded-lg p-6 max-w-xs text-center">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-2">
                Leaderboard
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Coming Soon: Track top players, climb the ranks, and see how you
                compare to the community.
              </p>
              <div className="text-xs text-gray-500">Release: Q3 2025</div>
            </div>
          </div>
          <Ranking leaderboard={leaderboard} />
        </div>

        {/* Achievements */}
        <div className="relative group">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
            <div className="bg-gradient-to-br from-cyan-900/30 to-fuchsia-900/30 border border-cyan-500/30 rounded-lg p-6 max-w-xs text-center">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-2">
                Achievements
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Coming Soon: Unlock achievements, complete challenges, and show
                off your progress.
              </p>
              <div className="text-xs text-gray-500">Release: Q3 2025</div>
            </div>
          </div>
          <Achievements achievements={achievements} />
        </div>
      </div>{" "}
    </div>
  );
}
