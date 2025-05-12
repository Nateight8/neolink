import { axiosInstance } from "@/lib/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Strangers() {
  const queryClient = useQueryClient();
  useMutation({
    mutationFn: async (friendId: string) => {
      const response = await axiosInstance.post(`/users/friends/${friendId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendFriends"] });
    },
  });

  return <div className=""></div>;
}
