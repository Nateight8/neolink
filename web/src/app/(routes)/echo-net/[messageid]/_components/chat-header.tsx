"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Phone,
  Video,
  Brain,
  MoreVertical,
  Shield,
} from "lucide-react";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useState } from "react";

export default function ChatHeader() {
  // State management
  const [showMobileConversation, setShowMobileConversation] = useState(false); //<===move to parent
  const [neuralLinkActive, setNeuralLinkActive] = useState(false);

  // Placeholder function for getting active conversation data
  const getActiveConversationData = () => {
    // This would typically come from a context or state management system
    return {
      user: {
        name: "John Doe",
        handle: "johndoe",
        avatar: "/placeholder.svg",
        status: "online",
        verified: true,
        isEncrypted: true,
      },
    };
  };

  // Neural link toggle
  const toggleNeuralLink = () => {
    setNeuralLinkActive((prev) => !prev);
  };

  return (
    <>
      <div className="p-4 border-b border-cyan-900 flex items-center justify-between">
        {/* User info section */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileConversation(false)}
            className="mr-2 md:hidden h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center">
            <div className="relative">
              <Avatar className="h-10 w-10 border border-cyan-500">
                <AvatarImage
                  src={
                    getActiveConversationData()?.user.avatar ||
                    "/placeholder.svg"
                  }
                  alt={getActiveConversationData()?.user.name || "User"}
                />
                <AvatarFallback className="bg-black text-cyan-400">
                  {getActiveConversationData()?.user.name.substring(0, 2) ||
                    "UN"}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-black ${
                  getActiveConversationData()?.user.status === "online"
                    ? "bg-green-500"
                    : getActiveConversationData()?.user.status === "away"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                }`}
              ></div>
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <h3 className="font-bold text-white mr-1">
                  {getActiveConversationData()?.user.name}
                </h3>
                {getActiveConversationData()?.user.verified && (
                  <Badge
                    variant="outline"
                    className="h-4 px-1 bg-cyan-950/50 border-cyan-500 text-cyan-400 text-[10px]"
                  >
                    <Shield className="h-2 w-2 mr-1" />
                    VERIFIED
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-xs">
                <span className="text-cyan-400 font-mono">
                  @{getActiveConversationData()?.user.handle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1">
          {/* Neural Voice Call */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Neural Voice Call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Neural Video Call */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                >
                  <Video className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Neural Video Call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Neural Link Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleNeuralLink}
                  className={`h-8 w-8 rounded-sm ${
                    neuralLinkActive
                      ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                      : "text-gray-500 hover:text-gray-400 hover:bg-gray-900/30"
                  }`}
                >
                  <Brain className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {neuralLinkActive
                    ? "Deactivate Neural Link"
                    : "Activate Neural Link"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* More Options */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm text-gray-400 hover:text-gray-300 hover:bg-gray-900/30"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More Options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}
