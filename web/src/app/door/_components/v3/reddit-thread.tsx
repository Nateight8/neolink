"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

type VoteDirection = 'up' | 'down' | null;

interface Comment {
  id: string;
  username: string;
  timestamp: string;
  content: string;
  votes: number;
  badge?: string;
  replies: Comment[];
  moreRepliesCount?: number;
  award?: {
    emoji: string;
    count: number;
  };
  media?: {
    type: 'gif' | 'image';
    url: string;
  };
  userVote?: VoteDirection;
  isDeleted?: boolean;
}

const comments: Comment[] = [
  {
    id: "1",
    username: "wizardrous",
    timestamp: "6h ago",
    content: "This is more than just mildly interesting. I wonder what it means.",
    votes: 4800,
    badge: "Top 1% Commenter",
    award: {
      emoji: "🌱",
      count: 4,
    },
    replies: [
      {
        id: "2",
        username: "CorvusKing",
        timestamp: "6h ago",
        content: "When two billiards balls love each other very much...",
        votes: 2500,
        replies: [],
        moreRepliesCount: 33,
      },
      {
        id: "3",
        username: "morto00x",
        timestamp: "5h ago",
        content: "The factory probably used it as a filler since both use the same material and therefore, same weight.",
        votes: 538,
        replies: [],
        moreRepliesCount: 69,
      },
    ],
    moreRepliesCount: 22,
  },
  {
    id: "4",
    username: "Vacuumharmonics",
    timestamp: "6h ago",
    content: "The logical next step is to also break this one and see if an even smaller ball is inside of it",
    votes: 7200,
    award: {
      emoji: "🤲",
      count: 4,
    },
    replies: [
      {
        id: "5",
        username: "Shadow288",
        timestamp: "6h ago",
        content: "Balls all the way down!",
        votes: 1400,
        replies: [],
        moreRepliesCount: 43,
      },
      {
        id: "6",
        username: "SassySugarBush",
        timestamp: "5h ago",
        content: "",
        votes: 69,
        media: {
          type: "gif",
          url: "/placeholder.svg?height=150&width=300",
        },
        replies: [],
      },
    ],
  },
];

const formatVotes = (count: number): string => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toString();
};

export default function RedditThread() {
  const [commentsState, setComments] = useState<Comment[]>(comments);

  const handleVote = (commentId: string, direction: VoteDirection) => {
    // Find the comment and update its vote
    const updateCommentVote = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          let voteChange = 0;
          const currentVote = comment.userVote;
          
          if (currentVote === direction) {
            // Toggle off vote
            voteChange = direction === 'up' ? -1 : 1;
          } else if (currentVote) {
            // Switch vote direction
            voteChange = direction === 'up' ? 2 : -2;
          } else {
            // New vote
            voteChange = direction === 'up' ? 1 : -1;
          }
          
          return {
            ...comment,
            votes: comment.votes + voteChange,
            userVote: currentVote === direction ? null : direction
          };
        }
        
        if (comment.replies?.length) {
          return {
            ...comment,
            replies: updateCommentVote(comment.replies)
          };
        }
        
        return comment;
      });
    };

    setComments(prevComments => updateCommentVote(prevComments));
  };

  const handleReply = (parentId: string, content: string) => {
    if (!content.trim()) return;
    
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      username: 'current_user',
      timestamp: 'just now',
      content,
      votes: 1,
      replies: [],
      userVote: 'up'
    };

    const addReplyToComment = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [newReply, ...comment.replies]
          };
        }
        
        if (comment.replies?.length) {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies)
          };
        }
        
        return comment;
      });
    };

    setComments(prevComments => addReplyToComment(prevComments));
  };

  return (
    <div className="max-w-3xl mx-auto py-4 px-4 bg-[#1a1a1b] text-[#d7dadc]">
      {commentsState.map((comment, index) => (
        <Comment 
          key={comment.id} 
          comment={comment} 
          isTopLevel={true} 
          isLastInThread={index === commentsState.length - 1}
          onVote={handleVote}
          onReply={handleReply}
        />
      ))}
    </div>
  );
}

interface CommentProps {
  comment: Comment;
  isTopLevel?: boolean;
  isLastInThread?: boolean;
  onVote?: (id: string, direction: VoteDirection) => void;
  onReply?: (parentId: string, content: string) => void;
  depth?: number;
}

