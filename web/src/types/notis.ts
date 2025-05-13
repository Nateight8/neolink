interface NotificationProps {
  id: string;
  type: string;
  userId: string;
  user: {
    _id: string;
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  postId?: string;
  postContent?: string;
  createdAt: string;
  isRead: boolean;
  isUrgent?: boolean;
  neuralSignature?: number;
}

export type { NotificationProps };
