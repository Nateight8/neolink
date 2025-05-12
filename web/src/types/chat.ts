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

export interface Post {
  _id: string;
  content: string;
  image: string | null;
  author: User;
  likedBy: string[]; // array of user IDs who liked the post
  retweetedBy: string[]; // array of user IDs who retweeted the post
  createdAt: string; // ISO date string
  updatedAt: string;
  __v: number;
}
