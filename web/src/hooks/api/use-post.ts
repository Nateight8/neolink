import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";

export function usePost(username: string, postId: string) {
  return useQuery({
    queryKey: ["post", username, postId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/${username}/${postId}`);
      return res.data;
    },
    enabled: !!username && !!postId,
  });
}
