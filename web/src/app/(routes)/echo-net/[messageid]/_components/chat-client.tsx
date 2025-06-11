"use client";

import { useState } from "react";
import ChatHeader from "./header";
import ChatInput from "./chat-input";
import Messages from "./messages";
import NeuralLink from "./neural-link";

export default function ChatClient() {
  const [activateNeuralLink, setActivateNeuralLink] = useState(false);
  const neuralLinkStrength = 6;
  return (
    <div className="flex flex-col h-full w-full">
      <ChatHeader
        activeNeuralLink={activateNeuralLink}
        setActiveNeuralLink={setActivateNeuralLink}
      />{" "}
      {activateNeuralLink && (
        <NeuralLink neuralLinkStrength={neuralLinkStrength} />
      )}
      <div className="flex-1 overflow-scroll">
        <Messages
          neuralLinkActive={activateNeuralLink}
          neuralLinkStrength={neuralLinkStrength}
          messages={ACTIVE_CONVERSATION_MESSAGES || []}
        />
      </div>
      <ChatInput neuralLinkActive={activateNeuralLink} />
    </div>
  );
}

// Mock data for active conversation messages
const ACTIVE_CONVERSATION_MESSAGES = [
  {
    id: "1",
    sender: "other",
    text: "Hey, did you see the new neural implant upgrade?",
    time: "10:30",
    status: "read",
    type: "text",
  },
  {
    id: "2",
    sender: "other",
    text: "It's supposed to increase bandwidth by 200%",
    time: "10:31",
    status: "read",
    type: "text",
  },
  {
    id: "3",
    sender: "self",
    text: "Yeah, I heard about it. But I'm skeptical about the security implications.",
    time: "10:35",
    status: "read",
    type: "text",
  },
  {
    id: "4",
    sender: "other",
    text: "I've already installed it. The neural feedback is incredible.",
    time: "10:36",
    status: "read",
    type: "text",
  },
  {
    id: "5",
    sender: "other",
    type: "neural",
    neuralData: {
      type: "sensation",
      intensity: 0.7,
      description: "Neural sensation: Increased processing speed",
    },
    time: "10:37",
    status: "read",
  },
  {
    id: "6",
    sender: "self",
    text: "Whoa, I felt that through the link. That's intense!",
    time: "10:38",
    status: "read",
    type: "text",
  },
  {
    id: "7",
    sender: "other",
    text: "Check out this AR model of the implant",
    time: "10:40",
    status: "read",
    type: "text",
  },
  {
    id: "8",
    sender: "other",
    type: "ar",
    arData: {
      preview: "/placeholder.svg?height=300&width=400&text=NEURAL_IMPLANT_AR",
      model: "/ar-models/implant.glb",
      description: "Neural Implant X-7500",
    },
    time: "10:41",
    status: "read",
  },
  {
    id: "9",
    sender: "self",
    text: "That looks advanced. Where did you get it installed?",
    time: "10:42",
    status: "delivered",
    type: "text",
  },
];
