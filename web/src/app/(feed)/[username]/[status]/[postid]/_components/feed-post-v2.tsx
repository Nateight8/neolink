import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserData from "./user-data";
import { FormattedContent } from "@/components/shared/formatted-content";

import { Post } from "@/types/chat";
import PostActions from "./post-actions";
import { useRouter } from "next/navigation";

export default function FeedPost({ post }: { post: Post }) {
  // Use avatar (not present on User), fallback to placeholder
  const avatar = "/placeholder.svg"; // TODO: Replace with real avatar field if added to User
  const router = useRouter();

  const postUrl = `/${post.author.username}/status/${post._id}`;

  return (
    <>
      <div className="h-0.5 border-b border-cyan-900 border-x "></div>
      <div
        role="button"
        onClick={() => router.push(postUrl)}
        className=" border-cyan-900/50 cursor-pointer"
      >
        <div className="flex space-x-3 p-4">
          <div>
            <Avatar className="h-10 w-10 border border-cyan-700">
              <AvatarImage src={avatar} alt={""} />
              {post.author && (
                <AvatarFallback className="bg-black text-cyan-400">
                  {(
                    post.author?.fullName ||
                    post.author?.username ||
                    "UN"
                  ).substring(0, 2)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="flex-1">
            <UserData
              name={post.author.username || "UN"}
              handle={post.author.handle || ""}
              timestamp={post.updatedAt || ""}
              participantId={post.author.participantId}
              avatar={avatar || ""}
              bio={post.author.bio || ""}
            />
            <FormattedContent content={post.content} className="line-clamp-5" />
            {/* Post Actions */}
            <PostActions />
          </div>
        </div>
      </div>
      <div className="h-0.5 border-t border-cyan-900 border-x "></div>
    </>
  );
}
