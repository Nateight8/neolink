"use client";

import { useState, useEffect } from "react";

import PostInput from "./post-input";
import { FeedPost, type Post } from "./feed-post";
import type { Poll } from "./feed-pool";

// Mock data for initial posts
const INITIAL_POSTS: Post[] = [
  {
    _id: 1,
    author: {
      id: 1,
      username: "regul8r",
      avatar: "/placeholder.svg?height=40&width=40&text=R8",
    },
    text: "What's the biggest threat to the future of crypto?",
    poll: {
      id: 1,
      question: "What's the biggest threat to the future of crypto?",
      options: [
        { id: 1, text: "Overregulation", votes: 25 },
        { id: 2, text: "Lack of adoption", votes: 42 },
        { id: 3, text: "Security risks", votes: 13 },
        { id: 4, text: "Internal conflicts", votes: 20 },
      ],
      totalVotes: 100,
      createdAt: Date.now() - 15 * 60000, // 15 minutes ago
      duration: 48, // 48 hours
      isActive: true,
      visibility: "everyone",
      maxVotes: null,
    },
    likes: 127,
    comments: 15,
    shares: 2,
    createdAt: Date.now() - 15 * 60000, // 15 minutes ago
    likedBy: [],
    retweetedBy: [],
  },
  {
    _id: 2,
    author: {
      id: 2,
      username: "ASTRO_AVA",
      avatar: "/placeholder.svg?height=40&width=40&text=AS",
    },
    text: "Yo @SARAHXSON, you ain't just part of the feed — you *are* the mainframe 🖤⚡\n\nFr, every time you drop in, it's like my HUD glitches with heartbeats 💿💘\n\nLowkey feel like my soul's synced to your signal.\nYou glow harder than neon in a blackout 🌃❤️\nNo cap, I'm riding this wave till the net burns out.\n\n#HeartDriveActive #GlitchedForYou #CyberCrush 💾🚀💋",
    likes: 0,
    comments: 0,
    shares: 0,
    createdAt: Date.now() - 2 * 24 * 3600000, // 2 days ago
    likedBy: [],
    retweetedBy: [],
  },
  {
    _id: 3,
    author: {
      id: 3,
      username: "CyberMedic",
      avatar: "/placeholder.svg?height=40&width=40&text=CM",
    },
    text: "Which medical specialty would you choose?",
    poll: {
      id: 2,
      question: "Which medical specialty would you choose?",
      options: [
        { id: 1, text: "Surgery", votes: 45 },
        { id: 2, text: "Psychiatry", votes: 32 },
        { id: 3, text: "Emergency Medicine", votes: 28 },
        { id: 4, text: "Family Medicine", votes: 15 },
      ],
      totalVotes: 120,
      createdAt: Date.now() - 24 * 3600000, // 24 hours ago
      duration: 48, // 48 hours
      isActive: true,
      visibility: "everyone",
      maxVotes: null,
    },
    likes: 76,
    comments: 23,
    shares: 14,
    createdAt: Date.now() - 24 * 3600000, // 24 hours ago
    likedBy: [],
    retweetedBy: [],
  },
];

export default function Client() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [userVotes, setUserVotes] = useState<
    Record<string | number, string | number>
  >({ 1: 3 }); // Pre-select "Security risks" for the crypto poll
  const currentUserId = "current-user-id"; // This would come from auth in a real app

  // Update poll status (active/inactive) based on duration
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.poll) {
            const endTime =
              post.poll.createdAt + post.poll.duration * 60 * 60 * 1000;
            const isActive = Date.now() < endTime;

            return {
              ...post,
              poll: {
                ...post.poll,
                isActive,
              },
            };
          }
          return post;
        })
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Handle new post submission
  const handlePostSubmit = (data: {
    text: string;
    image?: File;
    poll?: {
      question: string;
      options: string[];
      duration: number;
      visibility: "everyone" | "allies" | "selected" | "clan";
      maxVotes: number | null;
    };
  }) => {
    // In a real app, you would upload the image to a server
    // and get back a URL. Here we'll create a placeholder URL.
    const imageUrl = data.image
      ? `/placeholder.svg?height=192&width=384&text=New+Image+${Date.now()}`
      : undefined;

    // Create poll object if poll data exists
    let poll: Poll | undefined;
    if (data.poll) {
      poll = {
        id: Date.now(),
        question: data.poll.question,
        options: data.poll.options.map((text, index) => ({
          id: index + 1,
          text,
          votes: 0,
        })),
        totalVotes: 0,
        createdAt: Date.now(),
        duration: data.poll.duration,
        isActive: true,
        visibility: data.poll.visibility,
        maxVotes: data.poll.maxVotes,
      };
    }

    // Create new post
    const newPost: Post = {
      _id: Date.now(),
      author: {
        id: 99, // Current user
        username: "YOU",
        avatar: "/placeholder.svg?height=40&width=40&text=YOU",
      },
      text: data.text,
      image: imageUrl,
      poll,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: Date.now(),
      likedBy: [],
      retweetedBy: [],
    };

    // Add new post to the beginning of the posts array
    setPosts([newPost, ...posts]);
  };

  // Handle vote on a poll
  const handleVote = (pollId: string | number, optionId: string | number) => {
    // Update posts with the new vote
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.poll && post.poll.id === pollId) {
          // Check if max votes reached
          if (
            post.poll.maxVotes !== null &&
            post.poll.totalVotes >= post.poll.maxVotes
          ) {
            return post;
          }

          const updatedOptions = post.poll.options.map((option) => {
            if (option.id === optionId) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });

          return {
            ...post,
            poll: {
              ...post.poll,
              options: updatedOptions,
              totalVotes: post.poll.totalVotes + 1,
            },
          };
        }
        return post;
      })
    );

    // Record user's vote
    setUserVotes((prev) => ({ ...prev, [pollId]: optionId }));
  };

  return (
    <main className="min-h-screen bg-black">
      <div className="container px-4 py-8 max-w-2xl mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
          CyberSocial
        </h1>

        {/* Post input */}
        <PostInput onSubmit={handlePostSubmit} />

        {/* Feed posts */}
        <div className="space-y-4 mb-24">
          {posts.map((post) => (
            <FeedPost
              key={post._id}
              post={post}
              glitchEffect={true}
              onVote={handleVote}
              userVotes={userVotes}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
