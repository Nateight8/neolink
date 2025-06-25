import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";

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
      toast(msg);
    },
  });
}

export function useChessRoomState(roomId: string) {
  return useQuery({
    queryKey: ["chess-room", roomId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/chess/room/${roomId}`);
      return res.data;
    },
    enabled: !!roomId,
  });
}

export function useMakeChessMove() {
  return useMutation({
    mutationFn: async ({
      roomId,
      from,
      to,
      san,
      fen,
    }: {
      roomId: string;
      from: string;
      to: string;
      san: string;
      fen: string;
    }) => {
      const res = await axiosInstance.post(`/chess/room/${roomId}/move`, {
        from,
        to,
        san,
        fen,
      });
      return res.data;
    },
    onError: (error: unknown) => {
      let msg = "Move rejected by the neon grid. Try again.";
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
      toast(msg);
    },
  });
}
