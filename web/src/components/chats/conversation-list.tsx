"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCheck, Clock, Pin, Lock, Brain } from "lucide-react";

interface Conversation {
  id: number;
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
  activeConversation: number | null;
  onSelectConversation: (id: number) => void;
}

export function ConversationList({
  conversations,
  activeConversation,
  onSelectConversation,
}: ConversationListProps) {
  // Sort conversations: pinned first, then by unread count, then by time (assuming time is in descending order)
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    return 0;
  });

  return (
    <div className="divide-y divide-cyan-900/50">
      {sortedConversations.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">No conversations found</p>
        </div>
      ) : (
        sortedConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`p-4 hover:bg-cyan-950/20 cursor-pointer transition-colors ${
              activeConversation === conversation.id
                ? "bg-cyan-950/30 border-l-2 border-cyan-500"
                : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar with status */}
              <div className="relative">
                <Avatar className="h-12 w-12 border border-cyan-900">
                  <AvatarImage
                    src={conversation.user.avatar || "/placeholder.svg"}
                    alt={conversation.user.name}
                  />
                  <AvatarFallback className="bg-black text-cyan-400">
                    {conversation.user.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-black ${
                    conversation.user.status === "online"
                      ? "bg-green-500"
                      : conversation.user.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                ></div>
              </div>

              {/* Conversation details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 max-w-[70%]">
                    <h3
                      className={`font-bold truncate ${
                        conversation.unreadCount > 0
                          ? "text-white"
                          : "text-gray-300"
                      }`}
                    >
                      {conversation.user.name}
                    </h3>
                    {conversation.isPinned && (
                      <Pin className="h-3 w-3 text-cyan-400" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {conversation.lastMessage.time}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p
                    className={`text-sm truncate max-w-[80%] ${
                      conversation.unreadCount > 0
                        ? "text-cyan-400 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {conversation.lastMessage.text}
                  </p>

                  <div className="flex items-center space-x-1">
                    {/* Message status */}
                    {conversation.lastMessage.isRead ? (
                      <CheckCheck className="h-3 w-3 text-cyan-400" />
                    ) : conversation.lastMessage.isDelivered ? (
                      <Check className="h-3 w-3 text-gray-400" />
                    ) : conversation.lastMessage.isSent ? (
                      <Check className="h-3 w-3 text-gray-600" />
                    ) : (
                      <Clock className="h-3 w-3 text-gray-600" />
                    )}

                    {/* Unread count */}
                    {conversation.unreadCount > 0 && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-fuchsia-600 text-white text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Neural link and encryption indicators */}
                <div className="flex items-center space-x-2 mt-1">
                  {conversation.neuralLinkStatus !== "inactive" && (
                    <Badge
                      variant="outline"
                      className={`px-1 py-0 text-[10px] flex items-center ${
                        conversation.neuralLinkStatus === "active"
                          ? "border-cyan-500 text-cyan-400"
                          : conversation.neuralLinkStatus === "secure"
                          ? "border-green-500 text-green-400"
                          : "border-gray-500 text-gray-400"
                      }`}
                    >
                      <Brain className="h-2 w-2 mr-1" />
                      NEURAL
                    </Badge>
                  )}

                  {conversation.isEncrypted && (
                    <Badge
                      variant="outline"
                      className="px-1 py-0 border-fuchsia-500 text-fuchsia-400 text-[10px] flex items-center"
                    >
                      <Lock className="h-2 w-2 mr-1" />
                      ENCRYPTED
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
