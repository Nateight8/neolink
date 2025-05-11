"use client";

import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoryCircleProps {
  username: string;
  avatar: string;
  viewed: boolean;
}

export function StoryCircle({ username, avatar, viewed }: StoryCircleProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <div
          className={`absolute -inset-1 rounded-full ${
            viewed
              ? "bg-gray-700 opacity-50"
              : "bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-75 animate-pulse"
          } blur-sm`}
        ></div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-16 w-16 rounded-full bg-black border-2 border-cyan-500 overflow-hidden"
        >
          <Avatar className="h-full w-full">
            <AvatarImage src={avatar || "/placeholder.svg"} alt={username} />
            <AvatarFallback className="bg-black text-cyan-400">
              {username.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </motion.button>
      </div>
      <span className="text-xs text-gray-400 font-mono truncate w-16 text-center">
        {username}
      </span>
    </div>
  );
}
