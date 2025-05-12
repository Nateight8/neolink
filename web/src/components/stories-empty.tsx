"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCheck, Zap, RefreshCw, Plus, Radio } from "lucide-react";
import { GlitchText } from "@/components/feed/glitch-text";

interface EmptyStoriesStateProps {
  onRefresh?: () => void;
  onCreateStory?: () => void;
}

export function EmptyStoriesState({
  onRefresh,
  onCreateStory,
}: EmptyStoriesStateProps) {
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);

  // Placeholder avatars for the empty state
  const placeholderAvatars = [
    { id: 1, initial: "CN", status: "viewed" },
    { id: 2, initial: "NH", status: "viewed" },
    { id: 3, initial: "GW", status: "viewed" },
    { id: 4, initial: "DW", status: "viewed" },
    { id: 5, initial: "PP", status: "viewed" },
    { id: 6, initial: "VR", status: "viewed" },
  ];

  // Trigger random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Trigger pulse effect
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 1000);
    }, 3000);

    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <div className="w-full py-4 overflow-hidden">
      <div className="relative">
        {/* Background grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] rounded-md"></div>

        {/* Container for the empty state */}
        <div className="relative bg-black/60 border border-cyan-900 rounded-md p-6">
          <div
            className={`absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-md opacity-20 blur-[1px] -z-10 transition-opacity duration-300 ${
              pulseEffect ? "opacity-40" : "opacity-20"
            }`}
          ></div>

          {/* Avatar circles in a row */}
          <div className="flex justify-center mb-6 -space-x-2 overflow-hidden">
            {/* Add story button */}
            <div className="relative z-10">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-75 blur-sm"></div>
              <Button
                onClick={onCreateStory}
                className="relative h-14 w-14 rounded-full bg-black border-2 border-cyan-500 flex items-center justify-center"
              >
                <Plus className="h-6 w-6 text-cyan-400" />
              </Button>
            </div>

            {/* Placeholder avatars */}
            {placeholderAvatars.map((avatar, index) => (
              <div
                key={avatar.id}
                className="relative"
                style={{ zIndex: 10 - index }}
              >
                <Avatar
                  className={`h-14 w-14 border-2 ${
                    avatar.status === "viewed"
                      ? "border-gray-700 opacity-50"
                      : "border-cyan-500"
                  }`}
                >
                  <AvatarFallback className="bg-black text-gray-500">
                    {avatar.initial}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>

          {/* Status indicator */}
          <div className="flex justify-center mb-4">
            <Badge
              variant="outline"
              className="bg-black/80 border-cyan-500 text-cyan-400 px-3 py-1 flex items-center space-x-2"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              <span>NEURAL FEED SYNCHRONIZED</span>
              <Radio
                className={`h-3 w-3 ml-1 ${pulseEffect ? "animate-pulse" : ""}`}
              />
            </Badge>
          </div>

          {/* Main message */}
          <div className="text-center mb-4">
            <GlitchText
              text="ALL NEURAL TRANSMISSIONS VIEWED"
              className={`text-xl font-bold text-white ${
                glitchEffect ? "animate-[glitch_0.2s_ease_forwards]" : ""
              }`}
            />
            <p className="text-gray-400 mt-2">
              Your neural feed is up to date. No new stories to process.
            </p>
          </div>

          {/* Refresh button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={onRefresh}
              variant="outline"
              className="rounded-sm border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-950/30 hover:text-fuchsia-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              SCAN FOR NEW TRANSMISSIONS
            </Button>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-3 left-3">
            <Zap className="h-4 w-4 text-cyan-500/30" />
          </div>
          <div className="absolute top-3 right-3">
            <Zap className="h-4 w-4 text-fuchsia-500/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
