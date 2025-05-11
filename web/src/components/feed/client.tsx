"use client";

import { useState, useEffect, useRef } from "react";
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
  Zap,
  Flame,
  Sparkles,
  Plus,
  Bell,
  User,
  Menu,
  X,
  ChevronUp,
  Cpu,
  Radio,
  Shield,
  Skull,
  Siren,
  Bomb,
  WormIcon as Virus,
  CuboidIcon as Cube,
} from "lucide-react";
import { FeedPost } from "./feed-post";
import { ARPost } from "./ar-post";
import { StoryCircle } from "./story-circle";
import { GlitchText } from "./glitch-text";
import { HackerNews } from "./hacker-news";
import { NeonButton } from "./neon-button";
import { CyberPanel } from "./cyber-pannel";

// Mock data for stories
const STORIES = [
  {
    id: 1,
    username: "CYBER_NOMAD",
    avatar: "/placeholder.svg?height=50&width=50&text=CN",
    viewed: false,
  },
  {
    id: 2,
    username: "NEON_HUNTER",
    avatar: "/placeholder.svg?height=50&width=50&text=NH",
    viewed: false,
  },
  {
    id: 3,
    username: "GHOST_WIRE",
    avatar: "/placeholder.svg?height=50&width=50&text=GW",
    viewed: true,
  },
  {
    id: 4,
    username: "DATA_WRAITH",
    avatar: "/placeholder.svg?height=50&width=50&text=DW",
    viewed: false,
  },
  {
    id: 5,
    username: "PIXEL_PUNK",
    avatar: "/placeholder.svg?height=50&width=50&text=PP",
    viewed: true,
  },
  {
    id: 6,
    username: "VOID_RUNNER",
    avatar: "/placeholder.svg?height=50&width=50&text=VR",
    viewed: false,
  },
  {
    id: 7,
    username: "CHROME_REBEL",
    avatar: "/placeholder.svg?height=50&width=50&text=CR",
    viewed: false,
  },
];

// Mock data for trending topics
const TRENDING = [
  {
    id: 1,
    tag: "NEURAL_LINK",
    count: "24.5K",
    icon: <Cpu className="h-3 w-3" />,
  },
  {
    id: 2,
    tag: "CYBER_RIOT",
    count: "18.2K",
    icon: <Siren className="h-3 w-3" />,
  },
  {
    id: 3,
    tag: "NEON_DISTRICT",
    count: "12.7K",
    icon: <Radio className="h-3 w-3" />,
  },
  {
    id: 4,
    tag: "DATA_BREACH",
    count: "9.3K",
    icon: <Shield className="h-3 w-3" />,
  },
  {
    id: 5,
    tag: "GHOST_PROTOCOL",
    count: "7.1K",
    icon: <Skull className="h-3 w-3" />,
  },
];

