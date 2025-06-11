import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PaperclipIcon, Send, Sparkles, Cuboid } from "lucide-react";
import { useState } from "react";

export default function ChatInput({
  neuralLinkActive,
}: {
  neuralLinkActive: boolean;
}) {
  const [newMessage, setNewMessage] = useState("");
  const handleSendMessage = () => {};

  return (
    <>
      <div className="p-4 border-t border-cyan-900">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px] -z-10"></div>
            <Input
              placeholder={
                neuralLinkActive
                  ? "TRANSMIT_NEURAL_MESSAGE..."
                  : "NEURAL_LINK_INACTIVE. TEXT_ONLY_MODE."
              }
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                  >
                    <PaperclipIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent variant="production">
                  <p>Attach File</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={!neuralLinkActive}
                    className="h-10 w-10 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 disabled:text-gray-700 disabled:hover:bg-transparent"
                  >
                    <Cuboid className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent variant="production">
                  <p>Send AR Content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={!neuralLinkActive}
                    className="h-10 w-10 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30 disabled:text-gray-700 disabled:hover:bg-transparent"
                  >
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent variant="production">
                  <p>Send Neural Sensation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="h-10 rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>{" "}
    </>
  );
}
