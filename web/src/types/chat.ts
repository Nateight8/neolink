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

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
}
