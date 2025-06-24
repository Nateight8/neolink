"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Heart,
  MessageCircle,
  Share,
  Clock,
  Zap,
  HelpCircle,
} from "lucide-react";

export default function ChessChallengePost() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(12);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white shadow-lg border-0">
      {/* Header Section */}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-gray-200">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt="Magnus Carlsen"
            />
            <AvatarFallback className="bg-gray-800 text-white font-semibold">
              MC
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">
              Magnus Carlsen
            </h3>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Challenge Section - Focal Point */}
        <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-center gap-6">
            {/* Challenger Avatar */}
            <div className="flex flex-col items-center">
              <Avatar className="w-16 h-16 border-3 border-gray-800 shadow-lg">
                <AvatarImage
                  src="/placeholder.svg?height=64&width=64"
                  alt="Magnus Carlsen"
                />
                <AvatarFallback className="bg-gray-800 text-white font-bold text-lg">
                  MC
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-gray-700 mt-2">
                Challenger
              </span>
            </div>

            {/* VS Badge */}
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold text-lg px-4 py-2 rounded-full shadow-md border-2 border-amber-300">
              VS
            </div>

            {/* Opponent Placeholder */}
            <div className="flex flex-col items-center">
              <Avatar className="w-16 h-16 border-3 border-dashed border-amber-400 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
                <AvatarFallback className="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600">
                  <HelpCircle className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-amber-600 mt-2">
                You?
              </span>
            </div>
          </div>
        </div>

        {/* Game Settings */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-700">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="font-medium">Blitz</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-1 text-gray-700">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium">5+3 min</span>
            </div>
          </div>
        </div>

        {/* Accept Challenge Button */}
        <Button
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-3 rounded-xl shadow-lg border-0 transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          size="lg"
        >
          Accept Challenge
        </Button>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>

            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">8</span>
            </button>

            <button className="flex items-center gap-1 text-gray-600 hover:text-green-500 transition-colors">
              <Share className="w-5 h-5" />
              <span className="text-sm font-medium">3</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