// Mock data for posts
const POSTS = [
  {
    id: 1,
    user: {
      name: "CYBER_NOMAD",
      handle: "cyber_nomad",
      avatar: "/placeholder.svg?height=50&width=50&text=CN",
      verified: true,
    },
    content:
      "Just hacked into the mainframe. The firewall was pathetic. #CYBER_RIOT #NEURAL_LINK",
    image: "/placeholder.svg?height=400&width=600&text=CYBER_HACK_IMAGE",
    timestamp: "2 HOURS AGO",
    likes: 423,
    comments: 89,
    shares: 112,
    isLiked: false,
    isBookmarked: false,
    isReshared: false,
  },
  {
    id: 2,
    type: "ar",
    user: {
      name: "NEON_HUNTER",
      handle: "neon_hunter",
      avatar: "/placeholder.svg?height=50&width=50&text=NH",
      verified: true,
    },
    content:
      "Check out my new AR hologram design. You can interact with all 3 neural layers! #AR_DESIGN #HOLOGRAM",
    arImage:
      "/placeholder.svg?height=400&width=600&text=HOLOGRAM_AR_EXPERIENCE",
    arModel: "/ar-models/hologram.glb",
    arType: "hologram",
    arRating: 4.8,
    timestamp: "3 HOURS AGO",
    likes: 1287,
    comments: 342,
    shares: 567,
    isLiked: true,
    isBookmarked: true,
    isReshared: false,
    arTags: ["AR_DESIGN", "HOLOGRAM", "NEURAL_INTERFACE", "CYBER_ART"],
  },
  {
    id: 3,
    user: {
      name: "DATA_WRAITH",
      handle: "data_wraith",
      avatar: "/placeholder.svg?height=50&width=50&text=DW",
      verified: true,
    },
    content:
      "The corporations are tracking your neural implants. I've developed a new encryption algorithm to protect your thoughts. Download link in bio. #DATA_BREACH",
    image: null,
    timestamp: "YESTERDAY",
    likes: 3456,
    comments: 789,
    shares: 1234,
    isLiked: false,
    isBookmarked: false,
    isReshared: true,
  },
  {
    id: 4,
    type: "ar",
    user: {
      name: "VOID_RUNNER",
      handle: "void_runner",
      avatar: "/placeholder.svg?height=50&width=50&text=VR",
      verified: false,
    },
    content:
      "Mapped the entire NEON_DISTRICT in AR. Overlay this on your neural implant to find hidden spots and avoid corporate security. #AR_MAP #NEON_DISTRICT",
    arImage: "/placeholder.svg?height=400&width=600&text=NEON_DISTRICT_AR_MAP",
    arModel: "/ar-models/map.glb",
    arType: "overlay",
    arRating: 4.2,
    timestamp: "1 DAY AGO",
    likes: 892,
    comments: 156,
    shares: 423,
    isLiked: false,
    isBookmarked: false,
    isReshared: false,
    arTags: ["AR_MAP", "NEON_DISTRICT", "SECURITY_BYPASS", "HIDDEN_PATHS"],
  },
  {
    id: 5,
    user: {
      name: "CHROME_REBEL",
      handle: "chrome_rebel",
      avatar: "/placeholder.svg?height=50&width=50&text=CR",
      verified: true,
    },
    content:
      "Just upgraded my cybernetic enhancements. Vision is now 200% and I can see in the dark. The neon lights of NEON_DISTRICT never looked so good. #NEURAL_LINK",
    image: "/placeholder.svg?height=400&width=600&text=CYBERNETIC_VISION",
    timestamp: "2 DAYS AGO",
    likes: 7890,
    comments: 1234,
    shares: 567,
    isLiked: false,
    isBookmarked: true,
    isReshared: false,
  },
  {
    id: 6,
    type: "ar",
    user: {
      name: "PIXEL_PUNK",
      handle: "pixel_punk",
      avatar: "/placeholder.svg?height=50&width=50&text=PP",
      verified: true,
    },
    content:
      "Created a full immersive AR environment. Step into my digital dreamscape. Warning: May cause neural overload in outdated implants. #FULLSPACE_AR #DIGITAL_DREAMS",
    arImage:
      "/placeholder.svg?height=400&width=600&text=IMMERSIVE_AR_DREAMSCAPE",
    arModel: "/ar-models/dreamscape.glb",
    arType: "fullspace",
    arRating: 5.0,
    timestamp: "3 DAYS AGO",
    likes: 9876,
    comments: 2345,
    shares: 4567,
    isLiked: true,
    isBookmarked: true,
    isReshared: true,
    arTags: ["FULLSPACE_AR", "DIGITAL_DREAMS", "NEURAL_ART", "IMMERSIVE"],
  },
];

