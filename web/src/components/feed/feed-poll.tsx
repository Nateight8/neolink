"use client";

// import { useState } from "react"; // Removed unused import
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Poll } from "@/types/chat";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { useAuthUser } from "@/hooks/use-auth";
// import { Poll } from "@/types/chat";

interface FeedPollProps {
  poll?: Poll;
}

export function FeedPoll({ poll }: FeedPollProps) {
  const { user } = useAuthUser();

  const userId = user?._id;

  const [hoveredOption, setHoveredOption] = useState<string | number | null>(
    null
  );
  const [isVotingAllowed, setIsVotingAllowed] = useState<boolean>(true);
  const [glitchIndex, setGlitchIndex] = useState<number>(-1);
  const [userVote, setUserVote] = useState<string | null>(null); // Track user's vote

  // Check if user has already voted
  useEffect(() => {
    if (!poll?.options || !userId) return;

    // Loop through options to find if user has voted
    for (const option of poll.options) {
      if (option.votes.includes(userId)) {
        setUserVote(option._id);
        break;
      }
    }
  }, [poll?.options, userId]);

  // Check if poll is expired
  useEffect(() => {
    if (poll?.expiresAt) {
      const isExpired = new Date(poll.expiresAt) < new Date();
      setIsVotingAllowed(!isExpired);
    }
  }, [poll?.expiresAt]);

  // Beveled edge clip path
  const clipPath =
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))";

  const { mutate: voteMutate } = useMutation({
    mutationFn: async (optionId: string) => {
      if (!poll?._id) throw new Error("Poll ID is required");
      const response = await axiosInstance.post(`/polls/${poll._id}/vote`, {
        optionId,
      });
      return response.data;
    },
    onSuccess: (_, optionId) => {
      setUserVote(optionId);
    },
    onError: (error) => {
      console.error("Vote error:", error);
    },
  });

  // Handle vote
  const handleVote = (optionId: string) => {
    if (!isVotingAllowed || userVote !== null) return;
    voteMutate(optionId);
  };

  // Find winning option
  const getWinningOptionIndex = () => {
    if (!poll?.options.length || userVote === null) return -1; // Don't show winner until voted

    let maxVotes = -1;
    let winningIndex = -1;
    let isTie = false;

    poll.options.forEach((option, index) => {
      const voteCount = option.votes.length;
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        winningIndex = index;
        isTie = false;
      } else if (voteCount === maxVotes && voteCount > 0) {
        isTie = true;
      }
    });

    return isTie || maxVotes === 0 ? -1 : winningIndex;
  };

  // Glitch effect for winning option
  useEffect(() => {
    if (userVote !== null) {
      const winningIndex = getWinningOptionIndex();
      const glitchInterval = setInterval(() => {
        setGlitchIndex(winningIndex);
        setTimeout(() => {
          setGlitchIndex(-1);
        }, 150);
      }, 5000);
      return () => clearInterval(glitchInterval);
    }
  }, [userVote, poll?.options]);

  return (
    <div className={cn("w-full mt-4")}>
      {/* Poll options */}
      <div className="space-y-3">
        <AnimatePresence>
          {poll?.options.map((option, index) => {
            const percentage =
              userVote !== null && poll.totalVotes > 0
                ? Math.round((option.votes.length / poll.totalVotes) * 100)
                : 0;
            const isSelected = userVote === option._id;
            const isHovered = hoveredOption === option._id;
            const isWinning = getWinningOptionIndex() === index;
            const isGlitching = glitchIndex === index;

            return (
              <motion.div
                key={option._id}
                className={cn(
                  "relative",
                  isGlitching && "animate-[glitch_0.2s_ease_forwards]"
                )}
              >
                {/* Gradient border for winning option */}
                {isWinning && userVote !== null && (
                  <div
                    className={cn(
                      "absolute -inset-[1px]",
                      "bg-gradient-to-r from-cyan-500 to-cyan-500",
                      isGlitching ? "opacity-100" : "opacity-70"
                    )}
                    style={{ clipPath }}
                  />
                )}

                {/* Border for selected option */}
                {isSelected && !isWinning && (
                  <div
                    className="absolute -inset-[1px] bg-cyan-500"
                    style={{ clipPath }}
                  />
                )}

                {/* Border for hovered option */}
                {isHovered &&
                  userVote === null &&
                  isVotingAllowed &&
                  !isSelected &&
                  !isWinning && (
                    <motion.div
                      className="absolute -inset-[1px] bg-gray-600"
                      style={{ clipPath }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}

                <button
                  onClick={() => handleVote(option._id)}
                  disabled={!isVotingAllowed || userVote !== null}
                  className={cn(
                    "relative w-full text-left transition-all",
                    !isVotingAllowed || userVote !== null
                      ? "cursor-default"
                      : "cursor-pointer"
                  )}
                  onMouseEnter={() => setHoveredOption(option._id)}
                  onMouseLeave={() => setHoveredOption(null)}
                >
                  {/* Background with beveled edges and cyberpunk styling */}
                  <div
                    className={cn(
                      "absolute inset-[1px]",
                      isSelected
                        ? "bg-gradient-to-br from-[#0a1a20] to-[#0f2a30]"
                        : isWinning && userVote !== null
                        ? "bg-gradient-to-br from-[#1a0a20] to-[#2a0f30]"
                        : isHovered && userVote === null && isVotingAllowed
                        ? "bg-gradient-to-br from-[#1a1e2e] to-[#252a3a]"
                        : "bg-gradient-to-br from-[#121620] to-[#1a1e2e]"
                    )}
                    style={{ clipPath }}
                  >
                    {/* Tech pattern overlay */}
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                      <div
                        className="absolute inset-0 bg-[radial-gradient(#3dd1c4_1px,transparent_1px)]"
                        style={{ backgroundSize: "16px 16px" }}
                      ></div>
                    </div>
                    {/* Edge highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-900/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-900/20 to-transparent"></div>
                  </div>

                  {/* Progress bar for results */}
                  {userVote !== null && (
                    <motion.div
                      className={cn(
                        "absolute inset-y-[1px] left-[1px] h-[calc(100%-2px)]",
                        "border-r border-white/10",
                        "bg-gradient-to-r from-cyan-900/30 to-fuchsia-900/30"
                      )}
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                        borderTopRightRadius: "4px",
                        borderBottomRightRadius: "4px",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  )}

                  {/* Content */}
                  <div className="relative z-10 flex justify-between items-center p-3">
                    <div className="flex items-center">
                      {isSelected && (
                        <div className="bg-cyan-500 rounded-full p-0.5 mr-2">
                          <Check className="h-3 w-3 text-black" />
                        </div>
                      )}
                      <span
                        className={cn(
                          "text-base font-medium",
                          isSelected
                            ? "text-cyan-400 font-medium"
                            : isWinning
                            ? "text-cyan-500"
                            : "text-white"
                        )}
                      >
                        {option.text}
                      </span>
                    </div>

                    {userVote !== null && (
                      <span
                        className={cn(
                          "text-base font-medium",
                          isWinning && isGlitching
                            ? "text-cyan-500 animate-[glitch_0.2s_ease_forwards]"
                            : "text-gray-400"
                        )}
                      >
                        {percentage}%
                      </span>
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Poll stats */}
      {userVote !== null && (
        <div className="text-xs text-gray-500 text-right mt-2">
          {poll?.totalVotes} {poll?.totalVotes === 1 ? "vote" : "votes"}
        </div>
      )}
    </div>
  );
}
