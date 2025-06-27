"use client";
import FeedPost from "@/app/(feed)/[username]/status/[postid]/_components/feed-post-v2";
import CreateChess from "./_components/create-chess";
import BotModal from "../lobby/_components/game-modes/bot-modal";

const mockPost = {
  _id: "123",
  content: "Anyone up for a quick chess game? 🎮♟️",
  image: null,
  author: {
    _id: "user123",
    username: "ChessMaster",
    fullName: "Chess Master",
    handle: "chessmaster",
    bio: "Chess enthusiast",
    participantId: "participant123",
  },
  likedBy: [],
  retweetedBy: [],
  hasPoll: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  chess: {
    roomId: "abc123xyz",
    timeControl: "5+0",
    rated: true,
  },
};

export default function Page() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <>
        <FeedPost post={mockPost} />
        <CreateChess />
        <BotModal />
      </>
    </div>
  );
}
