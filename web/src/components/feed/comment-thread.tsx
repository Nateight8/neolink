"use client";

import React, { useState, useRef } from "react";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Post } from "@/types/chat";
import {
  Heart,
  MessageCircle,
  Zap,
  SendHorizontal,
  Clock,
  X,
} from "lucide-react";

// import { useQueryClient } from "@tanstack/react-query";
import { LoadingIndicator } from "@/components/loading-indicator";
import { cn } from "@/lib/utils";
import { FormattedContent } from "../shared/formatted-content";
import { useAuth } from "@/contexts/auth-context";

interface Comment {
  id: string;
  author: {
    username: string;
    fullName: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

interface CommentThreadModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentThreadModal({
  post,
  isOpen,
  onClose,
}: CommentThreadModalProps) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationActive, setAnimationActive] = useState(true);
  const { user } = useAuth();
  // const queryClient = useQueryClient();
  const raysRef = useRef<HTMLDivElement>(null);

  // Mock comments data - in a real app, you would fetch this from your API
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: {
        username: "cyberRunner",
        fullName: "Cyber Runner",
        avatar: "/placeholder.svg?height=40&width=40&text=CR",
      },
      content:
        "This neural link upgrade looks promising. Have you tested the latency?",
      createdAt: "2h ago",
      likes: 5,
      isLiked: false,
    },
    {
      id: "2",
      author: {
        username: "neonShadow",
        fullName: "Neon Shadow",
        avatar: "/placeholder.svg?height=40&width=40&text=NS",
      },
      content:
        "I've seen similar tech in the eastern sectors. The neural integration is smoother but the bandwidth is limited. #CyberTech",
      createdAt: "1h ago",
      likes: 3,
      isLiked: true,
    },
  ]);

  const handleSubmitComment = () => {
    if (!commentText.trim() || !user) return;

    setIsSubmitting(true);

    // In a real app, you would call your API here
    setTimeout(() => {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        author: {
          username: user.username || "anonymous",
          fullName: user.fullName || "Anonymous User",
          avatar: "",
        },
        content: commentText,
        createdAt: "Just now",
        likes: 0,
        isLiked: false,
      };

      setComments([...comments, newComment]);
      setCommentText("");
      setIsSubmitting(false);

      // In a real app, you would invalidate your query cache here
      // queryClient.invalidateQueries(["post-comments", post._id]);
    }, 1000);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const newIsLiked = !comment.isLiked;
          return {
            ...comment,
            isLiked: newIsLiked,
            likes: newIsLiked ? comment.likes + 1 : comment.likes - 1,
          };
        }
        return comment;
      })
    );
  };

  const toggleAnimation = () => {
    setAnimationActive(!animationActive);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          onClick={onClose}
        />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-[600px] max-h-[90vh] bg-gradient-to-b from-black via-black to-cyan-950 rounded-md border border-cyan-900/50 shadow-[0_0_25px_rgba(0,0,0,0.5)] overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent clicks from reaching the overlay
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-2 right-2 h-8 w-8 rounded-full text-gray-500 hover:text-white hover:bg-gray-800 z-20"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Animated rays background */}
            <div
              ref={raysRef}
              className={cn(
                "absolute inset-0 overflow-hidden pointer-events-none z-0",
                !animationActive && "opacity-0"
              )}
            >
              {/* Generate 10 rays */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute top-0 w-[1px] bg-cyan-500/20",
                    "animate-ray-fall"
                  )}
                  style={{
                    left: `${10 + i * 8}%`,
                    height: `${30 + Math.random() * 30}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${3 + Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>

            {/* Original post */}
            <div className="p-4 border-b border-cyan-900/30 relative z-10">
              <div className="flex items-start space-x-3 mb-3">
                <Avatar className="h-10 w-10 border border-cyan-500">
                  <AvatarImage
                    src={"/placeholder.svg"}
                    alt={post.author?.fullName || 'User'}
                  />
                  <AvatarFallback className="bg-black text-cyan-400">
                    {post.author?.username?.substring(0, 2) || 'US'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-bold text-white mr-1">
                      {post.author?.username || 'User'}
                    </h3>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">@{post.author?.username || 'user'}</span>
                    <span>• {post.updatedAt}</span>
                  </div>
                </div>
              </div>

              <div className="text-white mb-3">
                <FormattedContent content={post.content} />
              </div>

              <div className="flex space-x-4 text-xs text-gray-500 mt-2">
                <div className="flex items-center">
                  <Heart className="h-3 w-3 mr-1" />
                  <span>{post.likedBy.length} likes</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  <span>{comments.length} comments</span>
                </div>
              </div>
            </div>

            {/* Comments section */}
            <div className="max-h-[300px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-black/50 relative z-10">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 hover:bg-cyan-950/10 transition-colors rounded-md my-1 backdrop-blur-sm bg-black/30"
                >
                  <div className="flex space-x-3">
                    <Avatar className="h-8 w-8 border border-cyan-900 shadow-[0_0_5px_rgba(0,255,255,0.2)]">
                      <AvatarImage
                        src={comment.author.avatar || "/placeholder.svg"}
                        alt={comment.author.username}
                      />
                      <AvatarFallback className="bg-black text-cyan-400">
                        {comment.author.username.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-white text-sm">
                          {comment.author.username}
                        </span>
                        <span className="text-gray-500 text-xs ml-2 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">
                        <FormattedContent content={comment.content} />
                      </p>

                      <div className="flex items-center mt-2 space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeComment(comment.id)}
                          className={`h-6 px-2 py-1 rounded-sm text-xs ${
                            comment.isLiked
                              ? "text-fuchsia-400 hover:text-fuchsia-300"
                              : "text-gray-500 hover:text-fuchsia-400"
                          }`}
                        >
                          <Heart
                            className={`h-3 w-3 mr-1 ${
                              comment.isLiked ? "fill-fuchsia-400" : ""
                            }`}
                          />
                          <span>{comment.likes}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 py-1 rounded-sm text-xs text-gray-500 hover:text-cyan-400"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          <span>Reply</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment input */}
            <div className="p-3 border-t border-cyan-900/30 relative z-10">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8 border border-cyan-500">
                  <AvatarImage src="" alt="Your avatar" />
                  <AvatarFallback className="bg-black text-cyan-400">
                    {user?.username?.substring(0, 2) || "ME"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="relative">
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="ADD YOUR NEURAL RESPONSE..."
                      className="min-h-[80px] bg-black/70 backdrop-blur-sm border-cyan-900/50 text-white placeholder:text-gray-500 focus-visible:ring-cyan-500 resize-none shadow-[inset_0_0_10px_rgba(0,255,255,0.1)] rounded-md"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={toggleAnimation}
                        className={cn(
                          "h-7 w-7 rounded-sm hover:bg-cyan-950/30 transition-colors",
                          animationActive
                            ? "text-cyan-400 bg-cyan-950/30 shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                            : "text-gray-500 hover:text-cyan-400"
                        )}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || isSubmitting}
                      className="rounded-md bg-cyan-800 hover:bg-cyan-700 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)] relative h-8 px-3 text-xs"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <LoadingIndicator size="sm" showText={false} />
                          <span>TRANSMITTING...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <SendHorizontal className="h-3 w-3" />
                          <span>TRANSMIT</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
