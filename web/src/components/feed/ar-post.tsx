"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
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
  CuboidIcon as Cube,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RotateCcw,
  Glasses,
  Cpu,
  Zap,
  X,
} from "lucide-react";

interface ARPost {
  id: number;
  user: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  arImage: string;
  arModel: string;
  arType: "hologram" | "overlay" | "fullspace";
  arRating: number;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isReshared: boolean;
  arTags: string[];
}

interface ARPostProps {
  post: ARPost;
  onLike: () => void;
  onBookmark: () => void;
  onReshare: () => void;
  glitchEffect: boolean;
}

export function ARPost({
  post,
  onLike,
  onBookmark,
  onReshare,
  glitchEffect,
}: ARPostProps) {
  const [showLikeEffect, setShowLikeEffect] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [activeLayer, setActiveLayer] = useState(1);
  const arContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle AR activation
  const toggleAR = () => {
    if (!isARActive) {
      setIsLoading(true);
      // Simulate loading time for AR content
      setTimeout(() => {
        setIsLoading(false);
        setIsARActive(true);
      }, 1500);
    } else {
      setIsARActive(false);
      setIsFullscreen(false);
      setRotation(0);
      setZoom(100);
      setActiveLayer(1);
    }
  };

  // Handle like action
  const handleLike = () => {
    if (!post.isLiked) {
      setShowLikeEffect(true);
      setTimeout(() => setShowLikeEffect(false), 1000);
    }
    onLike();
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Reset AR view
  const resetView = () => {
    setRotation(0);
    setZoom(100);
    setActiveLayer(1);
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

  // AR type badge color
  const getARTypeBadgeColor = () => {
    switch (post.arType) {
      case "hologram":
        return "border-cyan-500 bg-cyan-950/50 text-cyan-300";
      case "overlay":
        return "border-fuchsia-500 bg-fuchsia-950/50 text-fuchsia-300";
      case "fullspace":
        return "border-green-500 bg-green-950/50 text-green-300";
      default:
        return "border-gray-500 bg-gray-950/50 text-gray-300";
    }
  };

  // AR rating color
  const getARRatingColor = () => {
    if (post.arRating >= 4) return "text-green-400";
    if (post.arRating >= 3) return "text-yellow-400";
    return "text-red-400";
  };

  // Simulate AR content with rotation and zoom
  const arStyle = {
    transform: `rotateY(${rotation}deg) scale(${zoom / 100})`,
    transition: "transform 0.3s ease",
  };

  return (
    <div
      className={`bg-black border border-cyan-900 rounded-sm p-4 relative ${
        glitchEffect ? "animate-[glitch_0.2s_ease_forwards]" : ""
      } ${isFullscreen ? "fixed inset-0 z-50 overflow-y-auto" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-30 blur-[1px] -z-10 transition-opacity duration-300 ${
          isHovered ? "opacity-50" : "opacity-30"
        }`}
      ></div>

      {/* AR indicator */}
      <div className="absolute top-2 right-2 z-10">
        <Badge
          variant="outline"
          className="bg-black/80 border-cyan-500 text-cyan-400 px-2 py-1 flex items-center space-x-1"
        >
          <Cube className="h-3 w-3 mr-1" />
          <span>AR.CONTENT</span>
        </Badge>
      </div>

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

        {/* AR metadata */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge
            variant="outline"
            className={`rounded-sm ${getARTypeBadgeColor()}`}
          >
            <Glasses className="h-3 w-3 mr-1" />
            {post.arType.toUpperCase()}
          </Badge>

          <Badge
            variant="outline"
            className="rounded-sm border-cyan-500 bg-cyan-950/50 text-cyan-300"
          >
            <Cpu className="h-3 w-3 mr-1" />
            {`NEURAL_DEPTH: ${activeLayer}/3`}
          </Badge>

          <Badge
            variant="outline"
            className="rounded-sm border-fuchsia-500 bg-fuchsia-950/50 text-fuchsia-300"
          >
            <Zap className="h-3 w-3 mr-1" />
            {`IMMERSION: ${zoom}%`}
          </Badge>

          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-400">RATING:</span>
            <span className={`text-xs font-bold ${getARRatingColor()}`}>
              {post.arRating.toFixed(1)}
            </span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(post.arRating)
                      ? "text-yellow-400"
                      : "text-gray-600"
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AR tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {post.arTags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="rounded-sm border-gray-700 bg-gray-900/50 text-gray-300 text-xs"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* AR content container */}
        <div
          ref={arContainerRef}
          className={`relative rounded-sm overflow-hidden mt-2 border ${
            isARActive ? "border-cyan-500" : "border-cyan-900"
          } ${isFullscreen ? "h-[80vh]" : "h-[300px]"}`}
        >
          {/* AR preview image */}
          <div
            className={`w-full h-full bg-black flex items-center justify-center relative ${
              isARActive ? "opacity-100" : "opacity-80"
            }`}
          >
            {/* Base AR image */}
            <div
              className="relative w-full h-full"
              style={isARActive ? arStyle : {}}
            >
              {/* <img
                src={post.arImage || "/placeholder.svg"}
                alt="AR content preview"
                className={`w-full h-full object-cover ${
                  isARActive ? "object-contain" : "object-cover"
                }`}
              /> */}

              {/* Holographic overlay effect */}
              {isARActive && (
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-fuchsia-500/10 mix-blend-overlay pointer-events-none"></div>
              )}

              {/* Scan lines */}
              {isARActive && (
                <div className="absolute inset-0 scan-lines pointer-events-none"></div>
              )}

              {/* Digital noise */}
              {isARActive && (
                <div className="absolute inset-0 digital-noise pointer-events-none"></div>
              )}
            </div>

            {/* AR activation overlay */}
            {!isARActive && !isLoading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                <Button
                  onClick={toggleAR}
                  className="rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_15px_rgba(0,255,255,0.5)] mb-3"
                >
                  <Glasses className="h-4 w-4 mr-2" />
                  ACTIVATE AR EXPERIENCE
                </Button>
                <p className="text-xs text-gray-400 max-w-xs text-center">
                  This AR content requires neural bandwidth. Activate to
                  experience.
                </p>
              </div>
            )}

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-2 border-t-transparent border-cyan-500 rounded-full animate-spin mb-4"></div>
                <p className="text-cyan-400 animate-pulse">
                  INITIALIZING NEURAL INTERFACE...
                </p>
                <div className="w-48 h-1 bg-gray-800 mt-4 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 animate-[loading_1.5s_ease-in-out_infinite]"></div>
                </div>
              </div>
            )}

            {/* AR controls when active */}
            {isARActive && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-3 flex flex-wrap gap-2 items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={toggleAR}
                          className="h-8 w-8 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                        >
                          {isARActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isARActive ? "Deactivate AR" : "Activate AR"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={toggleFullscreen}
                          className="h-8 w-8 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                        >
                          {isFullscreen ? (
                            <Minimize2 className="h-4 w-4" />
                          ) : (
                            <Maximize2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={resetView}
                          className="h-8 w-8 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset View</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex-1 max-w-xs mx-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">ROTATION</span>
                    <span className="text-xs text-cyan-400">{rotation}°</span>
                  </div>
                  <Slider
                    value={[rotation]}
                    min={-180}
                    max={180}
                    step={1}
                    onValueChange={(value) => setRotation(value[0])}
                    className="w-full"
                  />
                </div>

                <div className="flex-1 max-w-xs mx-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">ZOOM</span>
                    <span className="text-xs text-fuchsia-400">{zoom}%</span>
                  </div>
                  <Slider
                    value={[zoom]}
                    min={50}
                    max={200}
                    step={5}
                    onValueChange={(value) => setZoom(value[0])}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-400 mr-1">LAYER:</span>
                  {[1, 2, 3].map((layer) => (
                    <Button
                      key={layer}
                      size="sm"
                      variant="ghost"
                      onClick={() => setActiveLayer(layer)}
                      className={`h-6 w-6 p-0 rounded-sm ${
                        activeLayer === layer
                          ? "bg-cyan-950/50 text-cyan-300 border border-cyan-500"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {layer}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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

      {/* Fullscreen close button */}
      {isFullscreen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 z-20"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
