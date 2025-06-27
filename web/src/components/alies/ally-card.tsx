"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { UserPlus, X, Users } from "lucide-react";
// import { NeuralIndicator } from "@/components/messages/neural-indicator";
import { User } from "@/types/chat";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";

interface AllyCardProps {
  ally: User;
  onAdd: () => void;
  onSkip: () => void;
}

export function AllyCard({ ally, onAdd, onSkip }: AllyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  // Trigger glitch effect on hover
  const handleHover = () => {
    setIsHovered(true);
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
  };

  const { mutate, isError, error } = useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosInstance.post(
          `/users/friend-request/${ally._id}`
        );
        onAdd(); // Call onAdd after successful mutation
        return response.data;
      } catch (err) {
        throw err;
      }
    },
  });

  const handleConnect = () => {
    mutate();
  };

  // Log any mutation errors
  useEffect(() => {
    if (isError && error) {
      console.error("Mutation error:", error);
    }
  }, [isError, error]);

  return (
    <div
      className="bg-black border border-cyan-900 rounded-sm p-6 relative"
      onMouseEnter={handleHover}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-30 blur-[1px] -z-10 transition-opacity duration-300 ${
          isHovered ? "opacity-50" : "opacity-30"
        }`}
      ></div>

      {/* Avatar and basic info */}
      <div className="flex flex-col items-center mb-6">
        <motion.div
          className="relative mb-4"
          whileHover={{ scale: 1.05 }}
          animate={isGlitching ? { x: [-2, 2, -2, 0], y: [1, -1, 1, 0] } : {}}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 opacity-75 blur-sm"></div>
          <Avatar className="h-32 w-32 border-2 border-cyan-500 relative shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            <AvatarImage src="" alt={ally.fullName} />
            <AvatarFallback className="bg-black text-cyan-400 text-3xl">
              {ally.handle.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          {/* {ally.verified && (
            <div className="absolute bottom-0 right-0 bg-black rounded-full p-1 border border-cyan-500">
              <Shield className="h-5 w-5 text-cyan-400" />
            </div>
          )} */}
        </motion.div>

        <h2 className="text-xl font-bold text-white mb-1">{ally.fullName}</h2>
        <p className="text-cyan-400 font-mono">@{ally.handle}</p>

        {/* Neural compatibility indicator */}
        <div className="flex items-center mt-3 space-x-2">
          <span className="text-xs text-gray-400">NEURAL COMPATIBILITY:</span>
          {/* <NeuralIndicator strength={ally.neuralCompatibility} />
          <span className="text-xs text-cyan-400">
            {Math.round(ally.neuralCompatibility * 100)}%
          </span> */}
        </div>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <p className="text-center text-gray-300">{ally.bio}</p>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-xs text-gray-400 mb-2 text-center">
          NEURAL SPECIALIZATIONS
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {/* {ally.skills.map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`rounded-sm ${
                index % 2 === 0
                  ? "border-cyan-500 bg-cyan-950/50 text-cyan-300"
                  : "border-fuchsia-500 bg-fuchsia-950/50 text-fuchsia-300"
              }`}
            >
              {index % 2 === 0 ? (
                <Cpu className="h-3 w-3 mr-1" />
              ) : (
                <Brain className="h-3 w-3 mr-1" />
              )}
              {skill}
            </Badge>
          ))} */}
        </div>
      </div>

      {/* Mutual allies */}
      <div className="mb-6 flex items-center justify-center space-x-2">
        <Users className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-400">
          {/* currently using friends */}
          {(ally.friends ?? []).length > 0
            ? `${ally.friends} MUTUAL ${
                (ally.friends ?? []).length === 1 ? "ALLY" : "ALLIES"
              }`
            : "NO MUTUAL ALLIES"}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={onSkip}
          className="rounded-sm border-red-500 text-red-400 hover:bg-red-950/50 hover:text-red-300 w-32"
        >
          <X className="h-4 w-4 mr-2" />
          SKIP
        </Button>
        <Button
          onClick={handleConnect}
          className="rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)] w-32"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          CONNECT
        </Button>
      </div>
    </div>
  );
}
