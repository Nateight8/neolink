"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import UserData from "./user-data";

// Types
interface Reply {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  content: string;
  upvotes: number;
  replies?: Reply[];
  bio: string;
}

// Mock Data
const mainPost = {
  author: "CYBER_SAVANT",
  handle: "cyber_savant",
  avatar: "/placeholder.svg?text=CS",
  timestamp: "4 hours ago",
  bio: "Quantum physicist and part-time chronomancer. I build things that bend the laws of reality.",
  content:
    "Just integrated a new quantum processing core into my rig. The processing speed is unreal. Has anyone else experimented with quantum entanglement for FTL data transfer? The latency is practically zero.",
  upvotes: 1337,
  commentsCount: 42,
};

const comments = [
  {
    id: "1",
    author: "GHOST_IN_THE_CODE",
    handle: "ghost",
    avatar: "/placeholder.svg?text=GC",
    timestamp: "3 hours ago",
    bio: "Reverse-engineering the fabric of spacetime. One line of code at a time.",
    content:
      "I've been working on a similar project. The main bottleneck is decoherence. How are you maintaining qubit stability?",
    upvotes: 99,
    replies: [
      {
        id: "2",
        author: "CYBER_SAVANT",
        handle: "cyber_savant",
        avatar: "/placeholder.svg?text=CS",
        timestamp: "3 hours ago",
        bio: "Quantum physicist and part-time chronomancer. I build things that bend the laws of reality.",
        content:
          "Using a combination of topological error correction and a cryo-stasis field. It's not perfect, but it holds for about 3.14 nanoseconds, long enough for a burst transmission.",
        upvotes: 150,
        replies: [],
      },
      {
        id: "3",
        author: "PIXEL_PUNK",
        handle: "pixel_punk",
        avatar: "/placeholder.svg?text=PP",
        timestamp: "2 hours ago",
        bio: "Digital artist painting with voltage and neon. If it ain't glowing, it ain't going.",
        content:
          "That's insane. Are you not worried about creating a micro black hole? I saw a guy on the dark net do that last week. Didn't end well.",
        upvotes: 45,
        replies: [],
      },
    ],
  },
  {
    id: "4",
    author: "VOID_RUNNER",
    handle: "void_runner",
    avatar: "/placeholder.svg?text=VR",
    timestamp: "1 hour ago",
    bio: "Professional data smuggler and joy-rider in the digital frontier.",
    content:
      "This is beyond my pay grade. I just overclock my GPU and call it a day.",
    upvotes: 250,
    replies: [],
  },
];

// Comment Component
const Comment = ({
  comment,
  level = 0,
}: {
  comment: Reply;
  level?: number;
}) => {
  const isNested = level > 0;

  return (
    <div className={`flex space-x-3 ${isNested ? "ml-4" : ""}`}>
      {/* Thread line and avatar */}
      <div className="flex flex-col items-center">
        <Avatar className="h-8 w-8 border border-cyan-900">
          <AvatarImage src={comment.avatar} alt={comment.author} />
          <AvatarFallback className="bg-black text-cyan-400">
            {comment.author.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        {comment.replies && comment.replies.length > 0 && (
          <div className="w-px flex-1 bg-cyan-900/50 my-2"></div>
        )}
      </div>

      <div className="flex-1">
        {/* Comment header */}
        <UserData
          name={comment.author}
          handle={comment.handle}
          timestamp={comment.timestamp}
          avatar={comment.avatar}
          bio={comment.bio}
        />

        {/* Comment body */}
        <p className="text-gray-300 mb-2 text-sm">{comment.content}</p>

        {/* Comment actions */}
        <div className="flex items-center space-x-4 text-gray-500">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto text-gray-500 hover:text-white"
          >
            <ArrowBigUp className="h-4 w-4 mr-1" />
            <span>{comment.upvotes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto text-gray-500 hover:text-white"
          >
            <ArrowBigDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto text-gray-500 hover:text-white"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>Reply</span>
          </Button>
        </div>

        {/* Replies */}
        <div className="mt-4 space-y-4">
          {comment.replies?.map((reply) => (
            <Comment key={reply.id} comment={reply} level={level + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Thread Component
export default function Thread() {
  const router = useRouter();

  return (
    <div className=" min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        {/* App Bar */}
        <div className="sticky top-0 z-10 flex items-center space-x-4 border-b border-cyan-900/50 bg-black/80 p-2 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Post</h1>
        </div>

        {/* Post Container */}
        <div className="border-b border-cyan-900/50">
          <div className="flex space-x-3 p-4">
            <div>
              <Avatar className="h-10 w-10 border border-cyan-700">
                <AvatarImage src={mainPost.avatar} alt={mainPost.author} />
                <AvatarFallback className="bg-black text-cyan-400">
                  {mainPost.author.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <UserData
                name={mainPost.author}
                handle={mainPost.handle}
                timestamp={mainPost.timestamp}
                avatar={mainPost.avatar}
                bio={mainPost.bio}
              />
              <p className="text-sm mb-4">{mainPost.content}</p>
              {/* Post Actions */}
              <div className="mt-4 flex items-center space-x-6 text-gray-400">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-gray-800 hover:text-white"
                >
                  <ArrowBigUp className="h-5 w-5" />
                  <span>{mainPost.upvotes}</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-gray-800 hover:text-white"
                >
                  <ArrowBigDown className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-gray-800 hover:text-white"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{mainPost.commentsCount} Comments</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-gray-800 hover:text-white"
                >
                  <Share className="h-5 w-5" />
                  <span>Share</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-gray-800 hover:text-white ml-auto"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6 p-4">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}
