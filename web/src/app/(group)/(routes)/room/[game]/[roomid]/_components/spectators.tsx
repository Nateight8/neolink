import { Users, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

export interface Spectator {
  id: string;
  username: string;
  avatar?: string;
}

interface SpectatorsProps {
  spectators: Spectator[];
  moveHistory: string[];
}

// Animation variants for spectator list
const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

// Animation for new spectator notification
const notificationVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

export default function Spectators({
  spectators = [],
  moveHistory = [],
}: SpectatorsProps) {
  const [recentSpectators, setRecentSpectators] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  // Show notification when a new spectator joins
  useEffect(() => {
    if (spectators.length > 0) {
      const newSpectator = spectators[spectators.length - 1];
      if (newSpectator && !recentSpectators.includes(newSpectator.id)) {
        setRecentSpectators((prev) => [...prev, newSpectator.id]);

        // Remove from recent after delay
        const timer = setTimeout(() => {
          setRecentSpectators((prev) =>
            prev.filter((id) => id !== newSpectator.id)
          );
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [spectators, recentSpectators]);
  return (
    <div className="lg:col-span-2 space-y-4 hidden md:block">
      <div className="bg-black/80 border border-gray-800 rounded-sm p-4 relative">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-gray-700/20 to-gray-700/10 rounded-sm opacity-30 blur-[1px] -z-10" />

        {/* Header with toggle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <h4 className="text-gray-400 font-cyber text-sm">
              SPECTATORS ({spectators.length})
            </h4>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-300 transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* New spectator notification */}
        <AnimatePresence>
          {recentSpectators.length > 0 && (
            <motion.div
              className="mb-3 p-2 bg-gray-800/50 rounded text-xs text-gray-300 flex items-center space-x-1"
              variants={notificationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <UserPlus className="h-3 w-3 text-green-400" />
              <span>New spectator joined</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spectators list */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {spectators.length > 0 ? (
                spectators.map((spectator) => (
                  <motion.div
                    key={spectator.id}
                    className="flex items-center space-x-2"
                    variants={listItemVariants}
                    layout
                  >
                    <Avatar className="h-6 w-6 border border-gray-600">
                      <AvatarImage
                        src={spectator.avatar || "/placeholder.svg"}
                        alt={spectator.username}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-black text-gray-400 text-xs">
                        {spectator.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <span className="text-gray-300 text-sm truncate max-w-[120px] cursor-default">
                            {spectator.username}
                          </span>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50"
                            side="right"
                            sideOffset={5}
                          >
                            {spectator.username}
                            <Tooltip.Arrow className="fill-gray-800" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-gray-500 text-sm py-2 text-center"
                  variants={listItemVariants}
                >
                  No spectators yet
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Move History */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-gray-400 font-cyber text-sm mb-3">
            MOVE HISTORY
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {moveHistory.length > 0 ? (
              moveHistory.map((move, index) => (
                <div
                  key={index}
                  className="text-xs font-mono text-gray-300 flex"
                >
                  <span className="w-8 text-gray-500">
                    {Math.floor(index / 2) + 1}.
                  </span>
                  <span
                    className={
                      index % 2 === 0 ? "text-cyan-400" : "text-fuchsia-400"
                    }
                  >
                    {move}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-xs">AWAITING FIRST MOVE</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
