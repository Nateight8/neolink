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
import { useSendMessage } from "@/hooks/api/use-message";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { v4 as uuidv4 } from "uuid";
import type { Message, MessageResponse } from "@/types/chat";
import { socket } from "@/lib/socket";

type OptimisticMessage = Message & { optimistic?: boolean; tempId?: string };

export default function ChatInput({
  neuralLinkActive,
  conversationId,
}: {
  neuralLinkActive: boolean;
  conversationId: string;
}) {
  const [newMessage, setNewMessage] = useState("");
  const [showSendButton, setShowSendButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Emit typing events
  useEffect(() => {
    if (newMessage.trim().length > 0) {
      socket.emit("typing", conversationId);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", conversationId);
      }, 2000); // 2-second timeout
    } else {
      socket.emit("stopTyping", conversationId);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
    // Cleanup on unmount
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [newMessage, conversationId]);

  const { mutateAsync } = useSendMessage(conversationId, {
    onSuccess: (data) => {
      setNewMessage("");
      inputRef.current?.focus();
      // Replace the optimistic message with the real one
      queryClient.setQueryData(
        ["messages", conversationId],
        (old: MessageResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            messages: [
              ...old.messages.filter((msg) => !msg.optimistic),
              data.message,
            ],
          };
        }
      );
    },
    onError: () => {
      // Remove the optimistic message on error
      queryClient.setQueryData(
        ["messages", conversationId],
        (old: MessageResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            messages: old.messages.filter((msg) => !msg.optimistic),
          };
        }
      );
    },
  });

  // Update showSendButton based on input changes
  useEffect(() => {
    setShowSendButton(newMessage.trim().length > 0);
  }, [newMessage]);

  const handleSendMessage = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit("stopTyping", conversationId);
    }
    if (newMessage.trim() && user) {
      const tempId = uuidv4();
      const now = new Date().toISOString();
      const senderIdFromParam = conversationId.split("-")[0];
      // Construct optimistic message
      const optimisticMessage = {
        id: tempId,
        conversationId,
        senderId: user.participantId,
        content: newMessage,
        messageType: "text",
        attachments: [],
        readBy: [],
        createdAt: now,
        updatedAt: now,
        isRead: true,
        optimistic: true,
        tempId, // for matching
        sender: {
          id: user._id,
          participantId: user.participantId,
          fullName: user.fullName || user.username || user.handle || "User",
          username: user.username,
          handle: user.handle,
          avatarUrl: user.avatar,
        },
      };
      // Only optimistically update if the sender is the logged-in user
      if (optimisticMessage.senderId === user.participantId) {
        queryClient.setQueryData(
          ["messages", conversationId],
          (old: MessageResponse | undefined) => {
            if (!old) return old;
            return {
              ...old,
              messages: [...old.messages, optimisticMessage],
            };
          }
        );
      }
      setNewMessage(""); // Clear input immediately after optimistic update
      mutateAsync(
        { content: newMessage, tempId },
        {
          onSuccess: (data) => {
            const patchedMessage = {
              ...data.message,
              sender:
                (data.message as unknown as Message).sender ||
                (data.message.senderId === senderIdFromParam
                  ? {
                      id: user._id,
                      participantId: user.participantId,
                      fullName:
                        user.fullName || user.username || user.handle || "User",
                      username: user.username,
                      handle: user.handle,
                      avatarUrl: user.avatar,
                    }
                  : undefined),
            };
            // Remove optimistic message by tempId
            queryClient.setQueryData(
              ["messages", conversationId],
              (old: MessageResponse | undefined) => {
                if (!old) return old;
                const filtered = old.messages.filter(
                  (msg: OptimisticMessage) => msg.tempId !== data.message.tempId
                );
                return {
                  ...old,
                  messages: [...filtered, patchedMessage],
                };
              }
            );
          },
          onError: () => {
            // Remove the optimistic message on error
            queryClient.setQueryData(
              ["messages", conversationId],
              (old: MessageResponse | undefined) => {
                if (!old) return old;
                const filtered = old.messages.filter(
                  (msg: OptimisticMessage) => {
                    const match =
                      msg.optimistic &&
                      msg.content === newMessage &&
                      msg.senderId === user.participantId;
                    return !match;
                  }
                );
                return {
                  ...old,
                  messages: filtered,
                };
              }
            );
          },
        }
      );
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
