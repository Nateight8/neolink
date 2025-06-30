import { Post } from "@/types/chat";
// import { Heart, MessageCircle } from "lucide-react";
// import FeedPostV2 from "../feed/feed-post-v2";

export default function Posts({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
      {posts.map((post) => (
        <div className="" key={post._id}></div>
        // <FeedPostV2 {...post} key={post._id} />
      ))}
    </div>
  );
}
