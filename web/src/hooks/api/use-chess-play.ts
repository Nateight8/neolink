import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";

export function useAcceptChessChallenge() {
  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await axiosInstance.post("/chess/accept", { postId });
      return res.data;
    },
    onError: (error: unknown) => {
      // Cyberpunk-themed error handling
      let msg = "Neon grid malfunction. Try jacking in again.";
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "error" in error.response.data
      ) {
        msg = (error.response.data as { error: string }).error;
      }
      // You can use your notification system here, e.g. toast.error(msg)
      if (typeof window !== "undefined") {
        alert(msg); // Replace with your preferred UI feedback
      }
    },
  });
}
