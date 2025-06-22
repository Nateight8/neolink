import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";

type EngagementType = "like" | "retweet" | "bookmark";

export function useEngagement(postId: string) {
  const queryClient = useQueryClient();

  const { mutate: reactionMutation } = useMutation({
    mutationFn: async (type: EngagementType) => {
      await axiosInstance.post(`/posts/${postId}/reactions`, { type });
    },
    onSuccess: () => {
      // Invalidate the main feed query to reflect the change
      queryClient.invalidateQueries({
        queryKey: ["post-feed"],
      });
      // Also invalidate the specific post query if viewing a detail page
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error) => {
      // Handle or log the error
      console.error("Engagement error:", error);
    },
  });

  return { handleReaction: reactionMutation };
}
