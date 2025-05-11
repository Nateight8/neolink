"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Shield,
} from "lucide-react";

interface Post {
  id: number;
  user: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  image: string | null;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isReshared: boolean;
}

interface FeedPostProps {
  post: Post;
  onLike: () => void;
  onBookmark: () => void;
  onReshare: () => void;
  glitchEffect: boolean;
}

export function FeedPost({
  post,
  onLike,
  onBookmark,
  onReshare,
  glitchEffect,
}: FeedPostProps) {
  const [showLikeEffect, setShowLikeEffect] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    if (!post.isLiked) {
      setShowLikeEffect(true);
      setTimeout(() => setShowLikeEffect(false), 1000);
    }
    onLike();
  };

  // Extract hashtags from content
  const renderContent = () => {
    const words = post.content.split(" ");
    return words.map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <span
            key={index}
            className="text-cyan-400 hover:text-cyan-300 cursor-pointer hover-glitch"
          >
            {word}{" "}
          </span>
        );
      }
      return <span key={index}>{word} </span>;
    });
  };

  return (
    <div
      className={`bg-black border border-cyan-900 rounded-sm p-4 relative ${
        glitchEffect ? "animate-[glitch_0.2s_ease_forwards]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-30 blur-[1px] -z-10 transition-opacity duration-300 ${
          isHovered ? "opacity-50" : "opacity-30"
        }`}
      ></div>

      {/* Post header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border border-cyan-500">
            <AvatarImage
              src={post.user.avatar || "/placeholder.svg"}
              alt={post.user.name}
            />
            <AvatarFallback className="bg-black text-cyan-400">
              {post.user.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <h3 className="font-bold text-white mr-1">{post.user.name}</h3>
              {post.user.verified && (
                <Badge
                  variant="outline"
                  className="h-4 px-1 bg-cyan-950/50 border-cyan-500 text-cyan-400 text-[10px]"
                >
                  <Shield className="h-2 w-2 mr-1" />
                  VERIFIED
                </Badge>
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2">@{post.user.handle}</span>
              <span>• {post.timestamp}</span>
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
        <p className="text-white mb-3">{renderContent()}</p>
        {post.image && (
          <div className="relative rounded-sm overflow-hidden mt-2 border border-cyan-900">
            <img
              src={post.image || "/placeholder.svg"}
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
                onClick={handleLike}
                className={`rounded-full space-x-2 ${
                  post.isLiked
                    ? "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                    : "text-gray-500 hover:text-fuchsia-400 hover:bg-fuchsia-950/30"
                }`}
              >
                <div className="relative">
                  <Heart
                    className={`h-4 w-4 ${
                      post.isLiked ? "fill-fuchsia-400" : ""
                    }`}
                  />
                  {showLikeEffect && (
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
                <span>{post.likes.toLocaleString()}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{post.isLiked ? "Unlike" : "Like"}</p>
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
                className="rounded-full space-x-2 text-gray-500 hover:text-cyan-400 hover:bg-cyan-950/30"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments.toLocaleString()}</span>
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
                onClick={onReshare}
                className={`rounded-full space-x-2 ${
                  post.isReshared
                    ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                    : "text-gray-500 hover:text-cyan-400 hover:bg-cyan-950/30"
                }`}
              >
                <Repeat className="h-4 w-4" />
                <span>{post.shares.toLocaleString()}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{post.isReshared ? "Undo Reshare" : "Reshare"}</p>
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
                onClick={onBookmark}
                className={`rounded-full ${
                  post.isBookmarked
                    ? "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                    : "text-gray-500 hover:text-fuchsia-400 hover:bg-fuchsia-950/30"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    post.isBookmarked ? "fill-fuchsia-400" : ""
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{post.isBookmarked ? "Remove Bookmark" : "Bookmark"}</p>
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
