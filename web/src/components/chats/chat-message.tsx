"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck, Clock } from "lucide-react";

import { getCompactRelativeTime } from "@/lib/relative-time";
import { useAuth } from "@/contexts/auth-context";
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
  neuralLinkActive: boolean;
}

export function ChatMessage({ message, neuralLinkActive }: ChatMessageProps) {
  // Get status icon

  const messageStatus = message.readBy.find(
    (readBy) => readBy.userId === message.senderId
  );

  const getStatusIcon = () => {
    switch (messageStatus?.readAt) {
      case "read":
        return <CheckCheck className="h-3 w-3 text-cyan-400" />;
      case "delivered":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "sent":
        return <Clock className="h-3 w-3 text-gray-600" />;
      default:
        return null;
    }
  };

  console.log("MESSAGES FROM HERE:", message);

  const { user } = useAuth();
  const messageSender = user?.participantId === message.sender?.participantId;

  // Neural message effect based on link strength

  return (
    <div
      className={`flex items-start space-x-2 max-w-[80%] ${
        messageSender ? "ml-auto flex-row-reverse space-x-reverse" : ""
      }`}
    >
      {!messageSender && (
        <Avatar className="h-8 w-8 border border-cyan-900">
          <AvatarImage
            src="/placeholder.svg?height=50&width=50&text=CN"
            alt="User"
          />
          <AvatarFallback className="bg-black uppercase text-base text-cyan-400">
            {message.sender?.fullName.substring(0, 2) || "UN"}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`relative group ${
          messageSender
            ? "bg-fuchsia-950/30 border border-fuchsia-900"
            : "bg-cyan-950/30 border border-cyan-900"
        } rounded-sm px-3 py-2 text-white`}
      >
        <p
          className={`${
            !neuralLinkActive && !messageSender ? "opacity-80" : ""
          }`}
        >
          {message.content}
          {/* where we render message content  */}
        </p>
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="text-xs text-gray-500">
            {getCompactRelativeTime(message.createdAt)}
          </span>
          {messageSender && getStatusIcon()}
        </div>
      </div>
    </div>
  );
}
