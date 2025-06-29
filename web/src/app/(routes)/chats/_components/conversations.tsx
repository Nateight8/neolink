"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
// import { ConversationList } from "@/app/(routes)/echo-net/_components/list";
import { useConversationParticipants } from "@/hooks/api/use-direct-message";
import { ConversationList } from "./list";

export default function Conversations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab] = useState("all");
  // const [activeConversation] = useState<string | null>(null);

  const { data: conversations } = useConversationParticipants();

  const filteredConversations = conversations?.conversations.filter(
    (conversation) => {
      const op = conversation.otherParticipant;
      const matchesSearch =
        op?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op?.handle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.lastMessage?.content
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "unread" && conversation.unreadCount > 0) ||
        (activeTab === "mentions" &&
          conversation.lastMessage?.content.includes("@"));

      return matchesTab && matchesSearch;
    }
  );

  // Map API conversations to UI shape for ConversationList
  const mappedConversations = (filteredConversations ?? []).map(
    (conversation) => ({
      id: conversation.id,
      user: {
        name:
          conversation.otherParticipant?.username ||
          conversation.otherParticipant?.fullName ||
          conversation.otherParticipant?.handle ||
          "Unknown",
        handle: conversation.otherParticipant?.handle || "",
        avatar:
          conversation.otherParticipant?.avatarUrl ||
          "/placeholder.svg?height=50&width=50&text=U",
        status: conversation.otherParticipant?.status || "offline",
        verified: !!conversation.otherParticipant?.verified,
      },
      lastMessage: {
        text: conversation.lastMessage?.content || "",
        time: conversation.lastMessage?.createdAt || "",
        isRead: true, // TODO: You may want to adjust this logic
        isDelivered: true,
        isSent: true,
      },
      unreadCount: conversation.unreadCount,
      isPinned: false, // Adjust when you have this info
      isEncrypted: false, // Adjust when you have this info
      neuralLinkStatus: "", // Adjust when you have this info
    })
  );

  return (
    <div className="flex flex-col h-full bg-black border-r border-cyan-900 text-white">
      {/* Header */}
      <div className="p-4 md:border-b md:border-cyan-900/50">
        <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
          Echo Net
        </h1>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 bg-gray-900/50 border-cyan-900/50 focus-visible:ring-1 focus-visible:ring-cyan-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-2 ">
        <Tabs defaultValue="all" className="w-full border-b border-cyan-950">
          <ScrollArea className="w-full">
            <TabsList className="bg-transparent p-0 w-max min-w-full space-x-2">
              {["All", "Unread", "Neural", "Groups", "Channels"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className="px-3 py-1.5 text-xs data-[state=active]:border-b-cyan-400 data-[state=active]:text-cyan-400 whitespace-nowrap"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" className="h-0" />
          </ScrollArea>
        </Tabs>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto -mx-4 px-4">
        <ConversationList conversations={mappedConversations} />
      </div>
    </div>
  );
}
