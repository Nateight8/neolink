export type VoteDirection = 'up' | 'down' | null;

export interface Comment {
  id: string;
  username: string;
  timestamp: string;
  content: string;
  votes: number;
  userVote?: VoteDirection;
  badge?: string;
  edited?: string; // e.g. "5 minutes ago"
  award?: {
    emoji: string;
    count: number;
  };
  media?: {
    type: 'gif' | 'image';
    url: string;
  };
  isDeleted?: boolean;
}

export interface CommentProps {
  comment: Comment;
  onVote?: (id: string, direction: VoteDirection) => void;
  onReply?: (parentId: string, content: string) => void;
  className?: string;
}
