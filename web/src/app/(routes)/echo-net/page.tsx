"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Menu,
  X,
  ChevronLeft,
  MoreVertical,
  Send,
  Paperclip,
  Zap,
  Phone,
  Video,
  User,
  Bell,
  Flame,
  Shield,
  Brain,
  Sparkles,
  MessageSquare,
  Lock,
  CuboidIcon as Cube,
} from "lucide-react";
import { GlitchText } from "@/components/feed/glitch-text";
import { NeonButton } from "@/components/feed/neon-button";
import { ConversationList } from "@/components/chats/conversation-list";
import { ChatMessage } from "@/components/chats/chat-message";
import { NeuralIndicator } from "@/components/chats/neural-indicator";

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
const ACTIVE_CONVERSATION_MESSAGES = [
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

export default function MessagesPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate typing indicator
  // useEffect(() => {
  //   if (activeConversation === 1) {
  //     const typingTimeout = setTimeout(() => {
  //       setIsTyping(true);
  //       setTimeout(() => {
  //         setIsTyping(false);
  //         // Add new message after typing
  //         const newMsg = {
  //           id: messages.length + 1,
  //           sender: "other",
  //           text: "I got it at the CyberMed clinic in NEON_DISTRICT. Dr. Nakamura is the best neural surgeon in the city.",
  //           time: new Date().toLocaleTimeString([], {
  //             hour: "2-digit",
  //             minute: "2-digit",
  //           }),
  //           status: "delivered",
  //           type: "text" as const,
  //         };
  //         setMessages([...messages, newMsg]);
  //       }, 3000);
  //     }, 5000);
  //     return () => clearTimeout(typingTimeout);
  //   }
  // }, [activeConversation, messages]);

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

    const newMsg = {
      id: messages.length + 1,
      sender: "self",
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
      type: "text" as const,
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
    <div className="min-h-screen overflow-hidden relative  text-white">
      {/* Fixed Cyberpunk background with grid lines */}

      {/* Main container */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-x-0 top-16 z-20 bg-black/95 backdrop-blur-md border-b border-cyan-900"
            >
              <nav className="flex flex-col p-4 space-y-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/feed");
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  FEED
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/explore");
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                >
                  <Flame className="h-4 w-4 mr-2" />
                  EXPLORE
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/messages");
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start bg-cyan-950/30 text-cyan-300 border-l-2 border-cyan-500"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  MESSAGES
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/notifications");
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  ALERTS
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/profile");
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                >
                  <User className="h-4 w-4 mr-2" />
                  PROFILE
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 container max-w-6xl mx-auto px-0 md:px-4 py-0 md:py-4">
          <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-96px)] md:rounded-sm overflow-hidden border border-cyan-900 relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-sm opacity-30 blur-[1px] -z-10 hidden md:block"></div>

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
            <div
              className={`w-full md:w-2/3 bg-black flex flex-col ${
                !showMobileConversation ? "hidden md:flex" : "flex"
              }`}
            >
              {activeConversation ? (
                <>
                  {/* Chat header */}
                  <div className="p-4 border-b border-cyan-900 flex items-center justify-between">
                    <div className="flex items-center">
                      {/* Back button (mobile only) */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowMobileConversation(false)}
                        className="mr-2 md:hidden h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>

                      {/* User info */}
                      <div className="flex items-center">
                        <div className="relative">
                          <Avatar className="h-10 w-10 border border-cyan-500">
                            <AvatarImage
                              src={
                                getActiveConversationData()?.user.avatar ||
                                "/placeholder.svg"
                              }
                              alt={
                                getActiveConversationData()?.user.name || "User"
                              }
                            />
                            <AvatarFallback className="bg-black text-cyan-400">
                              {getActiveConversationData()?.user.name.substring(
                                0,
                                2
                              ) || "UN"}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-black ${
                              getActiveConversationData()?.user.status ===
                              "online"
                                ? "bg-green-500"
                                : getActiveConversationData()?.user.status ===
                                  "away"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <h3 className="font-bold text-white mr-1">
                              {getActiveConversationData()?.user.name}
                            </h3>
                            {getActiveConversationData()?.user.verified && (
                              <Badge
                                variant="outline"
                                className="h-4 px-1 bg-cyan-950/50 border-cyan-500 text-cyan-400 text-[10px]"
                              >
                                <Shield className="h-2 w-2 mr-1" />
                                VERIFIED
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-xs">
                            <span className="text-cyan-400 font-mono">
                              @{getActiveConversationData()?.user.handle}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Neural Voice Call</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                            >
                              <Video className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Neural Video Call</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={toggleNeuralLink}
                              className={`h-8 w-8 rounded-sm ${
                                neuralLinkActive
                                  ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                                  : "text-gray-500 hover:text-gray-400 hover:bg-gray-900/30"
                              }`}
                            >
                              <Brain className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {neuralLinkActive
                                ? "Deactivate Neural Link"
                                : "Activate Neural Link"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-sm text-gray-400 hover:text-gray-300 hover:bg-gray-900/30"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>More Options</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Neural link status */}
                  {neuralLinkActive && (
                    <div className="px-4 py-2 bg-cyan-950/20 border-b border-cyan-900 flex items-center justify-between">
                      <div className="flex items-center">
                        <NeuralIndicator strength={neuralLinkStrength} />
                        <span className="text-xs text-cyan-400 ml-2 font-mono">
                          NEURAL_LINK: {Math.round(neuralLinkStrength * 100)}%
                          STRENGTH
                        </span>
                      </div>
                      <div className="flex items-center">
                        {getActiveConversationData()?.isEncrypted && (
                          <Badge
                            variant="outline"
                            className="bg-black/50 border-fuchsia-500 text-fuchsia-400 text-xs flex items-center"
                          >
                            <Lock className="h-3 w-3 mr-1" />
                            ENCRYPTED
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Messages area */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <ChatMessage
                          key={message.id}
                          message={message}
                          neuralLinkActive={neuralLinkActive}
                          neuralLinkStrength={neuralLinkStrength}
                        />
                      ))}
                      {isTyping && (
                        <div className="flex items-start space-x-2 max-w-[80%]">
                          <Avatar className="h-8 w-8 border border-cyan-900">
                            <AvatarImage
                              src={
                                getActiveConversationData()?.user.avatar ||
                                "/placeholder.svg"
                              }
                              alt={
                                getActiveConversationData()?.user.name || "User"
                              }
                            />
                            <AvatarFallback className="bg-black text-cyan-400">
                              {getActiveConversationData()?.user.name.substring(
                                0,
                                2
                              ) || "UN"}
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
                  </ScrollArea>

                  {/* Message input */}
                  <div className="p-4 border-t border-cyan-900">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-50 blur-[1px] -z-10"></div>
                        <Input
                          placeholder={
                            neuralLinkActive
                              ? "TRANSMIT_NEURAL_MESSAGE..."
                              : "NEURAL_LINK_INACTIVE. TEXT_ONLY_MODE."
                          }
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="bg-black border-cyan-900 text-white font-mono relative focus-visible:ring-cyan-500"
                        />
                      </div>

                      <div className="flex space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                              >
                                <Paperclip className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Attach File</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={!neuralLinkActive}
                                className="h-10 w-10 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 disabled:text-gray-700 disabled:hover:bg-transparent"
                              >
                                <Cube className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Send AR Content</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={!neuralLinkActive}
                                className="h-10 w-10 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30 disabled:text-gray-700 disabled:hover:bg-transparent"
                              >
                                <Sparkles className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Send Neural Sensation</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="h-10 rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // No active conversation selected
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
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
