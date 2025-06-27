"use client";
import { usePost } from "@/hooks/api/use-post";
import FeedPost from "./feed-post-v2";

import { LoadingIndicator } from "@/components/loading-indicator";

interface PostParams {
  username: string;
  postid: string;
}

export default function PostThread({ postid, username }: PostParams) {
  const { data, isLoading, error } = usePost(username, postid);

  if (isLoading)
    return (
      <div className="h-[70vh] flex items-center justify-center w-full">
        <LoadingIndicator text="FETCHING THREAD..." />
      </div>
    );
  if (error) return <div>Error loading post</div>;
  if (!data) return <div>Post not found</div>;

  return (
    <>
      <FeedPost className="" post={data} />
    </>
  );
}
