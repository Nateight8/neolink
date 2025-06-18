"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { ConversationList } from "@/app/(routes)/echo-net/_components/list";

// Mock data for conversations
const CONVERSATIONS = [
  {
    id: "1",
    user: {
      name: "CYBER_NOMAD",
      handle: "cyber_nomad",
      avatar: "/placeholder.svg?height=50&width=50&text=CN",
      status: "online",
      verified: true,
    },
    lastMessage: {
      text: "Did you see the new neural implant upgrade?",
      time: "10:42",
      isRead: true,
      isDelivered: true,
      isSent: true,
    },
    unreadCount: 0,
    isPinned: true,
    isEncrypted: true,
    neuralLinkStatus: "active",
  },
  {
    id: "2",
    user: {
      name: "NEON_HUNTER",
      handle: "neon_hunter",
      avatar: "/placeholder.svg?height=50&width=50&text=NH",
      status: "online",
      verified: true,
    },
    lastMessage: {
      text: "Check out this AR experience I created",
      time: "09:15",
      isRead: false,
      isDelivered: true,
      isSent: true,
    },
    unreadCount: 3,
    isPinned: false,
    isEncrypted: true,
    neuralLinkStatus: "active",
  },
  {
    id: "3",
    user: {
      name: "GHOST_WIRE",
      handle: "ghost_wire",
      avatar: "/placeholder.svg?height=50&width=50&text=GW",
      status: "offline",
      verified: false,
    },
    lastMessage: {
      text: "The corporations are tracking our neural data",
      time: "YESTERDAY",
      isRead: true,
      isDelivered: true,
      isSent: true,
    },
    unreadCount: 0,
    isPinned: false,
    isEncrypted: true,
    neuralLinkStatus: "inactive",
  },
  {
    id: "4",
    user: {
      name: "DATA_WRAITH",
      handle: "data_wraith",
      avatar: "/placeholder.svg?height=50&width=50&text=DW",
      status: "away",
      verified: true,
    },
    lastMessage: {
      text: "I've encrypted our neural link. We can speak freely now.",
      time: "YESTERDAY",
      isRead: true,
      isDelivered: true,
      isSent: true,
    },
    unreadCount: 0,
    isPinned: false,
    isEncrypted: true,
    neuralLinkStatus: "secure",
  },
  {
    id: "5",
    user: {
      name: "PIXEL_PUNK",
      handle: "pixel_punk",
      avatar: "/placeholder.svg?height=50&width=50&text=PP",
      status: "online",
      verified: true,
    },
    lastMessage: {
      text: "Meet me in the AR space at NEON_DISTRICT",
      time: "MONDAY",
      isRead: true,
      isDelivered: true,
      isSent: true,
    },
    unreadCount: 0,
    isPinned: false,
    isEncrypted: false,
    neuralLinkStatus: "active",
  },
  {
    id: "6",
    user: {
      name: "VOID_RUNNER",
      handle: "void_runner",
      avatar: "/placeholder.svg?height=50&width=50&text=VR",
      status: "offline",
      verified: false,
    },
    lastMessage: {
      text: "The digital frontier is expanding. We need to move quickly.",
      time: "LAST WEEK",
      isRead: true,
      isDelivered: true,
      isSent: true,
    },
    unreadCount: 0,
    isPinned: false,
    isEncrypted: true,
    neuralLinkStatus: "inactive",
  },
  {
    id: "7",
    user: {
      name: "CHROME_REBEL",
      handle: "chrome_rebel",
      avatar: "/placeholder.svg?height=50&width=50&text=CR",
      status: "online",
      verified: true,
    },
    lastMessage: {
      text: "I've uploaded the schematics to your neural storage",
      time: "LAST WEEK",
      isRead: true,
      isDelivered: true,
      isSent: true,
    },
    unreadCount: 0,
    isPinned: false,
    isEncrypted: true,
    neuralLinkStatus: "active",
  },
  {
    id: "9",
    user: {
      name: "CHROME_REBEL",
      handle: "chrome_rebel",
      avatar: "/placeholder.svg?height=50&width=50&text=CR",
      status: "online",
      verified: true,
    },
    lastMessage: {
      text: "I've uploaded the schematics to your neural storage",
      time: "LAST WEEK",
      isRead: true,
      isDelivered: true,
      isSent: true,
    },
    unreadCount: 0,
    isPinned: false,
    isEncrypted: true,
    neuralLinkStatus: "active",
  },
  {
    id: "10",
    user: {
      name: "CHROME_REBEL",
      handle: "chrome_rebel",
      avatar: "/placeholder.svg?height=50&width=50&text=CR",
      status: "online",
      verified: true,
    },
    lastMessage: {
      text: "I've uploaded the schematics to your neural storage",
      time: "LAST WEEK",
      isRead: true,
      isDelivered: true,
      isSent: true,
    },
    unreadCount: 0,
    isPinned: false,
    isEncrypted: true,
    neuralLinkStatus: "active",
  },
];

export default function Conversations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab] = useState("all");
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );

  const filteredConversations = CONVERSATIONS.filter((conversation) => {
    const matchesSearch =
      conversation.user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.user.handle
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.text
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && conversation.unreadCount > 0) ||
      (activeTab === "mentions" && conversation.lastMessage.text.includes("@"));

    return matchesTab && matchesSearch;
  });

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="p-4 md:border-b md:border-cyan-900/50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
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
      <div className="px-4 pb-2">
        <Tabs defaultValue="all" className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="bg-transparent p-0 w-max min-w-full space-x-2">
              {["All", "Unread", "Neural", "Groups", "Channels"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className="px-3 py-1.5 text-xs rounded-full data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-400 whitespace-nowrap"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" className="h-1" />
          </ScrollArea>
        </Tabs>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto -mx-4 px-4">
        <ConversationList
          conversations={filteredConversations}
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
        />
      </div>
    </div>
  );
}
