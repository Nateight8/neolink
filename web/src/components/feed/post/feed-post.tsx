"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserData from "./user-data";
import { FormattedContent } from "@/components/shared/formatted-content";
import { FeedPoll } from "@/components/feed/feed-poll";

import { Post } from "@/types/chat";
import PostActions from "./post-actions";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ChallengeInvite from "@/components/navigation/chess/challenge-iv";

export default function FeedPost({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) {
  const avatar = "/placeholder.svg"; // TODO: Replace with real avatar field if added to User
  const pathname = usePathname();
  const router = useRouter();

  const postUrl = `/${post.author.username}/status/${post._id}`;
  const isOnPostRoute = pathname === postUrl;

  return (
    <>
      <div className="h-0.5 border-b border-cyan-900 border-x "></div>
      <div
        role="button"
        onClick={!isOnPostRoute ? () => router.push(postUrl) : undefined}
        className={`w-full border-cyan-900/50 ${
          !isOnPostRoute ? "cursor-pointer" : ""
        } ${className}`}
      >
        <div className="flex w-full space-x-3 px-0 md:px-4 py-4">
          <div className="flex-shrink-0">
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
          <div className="flex-1 min-w-0">
            <div className="w-full">
              <UserData post={post} />
              <div className="w-full break-words">
                <FormattedContent
                  content={post.content}
                  className={cn("break-words w-full", className)}
                />
              </div>
            </div>
            {post.hasPoll && post.poll && (
              <div className="my-4">
                <FeedPoll poll={post.poll} />
              </div>
            )}
            {post.chess && (
              <div className="my-4">
                <ChallengeInvite post={post} />
              </div>
            )}
            {/* Post Actions */}
            <PostActions post={post} />
          </div>
        </div>
      </div>
      <div className="h-0.5 border-t border-cyan-900 border-x "></div>
    </>
  );
}
