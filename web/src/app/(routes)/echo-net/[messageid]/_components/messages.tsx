import { ChatMessage } from "@/components/chats/chat-message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types/chat";
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

// Extend MockMessage to ensure compatibility with ChatMessage component

export default function Messages({
  messages,
  neuralLinkActive,
}: {
  messages: Message[];
  neuralLinkActive: boolean;
}) {
  const isTyping = true;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="flex flex-col justify-end h-full space-y-4 p-4 overflow-y-auto">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            neuralLinkActive={neuralLinkActive}
          />
        ))}
        {isTyping && (
          <div className="flex items-start space-x-2 max-w-[80%] mb-2">
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
