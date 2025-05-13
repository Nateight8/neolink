interface NotificationProps {
  id: string;
  type: string;
  userId: string;
  requestId: string;
  user: {
    _id: string;
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  postId?: string;
  postContent?: string;
  time: string;
  isRead: boolean;
  isUrgent?: boolean;
  neuralSignature?: number;
}

export type { NotificationProps };
