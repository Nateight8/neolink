"use client";

import React, { useState, useRef } from "react";

import { Lock } from "lucide-react";
import { ChatMessage } from "@/components/chats/chat-message";
import { NeuralIndicator } from "@/components/chats/neural-indicator";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

export default function ChatClient() {
  // State management
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [neuralLinkActive, setNeuralLinkActive] = useState(false);
  const [neuralLinkStrength, setNeuralLinkStrength] = useState(0.5);
  //   const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    ACTIVE_CONVERSATION_MESSAGES
  );
  const [isTyping, setIsTyping] = useState(false);
  const [userIsScrolling, setUserIsScrolling] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom effect
  // useEffect(() => {
  //   if (!userIsScrolling && messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages, userIsScrolling]);

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

  return (
    <div
      className={`size-full bg-black flex flex-col ${
        !showMobileConversation ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Chat header */}
      <ChatHeader />

      {/* Neural link status */}
      {neuralLinkActive && (
        <div className="px-4 py-2 bg-cyan-950/20 border-b border-cyan-900 flex items-center justify-between">
          <div className="flex items-center">
            <NeuralIndicator strength={neuralLinkStrength} />
            <span className="text-xs text-cyan-400 ml-2 font-mono">
              NEURAL_LINK: {Math.round(neuralLinkStrength * 100)}% STRENGTH
            </span>
          </div>
          <div className="flex items-center">
            {getActiveConversationData()?.user.isEncrypted && (
              <Badge
                variant="outline"
                className="bg-black/50 border-fuchsia-500 text-fuchsia-400 text-xs flex items-center"
              >
                <Lock className="h-3 w-3 mr-1" />
                ENCRYPTED
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Messages area */}
      <div
        className="flex-1 p-4 overflow-y-auto flex flex-col"
        style={{ minHeight: 0 }}
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          const isAtBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight < 150;
          setUserIsScrolling(!isAtBottom);
        }}
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              neuralLinkActive={neuralLinkActive}
              neuralLinkStrength={neuralLinkStrength}
            />
          ))}
          {isTyping && (
            <div className="flex items-start space-x-2 max-w-[80%]">
              <Avatar className="h-8 w-8 border border-cyan-900">
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
              <div className="bg-cyan-950/30 border border-cyan-900 rounded-sm px-3 py-2 text-white">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse delay-150"></div>
                  <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <ChatInput />
    </div>
  );
}

// Mock data for active conversation messages
const ACTIVE_CONVERSATION_MESSAGES: MockMessage[] = [
  {
    id: 1,
    sender: "other",
    text: "Hey, did you see the new neural implant upgrade?",
    time: "10:30",
    status: "read",
    type: "text",
  },
  {
    id: 2,
    sender: "other",
    text: "It's supposed to increase bandwidth by 200%",
    time: "10:31",
    status: "read",
    type: "text",
  },
  {
    id: 3,
    sender: "self",
    text: "Yeah, I heard about it. But I'm skeptical about the security implications.",
    time: "10:35",
    status: "read",
    type: "text",
  },
  {
    id: 4,
    sender: "other",
    text: "I've already installed it. The neural feedback is incredible.",
    time: "10:36",
    status: "read",
    type: "text",
  },
  {
    id: 5,
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
    id: 6,
    sender: "self",
    text: "Whoa, I felt that through the link. That's intense!",
    time: "10:38",
    status: "read",
    type: "text",
  },
  {
    id: 7,
    sender: "other",
    text: "Check out this AR model of the implant",
    time: "10:40",
    status: "read",
    type: "text",
  },
  {
    id: 8,
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
    id: 9,
    sender: "self",
    text: "That looks advanced. Where did you get it installed?",
    time: "10:42",
    status: "delivered",
    type: "text",
  },
];
