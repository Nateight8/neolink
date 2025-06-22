import { useAuth } from "@/contexts/auth-context";
import { useEngagement } from "@/hooks/api/use-engagement";
import { Post } from "@/types/chat";
import {
  MessageSquare,
  Heart,
  Flag,
  Bookmark,
  ArrowBigUpDash,
} from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PostActions({ post }: { post: Post }) {
  const { user } = useAuth();
  const { handleReaction } = useEngagement(post._id);

  const isLiked = user ? post.likedBy.includes(user._id) : false;
  // Placeholder for bookmark state, as it's not on the Post model yet
  const isBookmarked = false;

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
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
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>Reply</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>comment</TooltipContent>
        </Tooltip>

        {/* Like Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => handleAction(e, () => handleReaction("like"))}
              className={`flex-1 flex items-center justify-center p-2 rounded-md transition-colors duration-200 hover:bg-muted ${
                isLiked ? "text-fuchsia-400" : "hover:text-fuchsia-400"
              }`}
            >
              <Heart
                className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
              />
              <span>{post.likedBy.length.toLocaleString()}</span>
            </button>
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
              <ArrowBigUpDash className="w-4 h-4 mr-2" />
              <span>Share</span>
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
              <Bookmark
                className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`}
              />
              <span>{isBookmarked ? "Saved" : "Save"}</span>
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
              <Flag className="w-4 h-4 mr-2" />
              <span>Report</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Report post</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
