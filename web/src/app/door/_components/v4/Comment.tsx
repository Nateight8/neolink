"use client";

import { useState } from "react";
import { Comment as CommentType, CommentProps, VoteDirection } from "./types";

const formatVotes = (count: number): string => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return count.toString();
};

export function Comment({
  comment,
  onVote,
  onReply,
  className = "",
}: CommentProps) {
  const [localVote, setLocalVote] = useState<VoteDirection>(
    comment.userVote || null
  );
  const [localVotes, setLocalVotes] = useState(comment.votes);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const formattedVotes = formatVotes(localVotes);
  const showReplyForm = isReplying && onReply;

  const handleVote = (direction: VoteDirection) => {
    const newVote = localVote === direction ? null : direction;
    setLocalVote(newVote);

    // Update local vote count immediately for better UX
    if (newVote === direction) {
      const voteChange = direction === "up" ? 1 : -1;
      setLocalVotes((prev) => prev + voteChange);
    } else if (localVote) {
      // Switching vote direction
      const voteChange = direction === "up" ? 2 : -2;
      setLocalVotes((prev) => prev + voteChange);
    } else {
      // New vote
      const voteChange = direction === "up" ? 1 : -1;
      setLocalVotes((prev) => prev + voteChange);
    }

    onVote?.(comment.id, newVote);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !onReply) return;

    onReply(comment.id, replyContent);
    setReplyContent("");
    setIsReplying(false);
  };

  return (
    <div className={`flex ${className}`}>
      {/* Left side with avatar */}
      {/* <div className="w-10 pr-2 flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
          {comment.username.charAt(0).toUpperCase()}
        </div>
      </div> */}

      {/* Main comment content */}
      <div className="flex-1 min-w-0">
        {/* Comment header */}
        <div className="flex items-center">
          <div className="rounded-full size-10 bg-muted"></div>

          <CommentHeader comment={comment} setIsReplying={setIsReplying} />
        </div>
        {/* Comment body */}
        <div className="">
          <div className="">
            <div className="rounded-full h-full w-10">
              {/* where the thread connector will go */}
            </div>
          </div>
          <div className="pl-2">
            <div className="text-[14px] leading-[21px]  mb-2">
              {comment.content}
            </div>
            {/* Comment actions */}
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <button
                className="flex items-center px-1 py-0.5 hover:bg-[#272729] rounded"
                onClick={() => setIsReplying(true)}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Reply</span>
              </button>

              <button className="flex items-center px-1 py-0.5 hover:bg-[#272729] rounded ml-1">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>Give Award</span>
              </button>

              <button className="flex items-center px-1 py-0.5 hover:bg-[#272729] rounded ml-1">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span>Share</span>
              </button>

              <button className="flex items-center px-1 py-0.5 hover:bg-[#272729] rounded ml-1">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span>Report</span>
              </button>

              <button className="flex items-center px-1 py-0.5 hover:bg-[#272729] rounded ml-1">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <span>Save</span>
              </button>

              <button className="flex items-center px-1 py-0.5 hover:bg-[#272729] rounded ml-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Reply form */}
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
                      className="bg-[#343536] text-[#d7dadc] px-4 py-1 rounded-full text-sm font-medium mr-2 hover:bg-[#4e4f52]"
                      onClick={() => setIsReplying(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#d7dadc] text-[#1a1a1b] px-4 py-1 rounded-full text-sm font-medium hover:bg-[#e9ebed] disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
}

function CommentHeader({
  comment,
  setIsReplying,
}: {
  comment: CommentType;
  setIsReplying: (value: boolean) => void;
}) {
  return (
    <div className="flex w-full pl-2 justify-between items-center flex-wrap text-xs text-[#818384] mb-1">
      <span className="font-medium text-[#4fbcff] mr-1">
        {comment.username}
      </span>

      {/* OP badge */}
      <span className="bg-[#1a1a1b] text-[11px] px-1 py-0.5 rounded border border-[#343536] mr-1">
        OP
      </span>

      {/* User flair */}
      {comment.badge && (
        <span className="bg-[#1a1a1b] text-[11px] px-1 py-0.5 rounded border border-[#343536] mr-1">
          {comment.badge}
        </span>
      )}

      <span className="mx-1 text-[#6c6e70]">•</span>
      <span className="text-[#818384]">{comment.timestamp}</span>

      {/* Edited indicator */}
      {comment.edited && (
        <>
          <span className="mx-1 text-[#6c6e70]">•</span>
          <span className="text-[#818384]">edited {comment.edited}</span>
        </>
      )}

      <button
        className="ml-1 text-[#818384] hover:underline"
        onClick={() => setIsReplying(true)}
      >
        Reply
      </button>

      <button className="ml-1 p-1 -mr-1 text-[#818384] hover:bg-[#272729] rounded">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
    </div>
  );
}
