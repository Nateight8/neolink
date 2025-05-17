export interface User {
  _id: string;
  username?: string;
  fullName: string;
  handle: string;
  bio: string;
  friends?: string[];
  isOnboarder?: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: string;
}

export interface MockMessage {
  id: number;
  sender: "other" | "self";
  text?: string;
  time: string;
  status: "read" | "delivered" | "sent";
  type: "text" | "neural" | "ar";
  neuralData?: {
    type: "sensation" | "data" | "sync";
    intensity: number;
    description: string;
  };
  arData?: {
    model: string;
    preview: string;
    description?: string;
  };
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
}