export default function FeedPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("for-you");
  const [posts, setPosts] = useState(POSTS);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [isARPostEnabled, setIsARPostEnabled] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (feedRef.current) {
        setShowScrollTop(feedRef.current.scrollTop > 500);
      }
    };

    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener("scroll", handleScroll);
      return () => feedElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Trigger random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 10000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Handle like action
  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  // Handle bookmark action
  const handleBookmark = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isBookmarked: !post.isBookmarked,
          };
        }
        return post;
      })
    );
  };

  // Handle reshare action
  const handleReshare = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isReshared: !post.isReshared,
            shares: post.isReshared ? post.shares - 1 : post.shares + 1,
          };
        }
        return post;
      })
    );
  };

  // Handle scroll to top
  const scrollToTop = () => {
    if (feedRef.current) {
      feedRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Toggle AR post creation
  const toggleARPost = () => {
    setIsARPostEnabled(!isARPostEnabled);
  };

  // Handle new post submission
  const handleNewPost = () => {
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      user: {
        name: "JANE_D0E",
        handle: "n3on_runner",
        avatar: "/placeholder.svg?height=50&width=50&text=JD",
        verified: true,
      },
      content: newPostContent,
      image: null,
      timestamp: "JUST NOW",
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      isReshared: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setIsARPostEnabled(false);
  };

  return (
    <div className="min-h-screen  relative bg-black text-white">
      {/* Fixed Cyberpunk background with grid lines */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-cyan-900">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/feed" className="flex items-center">
                  <GlitchText
                    text="CYBER_FEED"
                    className="text-xl font-bold text-cyan-400"
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-4">
                <NeonButton onClick={() => router.push("/feed")} active>
                  <Zap className="h-4 w-4 mr-2" />
                  FEED
                </NeonButton>
                <NeonButton onClick={() => router.push("/explore")}>
                  <Flame className="h-4 w-4 mr-2" />
                  EXPLORE
                </NeonButton>
                <NeonButton onClick={() => router.push("/notifications")}>
                  <Bell className="h-4 w-4 mr-2" />
                  ALERTS
                </NeonButton>
                <NeonButton onClick={() => router.push("/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  PROFILE
                </NeonButton>
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

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
        <main className="flex-1 container max-w-6xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar - Desktop only */}
          <aside className="hidden md:block">
            <div className="sticky top-20 space-y-6">
              {/* User profile card */}
              <CyberPanel title="IDENTITY">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12 border border-cyan-500 relative">
                    <AvatarImage
                      src="/placeholder.svg?height=50&width=50&text=JD"
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-black text-cyan-400">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-white">JANE_D0E</h3>
                    <p className="text-xs text-cyan-400 font-mono">
                      @n3on_runner
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div>
                    <p className="text-lg font-bold text-cyan-400">248</p>
                    <p className="text-xs text-gray-400">POSTS</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-fuchsia-400">12.4K</p>
                    <p className="text-xs text-gray-400">ALLIES</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-cyan-400">342</p>
                    <p className="text-xs text-gray-400">POWER</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => router.push("/profile")}
                  className="w-full rounded-sm border-cyan-500 text-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-300"
                >
                  VIEW_PROFILE.SYS
                </Button>
              </CyberPanel>

              {/* Trending topics */}
              <CyberPanel title="TRENDING_TOPICS">
                <ul className="space-y-3">
                  {TRENDING.map((topic) => (
                    <li key={topic.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-between rounded-sm text-left hover:bg-fuchsia-950/30 group"
                      >
                        <div className="flex items-center">
                          <Badge
                            variant="outline"
                            className="mr-2 bg-black border-fuchsia-500 text-fuchsia-400 group-hover:border-fuchsia-400 group-hover:text-fuchsia-300"
                          >
                            {topic.icon}
                          </Badge>
                          <span className="text-white group-hover:text-fuchsia-300">
                            #{topic.tag}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 group-hover:text-fuchsia-300">
                          {topic.count}
                        </span>
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="ghost"
                  className="w-full mt-2 text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                >
                  VIEW_ALL_TRENDS.SYS
                </Button>
              </CyberPanel>

              {/* Hacker news */}
              <HackerNews />
            </div>
          </aside>

          {/* Main feed */}
          <div className="md:col-span-2">
            {/* Feed tabs */}
            <Tabs
              defaultValue="for-you"
              className="w-full mb-4"
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full grid grid-cols-2 rounded-sm bg-black border border-cyan-900">
                <TabsTrigger
                  value="for-you"
                  className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-300"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  FOR_YOU.SYS
                </TabsTrigger>
                <TabsTrigger
                  value="following"
                  className="rounded-none data-[state=active]:bg-fuchsia-950 data-[state=active]:text-fuchsia-300"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  FOLLOWING.SYS
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* New post input */}
            <div className="mb-6 bg-black border border-cyan-900 rounded-sm p-4 relative">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-sm opacity-30 blur-[1px] -z-10"></div>
              <div className="flex space-x-4">
                <Avatar className="h-10 w-10 border border-cyan-500">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40&text=JD"
                    alt="Your avatar"
                  />
                  <AvatarFallback className="bg-black text-cyan-400">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder={
                      isARPostEnabled
                        ? "DESCRIBE YOUR AR EXPERIENCE..."
                        : "SHARE_YOUR_THOUGHTS.SYS"
                    }
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="bg-black/50 border-cyan-900 text-white placeholder:text-gray-500 focus-visible:ring-cyan-500"
                  />

                  {isARPostEnabled && (
                    <div className="p-3 border border-cyan-900 bg-cyan-950/20 rounded-sm">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="outline"
                          className="bg-black/50 border-cyan-500 text-cyan-400"
                        >
                          <Cube className="h-3 w-3 mr-1" />
                          AR POST
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleARPost}
                          className="h-6 text-xs text-gray-400 hover:text-gray-300"
                        >
                          CANCEL AR
                        </Button>
                      </div>
                      <div className="flex items-center justify-center h-32 border border-dashed border-cyan-700 rounded-sm bg-black/50">
                        <div className="text-center">
                          <Cube className="h-8 w-8 mx-auto mb-2 text-cyan-500 opacity-50" />
                          <p className="text-xs text-gray-400">
                            DRAG & DROP AR MODEL OR CLICK TO UPLOAD
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">
                            AR TYPE
                          </label>
                          <select className="w-full bg-black border border-cyan-900 rounded-sm text-white text-xs p-1">
                            <option value="hologram">HOLOGRAM</option>
                            <option value="overlay">OVERLAY</option>
                            <option value="fullspace">FULLSPACE</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">
                            NEURAL DEPTH
                          </label>
                          <select className="w-full bg-black border border-cyan-900 rounded-sm text-white text-xs p-1">
                            <option value="1">LEVEL 1</option>
                            <option value="2">LEVEL 2</option>
                            <option value="3">LEVEL 3</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">
                            PERMISSIONS
                          </label>
                          <select className="w-full bg-black border border-cyan-900 rounded-sm text-white text-xs p-1">
                            <option value="public">PUBLIC</option>
                            <option value="allies">ALLIES ONLY</option>
                            <option value="private">PRIVATE</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={toggleARPost}
                              className={`h-8 w-8 rounded-sm ${
                                isARPostEnabled
                                  ? "bg-cyan-950/30 text-cyan-300 border border-cyan-500"
                                  : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                              }`}
                            >
                              <Cube className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Create AR Post</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
                            >
                              <Virus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add Emoji</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                            >
                              <Bomb className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add Poll</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Button
                      onClick={handleNewPost}
                      disabled={!newPostContent.trim()}
                      className="rounded-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                    >
                      TRANSMIT
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stories */}
            <div className="mb-6 overflow-x-auto pb-2">
              <div className="flex space-x-4">
                {/* Add story button */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-75 blur-sm"></div>
                    <button className="relative h-16 w-16 rounded-full bg-black border-2 border-cyan-500 flex items-center justify-center">
                      <Plus className="h-6 w-6 text-cyan-400" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">ADD</span>
                </div>

                {/* Story circles */}
                {STORIES.map((story) => (
                  <StoryCircle
                    key={story.id}
                    username={story.username}
                    avatar={story.avatar}
                    viewed={story.viewed}
                  />
                ))}
              </div>
            </div>

            {/* Feed posts */}
            <ScrollArea className="h-[calc(100vh-220px)]" ref={feedRef}>
              <div className="space-y-6 pr-4">
                <AnimatePresence initial={false}>
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {post.type === "ar" ? (
                        <ARPost
                          post={post as any}
                          onLike={() => handleLike(post.id)}
                          onBookmark={() => handleBookmark(post.id)}
                          onReshare={() => handleReshare(post.id)}
                          glitchEffect={glitchEffect}
                        />
                      ) : (
                        <FeedPost
                          post={post}
                          onLike={() => handleLike(post.id)}
                          onBookmark={() => handleBookmark(post.id)}
                          onReshare={() => handleReshare(post.id)}
                          glitchEffect={glitchEffect}
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Scroll to top button */}
            <AnimatePresence>
              {showScrollTop && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="fixed bottom-6 right-6 z-20"
                >
                  <Button
                    size="icon"
                    onClick={scrollToTop}
                    className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
