import { useState, useEffect } from 'react';
import { axiosInstance } from "@/lib/axios-instance";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  // Add other message properties as needed
}

export interface Conversation {
  id: string;
  participants: string[];
  currentUser: string;
  otherParticipant: string;
  lastMessage: Message | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface ConversationResponse {
  success: boolean;
  conversation: Conversation;
}

interface UseDirectMessageOptions {
  onSuccess?: (data: Conversation) => void;
  onError?: (error: Error) => void;
}

export const useDirectMessage = (conversationId?: string, options: UseDirectMessageOptions = {}) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);
  const { onSuccess, onError } = options;

  // Fetch or create conversation
  const {
    data: conversationData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async (): Promise<Conversation> => {
      if (!conversationId) {
        throw new Error('Conversation ID is required');
      }

      // Validate conversation ID format
      const conversationIdPattern = /^\d+-\d+$/;
      if (!conversationIdPattern.test(conversationId)) {
        throw new Error('Invalid conversation ID format. Expected: userA-userB');
      }

      const response = await axiosInstance.get<ConversationResponse>(`/dm/${conversationId}`);
      return response.data.conversation;
    },
    enabled: !!conversationId,
  });

  // Handle success and error with useEffect
  useEffect(() => {
    if (conversationData) {
      onSuccess?.(conversationData);
    }
  }, [conversationData, onSuccess]);

  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  // Create a new conversation
  const createConversationMutation = useMutation<
    ConversationResponse,
    Error,
    string
  >({
    mutationFn: async (newConversationId: string) => {
      const response = await axiosInstance.get<ConversationResponse>(
        `/dm/${newConversationId}`
      );
      return response.data;
    },
    onSuccess: (data: ConversationResponse) => {
      if (data?.conversation) {
        queryClient.setQueryData(
          ['conversation', data.conversation.id],
          data
        );
        onSuccess?.(data.conversation);
      }
    },
    onError: (error: Error) => {
      setError(error);
      onError?.(error);
    },
  });

  // Get or create conversation (combines both operations)
  const getOrCreateConversation = async (id: string): Promise<Conversation> => {
    try {
      const response = await createConversationMutation.mutateAsync(id);
      return response.conversation;
    } catch (err) {
      throw err;
    }
  };

  return {
    // State
    conversation: conversationData,
    isLoading,
    isError,
    error,
    
    // Actions
    getOrCreateConversation,
    refetch,
    
    // Raw mutations
    createConversation: createConversationMutation.mutate,
    createConversationAsync: createConversationMutation.mutateAsync,
  };
};

export default useDirectMessage;
