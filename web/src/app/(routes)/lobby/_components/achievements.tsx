"use client";

import { Button } from "@/components/ui/button";
import { useDoorTransition } from "@/hooks/use-page-transition";
import { Award, ChevronRight, LucideIcon } from "lucide-react";

export default function Achievements({
  achievements,
}: {
  achievements: {
    id: number;
    name: string;
    description: string;
    icon: LucideIcon;
    unlocked: boolean;
    rarity: string;
  }[];
}) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-500";
      case "rare":
        return "border-cyan-500";
      case "epic":
        return "border-fuchsia-500";
      case "legendary":
        return "border-yellow-500";
      default:
        return "border-gray-500";
    }
  };

  const { navigateWithTransition, isTransitioning } = useDoorTransition();

  const handleNavigation = (href: string) => {
    if (!isTransitioning) {
      navigateWithTransition(href);
    }
  };

  return (
    <>
      <div className="bg-black/50 border border-cyan-900 rounded-sm p-4 backdrop-blur-sm">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm -z-10" />

        <h3 className="text-cyan-400 font-bold mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Neural Achievements
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-sm border-2 ${getRarityColor(
                achievement.rarity
              )} ${
                achievement.unlocked
                  ? "bg-black/30"
                  : "bg-gray-900/50 opacity-50"
              } hover:scale-105 transition-transform cursor-pointer`}
              title={achievement.description}
            >
              <achievement.icon
                className={`h-6 w-6 mx-auto mb-2 ${
                  achievement.unlocked ? "text-cyan-400" : "text-gray-600"
                }`}
              />
              <p
                className={`text-xs text-center font-medium ${
                  achievement.unlocked ? "text-white" : "text-gray-500"
                }`}
              >
                {achievement.name}
              </p>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 text-xs"
          onClick={() => handleNavigation("/biochip")}
        >
          View All Achievements
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </>
  );
}
