"use client";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { Paperclip, CuboidIcon as Cube, Sparkles, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ChatInput() {
  const [newMessage, setNewMessage] = useState("");

  // Message handling
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // TODO: Implement message sending logic
    setNewMessage("");
  };

  return (
    <>
      <div className="p-4 border-t border-cyan-900">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px] -z-10"></div>
            <Input
              placeholder="TRANSMIT_NEURAL_MESSAGE..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="bg-black border-cyan-900 text-white font-mono relative focus-visible:ring-cyan-500"
            />
          </div>

          <div className="flex space-x-1">
            {/* Attach File */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach File</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Send AR Content */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 disabled:text-gray-700 disabled:hover:bg-transparent"
                  >
                    <Cube className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send AR Content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Send Neural Sensation */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30 disabled:text-gray-700 disabled:hover:bg-transparent"
                  >
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send Neural Sensation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Send Message */}
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="h-10 rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
