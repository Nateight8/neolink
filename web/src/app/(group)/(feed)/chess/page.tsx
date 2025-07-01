"use client";
// import FeedPost from "@/app/(feed)/[username]/status/[postid]/_components/feed-post-v2";
import CreateChess from "./_components/create-chess";
import BotModal from "../lobby/_components/game-modes/bot-modal";

export default function Page() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <>
        {/* <FeedPost post={mockPost} /> */}
        <CreateChess />
        <BotModal />
      </>
    </div>
  );
}
