import { axiosInstance } from "@/lib/axios-instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Strangers() {
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
