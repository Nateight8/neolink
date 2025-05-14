"use client";

import { useState, useRef, useEffect, PropsWithChildren } from "react";
import type { MockMessage } from "@/types/chat";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Search, MessageSquare } from "lucide-react";
// import { GlitchText } from "@/components/feed/glitch-text";
// import { NeonButton } from "@/components/feed/neon-button";
import { ConversationList } from "@/components/chats/conversation-list";

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

// Mock data for active conversation messages
const ACTIVE_CONVERSATION_MESSAGES: MockMessage[] = [
  {
    id: 1,
    sender: "other",
    text: "Hey, did you see the new neural implant upgrade?",
    time: "10:30",
    status: "read",
    type: "text",
  },
  {
    id: 2,
    sender: "other",
    text: "It's supposed to increase bandwidth by 200%",
    time: "10:31",
    status: "read",
    type: "text",
  },
  {
    id: 3,
    sender: "self",
    text: "Yeah, I heard about it. But I'm skeptical about the security implications.",
    time: "10:35",
    status: "read",
    type: "text",
  },
  {
    id: 4,
    sender: "other",
    text: "I've already installed it. The neural feedback is incredible.",
    time: "10:36",
    status: "read",
    type: "text",
  },
  {
    id: 5,
    sender: "other",
    type: "neural",
    neuralData: {
      type: "sensation",
      intensity: 0.7,
      description: "Neural sensation: Increased processing speed",
    },
    time: "10:37",
    status: "read",
  },
  {
    id: 6,
    sender: "self",
    text: "Whoa, I felt that through the link. That's intense!",
    time: "10:38",
    status: "read",
    type: "text",
  },
  {
    id: 7,
    sender: "other",
    text: "Check out this AR model of the implant",
    time: "10:40",
    status: "read",
    type: "text",
  },
  {
    id: 8,
    sender: "other",
    type: "ar",
    arData: {
      preview: "/placeholder.svg?height=300&width=400&text=NEURAL_IMPLANT_AR",
      model: "/ar-models/implant.glb",
      description: "Neural Implant X-7500",
    },
    time: "10:41",
    status: "read",
  },
  {
    id: 9,
    sender: "self",
    text: "That looks advanced. Where did you get it installed?",
    time: "10:42",
    status: "delivered",
    type: "text",
  },
];

export default function Layout({ children }: PropsWithChildren) {
  // const router = useRouter();
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState<number | null>(
    1
  );
  const [messages, setMessages] = useState(ACTIVE_CONVERSATION_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [neuralLinkActive, setNeuralLinkActive] = useState(true);
  const [neuralLinkStrength, setNeuralLinkStrength] = useState(0.85);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userIsScrolling, setUserIsScrolling] = useState(false);

  // Filter conversations based on search and active tab
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      searchQuery === "" ||
      conversation.user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.user.handle
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.text
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unread")
      return matchesSearch && conversation.unreadCount > 0;
    if (activeTab === "neural")
      return matchesSearch && conversation.neuralLinkStatus === "active";
    return matchesSearch;
  });

  // Get active conversation data
  const getActiveConversationData = () => {
    return conversations.find((conv) => conv.id === activeConversation) || null;
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (!messagesEndRef.current) return;

    // Auto-scroll in these cases:
    // 1. User sends a new message (last message is from self)
    // 2. User is already at the bottom (not scrolling up)
    const lastMessage = messages[messages.length - 1];
    const shouldAutoScroll =
      !userIsScrolling || (lastMessage && lastMessage.sender === "self");

    if (shouldAutoScroll) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, userIsScrolling]);

  // Simulate typing indicator
  useEffect(() => {
    if (activeConversation === 1) {
      const typingTimeout = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          // Add new message after typing
          const newMsg: MockMessage = {
            id: messages.length + 1,
            sender: "other",
            text: "I got it at the CyberMed clinic in NEON_DISTRICT. Dr. Nakamura is the best neural surgeon in the city.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "delivered",
            type: "text",
          };
          setMessages([...messages, newMsg]);
        }, 3000);
      }, 5000);
      return () => clearTimeout(typingTimeout);
    }
  }, [activeConversation, messages]);

  // Simulate neural link fluctuations
  useEffect(() => {
    const neuralInterval = setInterval(() => {
      setNeuralLinkStrength(0.7 + Math.random() * 0.3);
    }, 5000);
    return () => clearInterval(neuralInterval);
  }, []);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: MockMessage = {
      id: messages.length + 1,
      sender: "self",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
      type: "text",
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Update last message in conversation list
    setConversations(
      conversations.map((conv) => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            lastMessage: {
              text: newMessage,
              time: "NOW",
              isRead: false,
              isDelivered: false,
              isSent: true,
            },
          };
        }
        return conv;
      })
    );

    // Simulate message status updates
    setTimeout(() => {
      setMessages((msgs) =>
        msgs.map((msg) => {
          if (msg.id === newMsg.id) {
            return { ...msg, status: "delivered" };
          }
          return msg;
        })
      );

      setConversations((convs) =>
        convs.map((conv) => {
          if (conv.id === activeConversation) {
            return {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                isDelivered: true,
              },
            };
          }
          return conv;
        })
      );
    }, 1000);

    setTimeout(() => {
      setMessages((msgs) =>
        msgs.map((msg) => {
          if (msg.id === newMsg.id) {
            return { ...msg, status: "read" };
          }
          return msg;
        })
      );

      setConversations((convs) =>
        convs.map((conv) => {
          if (conv.id === activeConversation) {
            return {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                isRead: true,
              },
            };
          }
          return conv;
        })
      );
    }, 2000);
  };

  // Handle selecting a conversation
  const handleSelectConversation = (id: number) => {
    setActiveConversation(id);
    setShowMobileConversation(true);

    // Mark conversation as read
    setConversations(
      conversations.map((conv) => {
        if (conv.id === id) {
          return {
            ...conv,
            unreadCount: 0,
            lastMessage: {
              ...conv.lastMessage,
              isRead: true,
            },
          };
        }
        return conv;
      })
    );
  };

  // Toggle neural link
  const toggleNeuralLink = () => {
    setNeuralLinkActive(!neuralLinkActive);
  };

  return (
    <div className="h-screen overflow-hidden relative bg-black text-white md:py-10">
      {/* Fixed Cyberpunk background with grid lines */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Main content */}
        <main className="flex-1 container max-w-6xl mx-auto px-0 md:px-4 py-0 md:py-4">
          <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-96px)] md:rounded-sm overflow-hidden border border-cyan-900 relative">
            {/* <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-30 blur-[1px] -z-10 hidden md:block"></div> */}

            {/* Conversation list - hidden on mobile when conversation is active */}
            <div
              className={`w-full md:w-1/3 bg-black border-r border-cyan-900 flex flex-col ${
                showMobileConversation ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Search and filter */}
              <div className="p-4 border-b border-cyan-900 space-y-4">
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
              <ScrollArea className="flex-1">
                <ConversationList
                  conversations={filteredConversations}
                  activeConversationId={activeConversation}
                  onSelectConversation={handleSelectConversation}
                />
              </ScrollArea>
            </div>

            {/* Chat area - shown on mobile only when conversation is active */}

            <div className=" size-full">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
