import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PaperclipIcon, Send, Sparkles, Gamepad2, Mic } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function ChatInput({
  neuralLinkActive,
}: {
  neuralLinkActive: boolean;
}) {
  const [newMessage, setNewMessage] = useState("");
  const [showSendButton, setShowSendButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update showSendButton based on input changes
  useEffect(() => {
    setShowSendButton(newMessage.trim().length > 0);
  }, [newMessage]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Your send message logic here
      console.log("Sending message:", newMessage);
      setNewMessage("");
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <div className="px-4 py-2 border-t border-cyan-900">
        <div className="flex items-center gap-2">
          {/* Action Buttons - Hidden on mobile when input has text */}
          <div
            className={`transition-all duration-200 ${
              newMessage.trim() ? "hidden md:flex" : "flex"
            } items-center`}
          >
            {/* Attach File Button */}
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

            {/* Game Pad Button (replacing Send AR) */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={!neuralLinkActive}
                    className="h-10 w-10 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 disabled:text-gray-700 disabled:hover:bg-transparent"
                  >
                    <Gamepad2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent variant="production">
                  <p>Game Controls</p>
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
          </div>

          {/* Message Input */}
          <div className="relative flex-1">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px] -z-10"></div>
            <Input
              placeholder={
                neuralLinkActive
                  ? "TRANSMIT_NEURAL_MESSAGE..."
                  : "NEURAL_LINK_INACTIVE. TEXT_ONLY_MODE."
              }
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="bg-black border-cyan-900 text-white font-mono relative focus-visible:ring-cyan-500 focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            />
          </div>

          {/* Animated Mic/Send Button */}
          <div className="relative h-10 w-10">
            <AnimatePresence mode="wait" initial={false}>
              {showSendButton ? (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute inset-0"
                >
                  <Button
                    onClick={handleSendMessage}
                    className="h-10 w-10 p-0 bg-transparent border-cyan-500 border text-cyan-500 rounded-sm shadow-[0_0_10px_rgba(0,255,255,0.3)]  hover:bg-cyan-950/30"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="mic"
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute inset-0"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 p-0 bg-transparent border-cyan-500 border text-cyan-500 rounded-sm shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                        >
                          <Mic className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent variant="production">
                        <p>Send Voice Note</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>{" "}
    </>
  );
}
