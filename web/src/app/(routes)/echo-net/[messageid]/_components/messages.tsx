import { ChatMessage } from "@/components/chats/chat-message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types/chat";
import { UserMeta } from "@/hooks/api/use-direct-message";
import { useEffect, useRef } from "react";

export default function Messages({
  messages,
  neuralLinkActive,
  isOpponentTyping,
  otherParticipant,
}: {
  messages: Message[];
  neuralLinkActive: boolean;
  isOpponentTyping: boolean;
  otherParticipant: UserMeta | null | undefined;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpponentTyping]);

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
        {isOpponentTyping && (
          <div className="flex items-start space-x-2 max-w-[80%] mb-2">
            <Avatar className="h-8 w-8 border border-cyan-900">
              <AvatarImage
                src={otherParticipant?.avatarUrl || "/placeholder.svg"}
                alt={otherParticipant?.fullName || "User"}
              />
              <AvatarFallback className="bg-black text-cyan-400">
                {otherParticipant?.fullName?.substring(0, 2) || "UN"}
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
