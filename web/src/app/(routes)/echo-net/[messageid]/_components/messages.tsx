import { ChatMessage } from "@/components/chats/chat-message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef } from "react";

interface MockUser {
  name: string;
  status: "online" | "away" | "offline";
  verified: boolean;
  handle: string;
  avatar: string;
}

const mockUser: MockUser = {
  name: "James Bonds",
  status: "online",
  verified: true,
  handle: "james",
  avatar: "",
};

import type { MockMessage } from "@/types/chat";

// Extend MockMessage to ensure compatibility with ChatMessage component
interface Message extends Omit<MockMessage, 'id' | 'status' | 'type' | 'sender' | 'neuralData'> {
  id: string;  // Override id to be string instead of number
  status: string;  // Make status more flexible
  type: string;    // Make type more flexible
  sender: 'other' | 'self' | string;  // Allow any string but keep type safety for 'other' | 'self'
  timestamp?: string;  // Add optional timestamp
  content?: string;    // Add content as an alternative to text
  neuralData?: {
    type: 'data' | 'sync' | 'sensation' | string;  // Allow any string but keep type safety for the known types
    intensity: number;
    description: string;
  };
}

export default function Messages({
  messages,
  neuralLinkActive,
  neuralLinkStrength,
}: {
  messages: Message[];
  neuralLinkActive: boolean;
  neuralLinkStrength: number;
}) {
  const isTyping = true;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to safely convert Message to MockMessage
  const toMockMessage = (msg: Message): MockMessage => {
    // Create base message with required fields
    const baseMessage = {
      id: Number(msg.id) || 0, // Convert string ID to number, default to 0 if conversion fails
      text: msg.text || msg.content || '', // Use content as fallback for text
      time: msg.time,
      status: (['read', 'delivered', 'sent'].includes(msg.status) 
        ? msg.status 
        : 'sent') as 'read' | 'delivered' | 'sent',
      type: (['text', 'neural', 'ar'].includes(msg.type)
        ? msg.type
        : 'text') as 'text' | 'neural' | 'ar',
      sender: (msg.sender === 'self' || msg.sender === 'other' 
        ? msg.sender 
        : 'other') as 'self' | 'other',
    };

    // Add neuralData if it exists and has the correct type
    const neuralData = msg.neuralData ? {
      type: (['data', 'sync', 'sensation'].includes(msg.neuralData.type)
        ? msg.neuralData.type 
        : 'data') as 'data' | 'sync' | 'sensation',
      intensity: msg.neuralData.intensity,
      description: msg.neuralData.description,
    } : undefined;

    // Add arData if it exists
    const arData = msg.arData ? {
      preview: msg.arData.preview,
      model: msg.arData.model,
      description: msg.arData.description,
    } : undefined;

    // Combine all properties
    return {
      ...baseMessage,
      ...(neuralData && { neuralData }),
      ...(arData && { arData }),
    } as MockMessage;
  };

  return (
    <>
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={toMockMessage(message)}
            neuralLinkActive={neuralLinkActive}
            neuralLinkStrength={neuralLinkStrength}
          />
        ))}
        {isTyping && (
          <div className="flex items-start space-x-2 max-w-[80%]">
            <Avatar className="h-8 w-8 border border-cyan-900">
              <AvatarImage
                src={mockUser.avatar || "/placeholder.svg"}
                alt={mockUser.name || "User"}
              />
              <AvatarFallback className="bg-black text-cyan-400">
                {mockUser.name.substring(0, 2) || "UN"}
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
    </>
  );
}
