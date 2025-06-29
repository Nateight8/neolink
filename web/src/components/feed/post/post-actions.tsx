import { useAuth } from "@/contexts/auth-context";
import { useEngagement } from "@/hooks/api/use-engagement";
import { Post } from "@/types/chat";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookmarkSimpleIcon,
  ChatCenteredTextIcon,
  FlagIcon,
  HeartIcon,
  RepeatIcon,
} from "@phosphor-icons/react";

export default function PostActions({ post }: { post: Post }) {
  const { user } = useAuth();
  const { handleReaction } = useEngagement(post._id);
  const [isAnimating, setIsAnimating] = useState(false);

  const isLiked = user ? post.likedBy.includes(user._id) : false;
  // Placeholder for bookmark state, as it's not on the Post model yet
  const isBookmarked = false;

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    handleReaction("like");
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground mb-2">
        {/* Reply Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) =>
                handleAction(e, () => console.log("Reply clicked"))
              }
              className="flex-1 flex items-center justify-center p-2 rounded-md transition-colors duration-200 hover:bg-muted hover:text-cyan-400"
            >
              <ChatCenteredTextIcon className="w-4 h-4 mr-2" />
              <span>{0}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>comment</TooltipContent>
        </Tooltip>

        {/* Like Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={handleLikeClick}
              className={`flex-1 flex items-center justify-center p-2 rounded-md transition-colors duration-200 hover:bg-muted ${
                isLiked ? "text-fuchsia-400" : "hover:text-fuchsia-400"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                animate={
                  isAnimating
                    ? {
                        x: [0, -3, 3, -3, 3, 0],
                        rotate: [0, -5, 5, -5, 5, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                }}
              >
                <HeartIcon
                  className={`w-4 h-4 mr-2 transition-all duration-300 ${
                    isLiked ? "fill-current" : ""
                  }`}
                />
              </motion.div>
              <motion.span
                animate={
                  isAnimating
                    ? {
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {post.likedBy.length.toLocaleString()}
              </motion.span>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>{isLiked ? "Unlike" : "Like"}</TooltipContent>
        </Tooltip>

        {/* Share Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) =>
                handleAction(e, () => console.log("Share clicked"))
              }
              className="flex-1 flex items-center justify-center p-2 rounded-md transition-colors duration-200 hover:bg-muted hover:text-green-400"
            >
              <RepeatIcon className="w-4 h-4 mr-2" />
              <span> {0}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Share post</TooltipContent>
        </Tooltip>

        {/* Bookmark Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => handleAction(e, () => handleReaction("bookmark"))}
              className={`flex-1 flex items-center justify-center p-2 rounded-md transition-colors duration-200 hover:bg-muted ${
                isBookmarked ? "text-yellow-400" : "hover:text-yellow-400"
              }`}
            >
              <BookmarkSimpleIcon
                className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`}
              />
              {/* <span>{0}</span> */}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {isBookmarked ? "Remove from bookmarks" : "Bookmark post"}
          </TooltipContent>
        </Tooltip>

        {/* Report Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) =>
                handleAction(e, () => console.log("Report clicked"))
              }
              className="flex-1 flex items-center justify-center p-2 rounded-md transition-colors duration-200 hover:bg-muted hover:text-red-500"
            >
              <FlagIcon className="w-4 h-4 mr-2" />
              {/* <span>Report</span> */}
            </button>
          </TooltipTrigger>
          <TooltipContent>Report post</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
