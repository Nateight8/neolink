import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserData from "../../../../../../components/feed/post/user-data";
import { FormattedContent } from "@/components/shared/formatted-content";
import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowBigUp, MessageSquare } from "lucide-react";

// Types
interface Reply {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  content: string;
  upvotes: number;
  replies?: Reply[];
  bio: string;
}

// Comment Component
export const Comment = ({
  comment,
  level = 0,
}: {
  comment: Reply;
  level?: number;
}) => {
  const isNested = level > 0;

  return (
    <div className={`flex space-x-3 ${isNested ? "ml-4" : ""}`}>
      {/* Thread line and avatar */}
      <div className="flex flex-col items-center">
        <Avatar className="h-8 w-8 border border-cyan-900">
          <AvatarImage src={comment.avatar} alt={comment.author} />
          <AvatarFallback className="bg-black text-cyan-400">
            {comment.author.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        {comment.replies && comment.replies.length > 0 && (
          <div className="w-px flex-1 bg-cyan-900/50 my-2"></div>
        )}
      </div>

      <div className="flex-1">
        {/* Comment header */}
        <UserData
          name={comment.author}
          handle={comment.handle}
          timestamp={comment.timestamp}
          avatar={comment.avatar}
          bio={comment.bio}
          participantId="123"
        />

        {/* Comment body */}
        <FormattedContent content={comment.content} className="text-gray-300" />

        {/* Comment actions */}
        <div className="flex items-center space-x-4 text-gray-500">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto text-gray-500 hover:text-white"
          >
            <ArrowBigUp className="h-4 w-4 mr-1" />
            <span>{comment.upvotes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto text-gray-500 hover:text-white"
          >
            <ArrowBigDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto text-gray-500 hover:text-white"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>Reply</span>
          </Button>
        </div>

        {/* Replies */}
        <div className="mt-4 space-y-4">
          {comment.replies?.map((reply) => (
            <Comment key={reply.id} comment={reply} level={level + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};
