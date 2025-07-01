"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth, User } from "@/contexts/auth-context";
import { BeveledButton } from "@/components/ui/beveled-button";
import { InfoIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Post } from "@/types/chat";
import { useAcceptChessChallenge } from "@/hooks/api/use-chess-play";
import { useTransition } from "@/components/provider/page-transition-provider";
import { UserIcon } from "@phosphor-icons/react";

export default function ChallengeInvite({ post }: { post: Post }) {
  const { user } = useAuth();
  const [showUserStats, setShowUserStats] = useState(false);

  const chessPlayers = post.chess?.chessPlayers || [];
  const creator = chessPlayers.find((p) => p?.isCreator)?.user;
  const opponent = chessPlayers.find((p) => !p?.isCreator)?.user;

  const { navigateWithTransition } = useTransition();
  const acceptChallenge = useAcceptChessChallenge();

  const handleAcceptChallenge = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (acceptChallenge.isPending) return;

    // If user is the creator, route directly to the chess room
    if (user && post.author && user._id === post.author._id) {
      if (!post.chess?.roomId) {
        return;
      }
      navigateWithTransition(`/room/chess/${post.chess.roomId}`);
      return;
    }

    acceptChallenge.mutate(post._id, {
      onSuccess: (data) => {
        // The backend should return the room in the response
        const roomId = data?.room?._id;
        if (!roomId) {
          console.error("No roomId in response:", data);
          return;
        }
        console.log("Navigating to room:", roomId);
        navigateWithTransition(`/room/chess/${roomId}`);
      },
      onError: (error) => {
        console.error("Error accepting challenge:", error);
      },
    });
  };

  const handleRoomEnter = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigateWithTransition(`/room/chess/${post.chess?.roomId}`);
  };

  //user is player
  const isPlayer = chessPlayers.some((p) => p?.user?._id === user?._id);

  // Get player data from post

  const calculateWinRate = (wins?: number, totalGames?: number) => {
    if (!wins || !totalGames || totalGames === 0) return 0;
    return Math.round((wins / totalGames) * 100);
  };

  const handleMouseEnter = useCallback(() => {
    setShowUserStats(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowUserStats(false);
  }, []);

  const totalGames = (user?.wins || 0) + (user?.losses || 0);

  return (
    <>
      <div className="max-w-lg gap-1 relative w-full flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <PlayerCard creator={creator} post={post} />
        {opponent ? (
          <PlayerCard creator={opponent} post={post} />
        ) : (
          <button
            className="relative group size-64 aspect-square hover:cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleAcceptChallenge}
          >
            <div className="h-full w-full p-4 overflow-hidden transition-all duration-300 bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-fuchsia-500/30 rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  {showUserStats && user ? (
                    <motion.div
                      key="user-stats"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="w-full h-full flex flex-col items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mb-3"
                      >
                        <Avatar className="w-16 h-16 border border-cyan-500/30">
                          <AvatarImage
                            src={user?.avatar}
                            alt={user?.username}
                          />
                          <AvatarFallback className="bg-gray-800 text-cyan-400 text-xl">
                            <UserIcon />
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <motion.h3
                        className="font-bold text-white text-center"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        {user?.fullName ||
                          (post.chess?.rated ? "Rated Game" : "Casual Game")}
                      </motion.h3>
                      <motion.p
                        className="text-xs text-cyan-400 font-mono mb-4"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {user?.username ? `@${user.username}` : "Waiting..."}
                      </motion.p>

                      <motion.div
                        className="flex items-center gap-4 text-xs mb-4"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <span className="text-cyan-400">
                          <span className="text-cyan-500">RATING:</span>{" "}
                          {user.rating || "??"}
                        </span>
                        <span className="text-fuchsia-400">
                          <span className="text-fuchsia-500">WINS:</span>{" "}
                          {user.wins || "?"}
                        </span>
                      </motion.div>

                      <motion.div
                        className="w-3/4 h-1.5 bg-gray-800/80 rounded-full overflow-hidden border border-cyan-500/20"
                        initial={{ opacity: 0, scaleX: 0.9 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${calculateWinRate(
                              user.wins,
                              totalGames
                            )}%`,
                          }}
                          transition={{
                            delay: 0.35,
                            duration: 0.5,
                            ease: "easeOut",
                          }}
                        />
                      </motion.div>
                      <motion.p
                        className="text-xs text-cyan-300 font-mono mt-1"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {calculateWinRate(user.wins, totalGames)}% WIN RATE
                      </motion.p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="w-full h-full flex flex-col items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 text-2xl mb-3">
                        🎮
                      </div>
                      <h3 className="font-bold text-gray-500 text-center">
                        ?????
                      </h3>
                      <p className="text-xs text-gray-500 font-mono mb-4">
                        @??????
                      </p>

                      <div className="flex items-center gap-4 text-xs mb-4">
                        <span className="text-gray-500">
                          <span className="text-gray-600">RATING:</span> ???
                        </span>
                        <span className="text-gray-500">
                          <span className="text-gray-600">WINS:</span> ???
                        </span>
                      </div>

                      <div className="w-3/4 h-1.5 bg-gray-800/80 rounded-full overflow-hidden border border-gray-700/50">
                        <div
                          className="h-full bg-gray-700"
                          style={{ width: "0%" }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 font-mono mt-1">
                        ??? WIN RATE
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <p className="font-mono text-2xl">VS</p>
            </div>
          </button>
        )}
      </div>
      <div className="col-span-full pt-3 max-w-lg">
        {(() => {
          if (isPlayer) {
            return (
              <BeveledButton
                className="w-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleRoomEnter}
              >
                Continue
              </BeveledButton>
            );
          }

          if (opponent) {
            return (
              <BeveledButton
                className="w-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleRoomEnter}
              >
                Spectate
              </BeveledButton>
            );
          }

          return (
            <BeveledButton
              className="w-full"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleAcceptChallenge}
            >
              Accept Challenge
            </BeveledButton>
          );
        })()}
      </div>
    </>
  );
}

function PlayerCard({
  creator,
  post,
}: {
  creator: User | undefined;
  post: Post;
}) {
  return (
    <div className="relative group size-64 aspect-square">
      <div className="h-full w-full p-4 overflow-hidden transition-all duration-300 bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-fuchsia-500/30 rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <Avatar className="w-16 h-16 border border-cyan-500/30">
            <AvatarImage src={creator?.avatar} alt={creator?.username} />
            <AvatarFallback className="bg-gray-800 text-cyan-400 text-xl">
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-white text-center">
            {creator?.fullName || "White Player"}
          </h3>
          <p className="text-xs text-cyan-400 font-mono mb-4">
            {creator?.username ? `@${creator.username}` : ""}
          </p>

          {post.chess?.rated ? (
            <>
              <div className="flex items-center gap-4 text-xs mb-4">
                <span className="text-cyan-400">
                  <span className="text-cyan-500">RATING:</span> 1450
                </span>
                <span className="text-fuchsia-400">
                  <span className="text-fuchsia-500">WINS:</span> 42
                </span>
              </div>
              <div className="w-3/4 h-1.5 bg-gray-800/80 rounded-full overflow-hidden border border-cyan-500/20">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500"
                  style={{ width: "65%" }}
                />
              </div>
              <p className="text-xs text-cyan-300 font-mono mt-1">
                65% WIN RATE
              </p>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-2">Casual Game</p>
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-400">Just for fun!</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-xs text-gray-400 hover:text-gray-300 transition-colors">
                      <InfoIcon className="size-2" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>No rating impact</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
