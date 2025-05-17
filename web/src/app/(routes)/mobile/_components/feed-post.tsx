"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  Repeat,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { FeedPoll } from "@/components/feed/feed-poll";

interface User {
  id: string | number;
  username: string;
  avatar: string;
  fullName?: string;
}

export interface Post {
  _id: string | number;
  author: User;
  content?: string;
  text?: string;
  image?: string;
  poll?: Poll;
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  createdAt: number;
  updatedAt?: number;
  likedBy: string[];
  retweetedBy: string[];
}

interface FeedPostProps {
  post: Post;
  glitchEffect?: boolean;
  onVote?: (pollId: string | number, optionId: string | number) => void;
  userVotes?: Record<string | number, string | number>;
  currentUserId?: string;
}

export function FeedPost({
  post,
  glitchEffect = false,
  onVote,
  userVotes = {},
  currentUserId,
}: FeedPostProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [, setIsCommentModalOpen] = useState(false);

  const likedByUser = currentUserId
    ? post.likedBy.includes(currentUserId)
    : false;
  const retweetByUser = currentUserId
    ? post.retweetedBy.includes(currentUserId)
    : false;
  const bookMarkedByUser = false; // This would need to be implemented with actual bookmark data

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  // Handle vote on a poll
  const handleVote = (pollId: string | number, optionId: string | number) => {
    if (onVote) {
      onVote(pollId, optionId);
    }
  };

  const openCommentModal = () => {
    setIsCommentModalOpen(true);
  };

  return (
    <div
      className={cn(
        "bg-black border border-cyan-900 rounded-sm p-4 relative",
        glitchEffect && "animate-[glitch_0.2s_ease_forwards]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-30 blur-[1px] -z-10 transition-opacity duration-300",
          isHovered ? "opacity-50" : "opacity-30"
        )}
      ></div>

      {/* Post header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border border-cyan-500">
            <AvatarImage
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.username}
            />
            <AvatarFallback className="bg-black text-cyan-400">
              {post.author.username && post.author.username.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <h3 className="font-bold text-white mr-1">
                {post.author.username}
              </h3>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2">@{post.author.username}</span>
              <span>• {formatTimestamp(post.updatedAt || post.createdAt)}</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-gray-500 hover:text-white hover:bg-gray-800"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post content */}
      <div className="mb-3">
        {(post.text || post.content) && (
          <p className="text-white text-base mb-3">
            {post.text || post.content}
          </p>
        )}

        {/* Poll content */}
        {post.poll && (
          <FeedPoll
            poll={post.poll}
            onVote={handleVote}
            userVote={userVotes[post.poll.id]}
          />
        )}

        {post.image && (
          <div className="relative rounded-sm overflow-hidden mt-3 mb-3 border border-cyan-900">
            <Image
              src=""
              alt="Post content"
              className="w-full object-cover max-h-[400px]"
            />
          </div>
        )}
      </div>

      {/* Post actions */}
      <div className="flex justify-between items-center pt-2 border-t border-cyan-900/50">
        {/* Like button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-full space-x-2",
                  likedByUser
                    ? "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                    : "text-gray-500 hover:text-fuchsia-400 hover:bg-fuchsia-950/30"
                )}
              >
                <div className="relative">
                  <Heart
                    className={cn("h-4 w-4", likedByUser && "fill-fuchsia-400")}
                  />
                  {likedByUser && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Heart className="h-4 w-4 text-fuchsia-400 fill-fuchsia-400" />
                    </motion.div>
                  )}
                </div>
                <span>{post.likedBy.length}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{likedByUser ? "Unlike" : "Like"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Comment button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={openCommentModal}
                className="rounded-full space-x-2 text-gray-500 hover:text-cyan-400 hover:bg-cyan-950/30"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Comment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Reshare button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-full space-x-2",
                  retweetByUser
                    ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                    : "text-gray-500 hover:text-cyan-400 hover:bg-cyan-950/30"
                )}
              >
                <Repeat className="h-4 w-4" />
                <span>{post.retweetedBy.length}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{retweetByUser ? "Undo Reshare" : "Reshare"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Bookmark button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-full",
                  bookMarkedByUser
                    ? "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                    : "text-gray-500 hover:text-fuchsia-400 hover:bg-fuchsia-950/30"
                )}
              >
                <Bookmark
                  className={cn(
                    "h-4 w-4",
                    bookMarkedByUser && "fill-fuchsia-400"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{bookMarkedByUser ? "Remove Bookmark" : "Bookmark"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Share button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-gray-500 hover:text-cyan-400 hover:bg-cyan-950/30"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
