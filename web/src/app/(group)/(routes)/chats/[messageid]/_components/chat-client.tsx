"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import type { Message, MessageResponse } from "@/types/chat";
import ChatHeader from "./header";
import ChatInput from "./chat-input";
import Messages from "./messages";
import NeuralLink from "./neural-link";
import { useGetMessages } from "@/hooks/api/use-message";

export default function ChatClient({
  conversationId,
}: {
  conversationId: string;
}) {
  const [activateNeuralLink, setActivateNeuralLink] = useState(false);
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);
  const neuralLinkStrength = 6;

  const { data } = useGetMessages(conversationId);
  const messages = data?.messages;
  const conversation = data?.conversation;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;
    // Connect and join room
    if (!socket.connected) socket.connect();
    socket.emit("joinConversation", conversationId);

    // Listen for new messages
    const handleNewMessage = (newMessage: Message) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        (old: MessageResponse | undefined) => {
          if (!old) return old;
          // Avoid duplicates (by id or tempId)
          const exists = old.messages.some(
            (msg) =>
              msg.id === newMessage.id ||
              (msg.tempId && msg.tempId === newMessage.tempId)
          );
          if (exists) return old;
          return {
            ...old,
            messages: [...old.messages, newMessage],
          };
        }
      );
    };
    socket.on("newMessage", handleNewMessage);

    // Listen for typing indicators
    socket.on("isTyping", () => setIsOpponentTyping(true));
    socket.on("isNotTyping", () => setIsOpponentTyping(false));

    // Cleanup
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("isTyping");
      socket.off("isNotTyping");
      // Optionally leave room or disconnect if needed
    };
  }, [conversationId, queryClient]);

  return (
    <div className="flex flex-col h-full w-full">
      <ChatHeader
        activeNeuralLink={activateNeuralLink}
        setActiveNeuralLink={setActivateNeuralLink}
        user={conversation?.otherParticipant}
      />
      {activateNeuralLink && (
        <NeuralLink neuralLinkStrength={neuralLinkStrength} />
      )}
      <div className="flex-1 overflow-scroll">
        <Messages
          neuralLinkActive={activateNeuralLink}
          // neuralLinkStrength={neuralLinkStrength}
          messages={messages || []}
          isOpponentTyping={isOpponentTyping}
          otherParticipant={conversation?.otherParticipant}
        />
      </div>
      <ChatInput
        conversationId={conversationId}
        neuralLinkActive={activateNeuralLink}
      />
    </div>
  );
}
