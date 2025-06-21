"use client";
import Comment from "./_components/v5/comment";

const mockComment = {
  id: "1",
  username: "mohamed_h_ismail",
  timestamp: "3 days ago",
  content:
    "I'm just here to say that I love this post. It's so well written and informative. I've learned a lot from it. Thank you for sharing your knowledge with us. I'm looking forward to reading more of your posts in the future.",
  votes: 42,
  userVote: null,
  edited: "2 days ago",
  badge: "Top Contributor",
  award: {
    emoji: "🏆",
    count: 3,
  },
};

export default function Home() {
  // const handleVote = (id: string, direction: "up" | "down" | null) => {
  //   console.log(`Voted ${direction} on comment ${id}`);
  // };

  // const handleReply = (parentId: string, content: string) => {
  //   console.log(`Replying to ${parentId}: ${content}`);
  // };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#1a1a1b] p-4">
      <div className="max-w-2xl w-full">
        <Comment comment={mockComment} />
      </div>
    </div>
  );
}