function Comment({
  comment,
  isTopLevel = false,
  isLastInThread = false,
  onVote,
  onReply,
  depth = 0
}: CommentProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [localVote, setLocalVote] = useState<VoteDirection>(comment.userVote || null);
  const [localVotes, setLocalVotes] = useState(comment.votes);
  
  const formattedVotes = formatVotes(localVotes);
  const showReplyForm = isReplying && onReply;
  
  // Format timestamp to "X hours/days ago" format
  const formatTimestamp = (timestamp: string) => {
    // This is a simplified version - you might want to use a library like date-fns
    return timestamp;
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleVote = (direction: VoteDirection) => {
    const newVote = localVote === direction ? null : direction;
    setLocalVote(newVote);
    
    // Update local vote count immediately for better UX
    if (newVote === direction) {
      const voteChange = direction === 'up' ? 1 : -1;
      setLocalVotes(prev => prev + voteChange);
    } else if (localVote) {
      // Switching vote direction
      const voteChange = direction === 'up' ? 2 : -2;
      setLocalVotes(prev => prev + voteChange);
    } else {
      // New vote
      const voteChange = direction === 'up' ? 1 : -1;
      setLocalVotes(prev => prev + voteChange);
    }

    onVote?.(comment.id, direction);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !onReply) return;
    
    onReply(comment.id, replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  return (
    <div className="relative">
      <div className="flex">
        {/* Left side with vote buttons */}
        <div className="flex flex-col items-center w-10 pr-2">
          <button 
            className={`p-2 rounded hover:bg-[#1a1a1b] ${localVote === 'up' ? 'text-[#ff4500]' : 'text-[#818384]'}`}
            onClick={() => handleVote('up')}
            aria-label="Upvote"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path 
                d="M12 4.5L4 14h16l-8-9.5z" 
                fill={localVote === 'up' ? 'currentColor' : 'none'}
                stroke="currentColor" 
                strokeWidth="1.5"
              />
            </svg>
          </button>
          
          <span className="text-xs font-medium text-[#d7dadc] my-1">
            {formattedVotes}
          </span>
          
          <button 
            className={`p-2 rounded hover:bg-[#1a1a1b] ${localVote === 'down' ? 'text-[#7193ff]' : 'text-[#818384]'}`}
            onClick={() => handleVote('down')}
            aria-label="Downvote"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path 
                d="M12 19.5l8-9.5H4l8 9.5z" 
                fill={localVote === 'down' ? 'currentColor' : 'none'}
                stroke="currentColor" 
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>

        {/* Main comment content */}
        <div className="flex-1 min-w-0">
          {/* Comment header */}
          <div className="flex items-center text-xs text-[#818384] mb-1">
            <div className="h-5 w-5 rounded-full bg-[#343536] mr-1 flex-shrink-0"></div>
            <span className="font-medium text-[#d7dadc] mr-1">
              {comment.username}
            </span>
            {comment.badge && (
              <span className="bg-[#1a1a1b] text-[11px] px-1 py-0.5 rounded border border-[#343536] ml-1">
                {comment.badge}
              </span>
            )}
            <span className="mx-1">•</span>
            <span>{formatTimestamp(comment.timestamp)}</span>
            <span className="mx-1">•</span>
            <button className="hover:underline">Reply</button>
            <button className="ml-auto p-1 -mr-1 text-[#818384] hover:bg-[#272729] rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          {/* Comment body */}
          <div className="text-[14px] leading-[21px] text-[#d7dadc] mb-2">
            {comment.content}
          </div>

          {/* Comment actions */}
          <div className="flex items-center text-xs text-[#818384] mb-2">
            <button className="flex items-center px-1 py-0.5 hover:bg-[#272729] rounded">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Reply</span>
            </button>
            <button className="flex items-center px-1 py-0.5 hover:bg-[#272729] rounded ml-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Give Award</span>
            </button>
            <button className="flex items-center px-1 py-0.5 hover:bg-[#272729] rounded ml-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </button>
            <button className="flex items-center px-1 py-0.5 hover:bg-[#272729] rounded ml-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Report</span>
            </button>
            <button className="flex items-center px-1 py-0.5 hover:bg-[#272729] rounded ml-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>Save</span>
            </button>
          </div>

          {/* Reply form - shown when replying */}
          {showReplyForm && (
            <div className="mt-2 mb-4">
              <form onSubmit={handleReplySubmit} className="flex flex-col">
                <textarea
                  className="bg-[#1a1a1b] text-[#d7dadc] border border-[#343536] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  placeholder="What are your thoughts?"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="bg-[#343536] text-[#d7dadc] px-4 py-1 rounded-full text-sm font-medium mr-2"
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#d7dadc] text-[#1a1a1b] px-4 py-1 rounded-full text-sm font-medium"
                    disabled={!replyContent.trim()}
                  >
                    Reply
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Show collapsed indicator if collapsed and has replies */}
      {collapsed && comment.replies && comment.replies.length > 0 && (
        <div className="flex items-center mt-2">
          <div className="w-10 flex-shrink-0"></div>
          <button
            onClick={() => setCollapsed(false)}
            className="text-[#4fbcff] text-sm hover:underline"
          >
            [{comment.replies.length} more{" "}
            {comment.replies.length === 1 ? "reply" : "replies"}]
          </button>
        </div>
      )}
    </div>
  );
}
