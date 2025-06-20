import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios-instance";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  // Add other message properties as needed
  tempId?: string;
}

export interface UserMeta {
  id: string;
  participantId: string;
  fullName?: string;
  username?: string;
  handle?: string;
  avatarUrl?: string;
  status?: string;
  verified?: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  currentUser?: string; // Optional as it's not present in all contexts
  otherParticipant: UserMeta | null;
  lastMessage?: {
    id: string;
    content: string;
    sender: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
  createdAt: string;
  isActive?: boolean; // Optional as it's not present in all contexts
}

interface ConversationResponse {
  success: boolean;
  conversation: Conversation;
}

interface UseDirectMessageOptions {
  onSuccess?: (data: Conversation) => void;
  onError?: (error: Error) => void;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  pagination: PaginationInfo;
}

export const useDirectMessage = (
  conversationId?: string,
  options: UseDirectMessageOptions = {}
) => {
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
    queryKey: ["conversation", conversationId],
    queryFn: async (): Promise<Conversation> => {
      if (!conversationId) {
        throw new Error("Conversation ID is required");
      }

      // Validate conversation ID format
      const conversationIdPattern = /^\d+-\d+$/;
      if (!conversationIdPattern.test(conversationId)) {
        throw new Error(
          "Invalid conversation ID format. Expected: userA-userB"
        );
      }

      const response = await axiosInstance.get<ConversationResponse>(
        `/dm/${conversationId}`
      );
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
        queryClient.setQueryData(["conversation", data.conversation.id], data);
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
  };
};

/**
 * Hook to fetch paginated conversations for the authenticated user
 * @param page - Page number (1-based, default: 1)
 * @param limit - Number of items per page (default: 20)
 * @param options - Additional React Query options
 * @returns Query result with conversations and pagination info
 */
export const useConversationParticipants = (
  page = 1,
  limit = 20,
  options?: Omit<UseQueryOptions<ConversationsResponse>, "queryKey" | "queryFn">
) => {
  return useQuery<ConversationsResponse>({
    queryKey: ["conversations", { page, limit }],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ConversationsResponse>(
        "/dm/conversations",
        {
          params: {
            page: String(page),
            limit: String(limit),
          },
        }
      );
      return data;
    },
    // Keep previous data while fetching new data
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
