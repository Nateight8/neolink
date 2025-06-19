"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck, Clock, Pin } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface Conversation {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
    status: string;
    verified: boolean;
  };
  lastMessage: {
    text: string;
    time: string;
    isRead: boolean;
    isDelivered: boolean;
    isSent: boolean;
  };
  unreadCount: number;
  isPinned: boolean;
  isEncrypted: boolean;
  neuralLinkStatus: string;
}

interface ConversationListProps {
  conversations: Conversation[];
}

export function ConversationList({ conversations }: ConversationListProps) {
  // Sort conversations: pinned first, then by unread count, then by time
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    return 0;
  });

  const router = useRouter();

  const activeConversation = usePathname().split("/").pop();

  return (
    <div className="divide-y divide-cyan-900/50 -mx-4">
      {sortedConversations.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">No conversations found</p>
        </div>
      ) : (
        sortedConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => router.push(`/echo-net/${conversation.id}`)}
            className={`p-4 hover:bg-cyan-950/20  cursor-pointer transition-colors ${
              activeConversation === conversation.id
                ? "bg-cyan-950/30 border-l border-y border-cyan-500"
                : ""
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0 px-4">
              {/* Avatar with status */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10 md:h-12 md:w-12 border border-cyan-900">
                  <AvatarImage
                    src={conversation.user.avatar || "/placeholder.svg"}
                    alt={conversation.user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-black text-cyan-400 text-xs md:text-sm">
                    {conversation.user.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-0 right-0 h-2.5 w-2.5 md:h-3 md:w-3 rounded-full border border-black ${
                    conversation.user.status === "online"
                      ? "bg-green-500"
                      : conversation.user.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                />
              </div>

              {/* Conversation details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 flex-1 min-w-0">
                    <h3
                      className={`font-medium text-sm md:text-base truncate ${
                        conversation.unreadCount > 0
                          ? "text-white"
                          : "text-gray-300"
                      }`}
                    >
                      {conversation.user.name}
                    </h3>
                    {conversation.isPinned && (
                      <Pin className="h-3 w-3 text-cyan-400 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {conversation.lastMessage.time}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-0.5">
                  <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                    {/* Message status indicator */}
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {conversation.lastMessage.isRead
                        ? "Seen"
                        : conversation.lastMessage.isDelivered
                        ? "Delivered"
                        : conversation.lastMessage.isSent
                        ? "Sent"
                        : "Sending..."}
                    </span>

                    {/* Unread indicator */}
                    {conversation.unreadCount > 0 && (
                      <span className="h-2 w-2 rounded-full bg-fuchsia-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Message status icon */}
                  <div className="flex-shrink-0 ml-2">
                    {conversation.lastMessage.isRead ? (
                      <CheckCheck className="h-3.5 w-3.5 text-cyan-400" />
                    ) : conversation.lastMessage.isDelivered ? (
                      <CheckCheck className="h-3.5 w-3.5 text-gray-400" />
                    ) : conversation.lastMessage.isSent ? (
                      <Check className="h-3.5 w-3.5 text-gray-600" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-gray-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
