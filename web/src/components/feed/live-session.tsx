"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";

interface User {
  id: string | number;
  username: string;
  avatar: string;
}

interface Highlight {
  type: "quote" | "hashtag";
  content: string;
  username?: string;
}

interface LiveSessionCardProps {
  title: string;
  host: User;
  listeners: User[];
  listenersCount: number;
  highlights: Highlight[];
  isLive: boolean;
}

export function LiveSessionCard({
  title,
  host,
  listeners = [],
  listenersCount = 0,
  highlights = [],
  isLive = true,
}: LiveSessionCardProps) {
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [showListeners, setShowListeners] = useState(true);

  // Rotate through highlights
  useEffect(() => {
    if (highlights.length <= 1) return;

    const highlightInterval = setInterval(() => {
      setCurrentHighlightIndex((prev) => (prev + 1) % highlights.length);
      // Toggle between showing listeners and highlights
      setShowListeners((prev) => !prev);
    }, 4000);

    return () => clearInterval(highlightInterval);
  }, [highlights.length]);

  // Get visible listeners (max 2)
  const visibleListeners = listeners.slice(0, 2);
  const remainingListeners = listenersCount - visibleListeners.length;
  const currentHighlight = highlights[currentHighlightIndex];

  return (
    <motion.div
      className="relative rounded-full overflow-hidden bg-black/80 backdrop-blur-sm border border-cyan-900 p-2 w-full md:w-auto"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ minWidth: "min(80vw, 320px)" }}
    >
      {/* Live indicator pulse */}
      {isLive && (
        <div className="absolute top-2 right-3 flex items-center">
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] uppercase text-red-400 font-mono tracking-wider">
            Live
          </span>
        </div>
      )}

      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-fuchsia-900/10"></div>

      {/* Border glow effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-30 blur-[2px] rounded-full"></div>

      <div className="relative flex items-center space-x-3 z-10">
        {/* Host avatar */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-75 blur-sm"></div>
          <Avatar className="h-14 w-14 border-2 border-cyan-500 relative">
            <AvatarImage
              src={host.avatar || "/placeholder.svg"}
              alt={host.username}
            />
            <AvatarFallback className="bg-black text-cyan-400 font-bold">
              {host.username.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Session info */}
        <div className="flex-1 min-w-0">
          {/* Host name and title */}
          <div className="mb-1">
            <h3 className="text-sm font-bold text-white truncate">
              {host.username}
            </h3>
            <p className="text-xs text-cyan-400 font-mono truncate">{title}</p>
          </div>

          {/* Animated content area */}
          <div className="h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              {showListeners ? (
                <motion.div
                  key="listeners"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  {/* Listeners avatars */}
                  <div className="flex -space-x-2 mr-2">
                    {visibleListeners.map((listener) => (
                      <Avatar
                        key={listener.id}
                        className="h-5 w-5 border border-black"
                      >
                        <AvatarImage
                          src={listener.avatar || "/placeholder.svg"}
                          alt={listener.username}
                        />
                        <AvatarFallback className="bg-black text-cyan-400 text-[8px]">
                          {listener.username.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>

                  {/* Listeners count */}
                  <span className="text-xs text-gray-400">
                    +{remainingListeners}{" "}
                    {remainingListeners === 1 ? "other" : "others"} listening
                  </span>
                </motion.div>
              ) : currentHighlight ? (
                <motion.div
                  key={`highlight-${currentHighlightIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  {currentHighlight.type === "quote" ? (
                    <span className="text-xs text-fuchsia-300 truncate">
                      <span className="text-gray-400">
                        @{currentHighlight.username}:{" "}
                      </span>
                      `&rdquo;`{currentHighlight.content}`&rdquo;`
                    </span>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs bg-fuchsia-950/30 border-fuchsia-500/50 text-fuchsia-300 px-2 py-0 h-5"
                    >
                      #{currentHighlight.content}
                    </Badge>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Radio icon */}
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-fuchsia-950/30 flex items-center justify-center">
            <Radio className="h-4 w-4 text-fuchsia-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
