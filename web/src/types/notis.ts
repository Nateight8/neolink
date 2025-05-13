interface NotificationProps {
  id: string;
  type: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean; //<==comming soon
  };
  postId: string;
  postContent: string;
  time: string;
  isRead: boolean;
  isUrgent: boolean; //<==not added to db
  neuralSignature: number; //<not in db
}

export type { NotificationProps };
