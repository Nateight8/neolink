import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { Message } from "./use-direct-message";
import { MessageResponse } from "@/types/chat";

export interface SendMessageData {
  content: string;
  messageType?: "text";
  replyTo?: string;
  tempId?: string;
}

interface SendMessageResponse {
  success: boolean;
  message: Message;
}

interface UseSendMessageOptions {
  onSuccess?: (data: SendMessageResponse) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

export const useGetMessages = (conversationId: string) => {
  return useQuery<MessageResponse>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const response = await axiosInstance.get<MessageResponse>(
        `/dm/${conversationId}/messages`
      );
      return response.data;
    },
    enabled: !!conversationId,
  });
};

export const useSendMessage = (
  conversationId: string,
  options: UseSendMessageOptions = {}
) => {
  return useMutation<SendMessageResponse, Error, SendMessageData>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        `/dm/${conversationId}/message`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onError: (error) => {
      options.onError?.(error);
    },
    onSuccess: (data) => {
      options.onSuccess?.(data);
    },
    onSettled: () => {
      options.onSettled?.();
    },
  });
};
