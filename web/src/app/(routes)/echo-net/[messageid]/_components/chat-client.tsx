"use client";

import { useState } from "react";
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
  const neuralLinkStrength = 6;

  const { data } = useGetMessages(conversationId);
  const messages = data?.messages;
  const conversation = data?.conversation;

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
        />
      </div>
      <ChatInput
        conversationId={conversationId}
        neuralLinkActive={activateNeuralLink}
      />
    </div>
  );
}
