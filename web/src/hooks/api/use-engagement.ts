import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { Post } from "@/types/chat";
import { useAuth } from "@/contexts/auth-context";

type EngagementType = "like" | "retweet" | "bookmark";

export function useEngagement(postId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutate: reactionMutation } = useMutation({
    mutationFn: async (type: EngagementType) => {
      await axiosInstance.post(`/posts/${postId}/reactions`, { type });
    },
    onMutate: async (type) => {
      if (!user?._id) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["post-feed"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      // Snapshot the previous value
      const previousFeed = queryClient.getQueryData(["post-feed"]);
      const previousPost = queryClient.getQueryData(["post", postId]);

      // Optimistically update the feed
      queryClient.setQueryData<Post[]>(["post-feed"], (old) => {
        if (!old) return old;
        return old.map((post) => {
          if (post._id === postId) {
            const newPost = { ...post };
            if (type === "like") {
              // Toggle like status
              const isLiked = post.likedBy.includes(user._id);
              if (isLiked) {
                newPost.likedBy = post.likedBy.filter((id) => id !== user._id);
              } else {
                newPost.likedBy = [...post.likedBy, user._id];
              }
            } else if (type === "retweet") {
              // Toggle retweet status
              const isRetweeted = post.retweetedBy.includes(user._id);
              if (isRetweeted) {
                newPost.retweetedBy = post.retweetedBy.filter(
                  (id) => id !== user._id
                );
              } else {
                newPost.retweetedBy = [...post.retweetedBy, user._id];
              }
            }
            return newPost;
          }
          return post;
        });
      });

      // Optimistically update the specific post if it exists
      queryClient.setQueryData<Post>(["post", postId], (old) => {
        if (!old) return old;
        const newPost = { ...old };
        if (type === "like") {
          const isLiked = old.likedBy.includes(user._id);
          if (isLiked) {
            newPost.likedBy = old.likedBy.filter((id) => id !== user._id);
          } else {
            newPost.likedBy = [...old.likedBy, user._id];
          }
        } else if (type === "retweet") {
          const isRetweeted = old.retweetedBy.includes(user._id);
          if (isRetweeted) {
            newPost.retweetedBy = old.retweetedBy.filter(
              (id) => id !== user._id
            );
          } else {
            newPost.retweetedBy = [...old.retweetedBy, user._id];
          }
        }
        return newPost;
      });

      // Return a context object with the snapshotted value
      return { previousFeed, previousPost };
    },
    onError: (err, type, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousFeed) {
        queryClient.setQueryData(["post-feed"], context.previousFeed);
      }
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      console.error("Engagement error:", err);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ["post-feed"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  return { handleReaction: reactionMutation };
}
