"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { ConversationList } from "@/app/(routes)/echo-net/_components/list";

// Mock data for conversations
const CONVERSATIONS = [
  {
    id: " 1",
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
    id: " 3",
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
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // const [, setActiveConversation] = useState<number | null>(null);
  // const [, setShowMobileConversation] = useState(false);

  // Filter conversations based on active tab and search query
  const filteredConversations = CONVERSATIONS.filter((conversation) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pinned" && conversation.isPinned) ||
      (activeTab === "encrypted" && conversation.isEncrypted) ||
      (activeTab === "neural" && conversation.neuralLinkStatus === "active");
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
    return matchesTab && matchesSearch;
  });

  // Handle conversation selection
  // const handleSelectConversation = (id: number) => {
  //   setActiveConversation(id);
  //   setShowMobileConversation(true);
  // };
  //   showMobileConversation ? "hidden md:flex" : "flex"
  return (
    <>
      <div className="w-full h-full bg-black border-r border-cyan-900 flex flex-col">
        {/* Search and tabs */}
        <div className="p-4 border-b border-cyan-900">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
            <Input
              placeholder="SEARCH_CONVERSATIONS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-black border-cyan-900 text-white font-mono"
            />
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-4 rounded-sm bg-black border border-cyan-900">
              <TabsTrigger
                value="all"
                className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-300 px-4"
              >
                ALL
              </TabsTrigger>
              <TabsTrigger
                value="pinned"
                className="rounded-none data-[state=active]:bg-fuchsia-950 data-[state=active]:text-fuchsia-300 px-4"
              >
                PINNED
              </TabsTrigger>
              <TabsTrigger
                value="encrypted"
                className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-300 px-4"
              >
                ENCRYPTED
              </TabsTrigger>
              <TabsTrigger
                value="neural"
                className="rounded-none data-[state=active]:bg-fuchsia-950 data-[state=active]:text-fuchsia-300 px-4"
              >
                NEURAL
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="pr-4">
              <ConversationList 
                conversations={filteredConversations} 
                activeConversation={null}
                onSelectConversation={() => {}}
              />
              {/* Add some bottom padding to ensure last item is not cut off */}
              <div className="h-4" />
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
