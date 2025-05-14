"use client";

import type { MockMessage } from "@/types/chat";

import { Button } from "@/components/ui/button";

import { MessageSquare } from "lucide-react";

// Mock data for conversations
const CONVERSATIONS = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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

export default function MessagesPage() {
  return (
    <div className="h-screen overflow-hidden relative bg-black md:py-0">
      {/* Fixed Cyberpunk background with grid lines */}

      {/* Main container */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Main content */}
        <main className="flex-1 container max-w-6xl  mx-auto px-0 md:px-4 py-0 md:py-4">
          <div className="flex md:justify-center md:items-center w-full h-[calc(100vh-64px)] md:h-[calc(100vh-96px)] md:rounded-sm overflow-hidden border border-cyan-900 relative">
            {/* <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-30 blur-[1px] -z-10 hidden md:block"></div> */}

            {/* Conversation list - hidden on mobile when conversation is active */}
            {/* <div
              className={`w-full md:w-1/3 bg-black border-r border-cyan-900 flex flex-col ${
                showMobileConversation ? "hidden md:flex" : "flex"
              }`}
            > */}
            {/* Search and filter */}
            {/* <div className="p-4 border-b border-cyan-900 space-y-4">
                <div className="relative">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px] -z-10"></div>
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-cyan-500" />
                    <Input
                      placeholder="SEARCH_NEURAL_CONNECTIONS"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-black border-cyan-900 text-white font-mono pl-10 relative focus-visible:ring-cyan-500"
                    />
                  </div>
                </div>

                <Tabs
                  defaultValue="all"
                  className="w-full"
                  onValueChange={setActiveTab}
                >
                  <TabsList className="w-full grid grid-cols-3 rounded-sm bg-black border border-cyan-900">
                    <TabsTrigger
                      value="all"
                      className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-300"
                    >
                      ALL
                    </TabsTrigger>
                    <TabsTrigger
                      value="unread"
                      className="rounded-none data-[state=active]:bg-fuchsia-950 data-[state=active]:text-fuchsia-300"
                    >
                      UNREAD
                    </TabsTrigger>
                    <TabsTrigger
                      value="neural"
                      className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-300"
                    >
                      NEURAL
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Conversation list */}
            {/* <ScrollArea className="flex-1">
                <ConversationList
                  conversations={filteredConversations}
                  activeConversationId={activeConversation}
                  onSelectConversation={handleSelectConversation}
                />
              </ScrollArea> */}
            {/* </div> */}

            {/* Chat area - shown on mobile only when conversation is active */}

            <div className="w-full">
              <div className="w-full">
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-950/30 border border-cyan-500 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    NO ACTIVE NEURAL CONNECTION
                  </h3>
                  <p className="text-gray-400 max-w-md mb-6">
                    Select a conversation from the list to establish a neural
                    link or start a new connection.
                  </p>
                  <Button className="rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                    NEW_NEURAL_CONNECTION
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
