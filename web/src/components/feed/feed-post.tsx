"use client";

import React, { useState } from "react";
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
import type { Post } from "@/types/chat";
import Image from "next/image";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { CommentThreadModal } from "./comment-thread";
import { getCompactRelativeTime } from "@/lib/relative-time";
import { FormattedContent } from "../shared/formatted-content";
import { FeedPoll } from "./feed-poll";
import { useAuth } from "@/contexts/auth-context";

interface FeedPostProps {
  post: Post;
  glitchEffect: boolean;
}

export function FeedPost({ post, glitchEffect }: FeedPostProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // Extract hashtags from content

  const { user } = useAuth();

  const likedByUser = user?._id ? post.likedBy.includes(user._id) : false;
  const retweetByUser = user?._id ? post.retweetedBy.includes(user._id) : false;
  const bookMarkedByUser = true;

  const queryClient = useQueryClient();
  const { mutate: reactionMutation } = useMutation({
    mutationFn: async (type: "like" | "retweet") => {
      await axiosInstance.post(`/posts/${post._id}/reactions`, { type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post-feed"],
      });
    },
  });

  const handlePostReaction = (type: "like" | "retweet") => {
    reactionMutation(type);
  };

  const openCommentModal = () => {
    setIsCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  const updatedAt = getCompactRelativeTime(post.updatedAt);
  // const postHasPoll = post

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-black/50 backdrop-blur-sm border border-cyan-900/30 rounded-lg p-5 relative overflow-hidden transition-all duration-300 ${
          glitchEffect ? "animate-[glitch_0.2s_ease_forwards]" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-lg -z-10 transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-fuchsia-500/5 rounded-lg -z-20" />

        {/* Post header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3 group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Avatar className="h-11 w-11 border border-cyan-500/50 transition-transform duration-200 group-hover:border-cyan-400/70">
                <AvatarImage
                  src={"/placeholder.svg"}
                  alt={post.author?.fullName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 text-cyan-300 font-medium">
                  {post.author?.username &&
                    post.author.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="leading-tight">
              <div className="flex items-center group">
                <h3 className="font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer">
                  {post.author?.handle}
                </h3>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <span className="hover:text-cyan-300 transition-colors cursor-pointer">
                  @{post.author?.username}
                </span>
                <span className="mx-1.5 text-gray-600">·</span>
                <span
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                  title={new Date(post.updatedAt).toLocaleString()}
                >
                  {updatedAt}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors duration-200"
          >
            <MoreHorizontal className="h-4.5 w-4.5" />
          </Button>
        </div>

        {/* Post content */}
        <div className="mb-3">
          <FormattedContent content={post.content} />
          {post.image && (
            <div className="relative rounded-sm overflow-hidden mt-2 border border-cyan-900">
              <Image
                src={post?.image}
                alt="Post content"
                className="w-full object-cover max-h-[400px]"
              />
            </div>
          )}
          {post.hasPoll && <FeedPoll poll={post?.poll} />}
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
                  onClick={() => handlePostReaction("like")}
                  className={`rounded-full space-x-2 ${
                    likedByUser
                      ? "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                      : "text-gray-500 hover:text-fuchsia-400 hover:bg-fuchsia-950/30"
                  }`}
                >
                  <div className="relative">
                    <Heart
                      className={`h-4 w-4 ${
                        likedByUser ? "fill-fuchsia-400" : ""
                      }`}
                    />
                    {likedByUser === true && (
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
                  <span>{post.likedBy.length.toLocaleString()}</span>
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
                  <span>0</span>
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
                  onClick={() => handlePostReaction("retweet")}
                  className={`rounded-full space-x-2 ${
                    retweetByUser
                      ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                      : "text-gray-500 hover:text-cyan-400 hover:bg-cyan-950/30"
                  }`}
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
                  // onClick={onBookmark}
                  className={`rounded-full text-gray-500 hover:text-fuchsia-400 hover:bg-fuchsia-950/30
                   ${
                     bookMarkedByUser
                       ? "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                       : "text-gray-500 hover:text-fuchsia-400 hover:bg-fuchsia-950/30"
                   }`}
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      bookMarkedByUser ? "fill-fuchsia-400" : ""
                    }`}
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
      </motion.div>

      {/* Comment Thread Modal */}
      <CommentThreadModal
        post={post}
        isOpen={isCommentModalOpen}
        onClose={closeCommentModal}
      />
    </>
  );
}
