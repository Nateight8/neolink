import { User } from "@/contexts/auth-context";
import type { Conversation } from "@/hooks/api/use-direct-message";

export interface ReadBy {
  userId: string;
  readAt: string;
  _id: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: string;
  attachments: string[];
  readBy: ReadBy[];
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  sender: {
    id: string;
    participantId: string;
    fullName: string;
    username?: string;
    handle: string;
    avatarUrl?: string;
  };
  optimistic?: boolean;
  tempId?: string;
}

export interface MessageResponse {
  conversation: Conversation;
  messages: Message[];
  hasMore: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
}

export interface PollOption {
  _id: string;
  text: string;
  votes: string[];
}

export interface Poll {
  _id: string;
  question: string;
  options: PollOption[];
  expiresAt: string;
  visibility: "public" | "private";
  totalVotes: number;
}

export interface Post {
  _id: string;
  content: string;
  image: string | null;
  author: User;
  likedBy: string[];
  retweetedBy: string[];
  hasPoll: boolean;
  createdAt: string;
  updatedAt: string;
  poll?: Poll;
  chess?: {
    roomId: string;
    timeControl: string;
    rated: boolean;
    chessPlayers: {
      user: User;
      color: "white" | "black";
      isCreator: boolean;
    }[];
    isCreator: boolean;
  };
}
