"use client";
import { Post } from "@/types/chat";
import { FeedPoll } from "./feed-poll";
import { FormattedContent } from "../shared/formatted-content";
import Image from "next/image";

export default function FeedPostV2({ post }: { post: Post }) {
  console.log("Feed Post V2", post);

  return (
    <div className="border">
      <div className="relative border h-fit">
        {/* Invisible spacer to maintain height */}
        <div className="size-8 rounded-full bg-muted"></div>
        <div className="mb-3 px-2 ml-8 invisible">
          <FormattedContent content={post.content} />
          {post.image && (
            <div className="relative rounded-sm overflow-hidden mt-2 border border-cyan-900">
              <Image
                src={post?.image}
                alt="Post content"
                className="w-full object-cover max-h-[400px]"
              />
            </div>
          )}
          {post.hasPoll && <FeedPoll poll={post?.poll} />}
        </div>

        {/* Actual visible content - absolutely positioned */}
        <div className="mb-3 px-2 absolute left-8 top-0">
          <FormattedContent content={post.content} />
          {post.image && (
            <div className="relative rounded-sm overflow-hidden mt-2 border border-cyan-900">
              <Image
                src={post?.image}
                alt="Post content"
                className="w-full object-cover max-h-[400px]"
              />
            </div>
          )}
          {post.hasPoll && <FeedPoll poll={post?.poll} />}
        </div>
      </div>
    </div>
  );
}
