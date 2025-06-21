"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

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
    type: "gif" | "image";
    url: string;
  };
}

const comments: Comment[] = [
  {
    id: "1",
    username: "wizardrous",
    timestamp: "6h ago",
    content:
      "This is more than just mildly interesting. I wonder what it means.",
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
        content:
          "The factory probably used it as a filler since both use the same material and therefore, same weight.",
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
    content:
      "The logical next step is to also break this one and see if an even smaller ball is inside of it",
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

export default function RedditThread() {
  return (
    <div className="max-w-3xl mx-auto py-4 px-2">
      {comments.map((comment) => (
        <CommentThread key={comment.id} comment={comment} isTopLevel={true} />
      ))}
    </div>
  );
}

function CommentThread({
  comment,
  isTopLevel = false,
  isLastInThread = false,
}: {
  comment: Comment;
  isTopLevel?: boolean;
  isLastInThread?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const formattedVotes =
    comment.votes >= 1000
      ? `${(comment.votes / 1000).toFixed(1)}K`
      : comment.votes.toString();

  return (
    <div className="relative">
      {/* Comment */}
      <div className="flex">
        {/* Left side with thread line and collapse button */}
        <div className="relative w-10 flex-shrink-0">
          {/* Main vertical thread line - only for replies */}
          {!isTopLevel && (
            <div className="absolute left-[9px] top-0 w-[2px] bg-[#343536] h-[24px]"></div>
          )}
          
          {/* Collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute left-0 top-6 w-[18px] h-[18px] rounded-full bg-[#272729] border border-[#343536] flex items-center justify-center z-10"
            aria-label={collapsed ? "Expand comment" : "Collapse comment"}
          >
            <div className="w-[8px] h-[1px] bg-gray-400"></div>
            <div className="w-[1px] h-[8px] bg-gray-400 absolute"></div>
          </button>

          {/* Curved connector for replies */}
          {!isTopLevel && (
            <div className="absolute left-[9px] bottom-[8px] w-[19px] h-[16px] border-b-2 border-l-2 border-[#343536] rounded-bl-[8px]"></div>
          )}

          {/* Continuation line after collapse button */}
          {!isLastInThread &&
            !collapsed &&
            comment.replies &&
            comment.replies.length > 0 && (
              <div 
                className="absolute left-[9px] top-[42px] w-[2px] bg-[#343536]"
                style={{ height: "calc(100% - 24px)" }}
              ></div>
            )}
        </div>

        {/* Comment content */}
        <div className="flex-1 pb-2">
          {/* Comment header */}
          <div className="flex items-center mb-1">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700 mr-2">
              <Avatar className="h-full w-full">
                <div className="h-full w-full bg-gray-600"></div>
              </Avatar>
            </div>
            <span className="text-[#d7dadc] font-medium text-sm mr-1">
              {comment.username}
            </span>
            {comment.badge && (
              <span className="bg-[#24a0ed] text-white text-xs px-1 rounded mr-1 flex items-center">
                <span className="mr-1">🏆</span>
                <span>{comment.badge}</span>
              </span>
            )}
            <span className="text-[#818384] text-xs">
              • {comment.timestamp}
            </span>
          </div>

          {!collapsed && (
            <>
              {/* Comment text */}
              {comment.content && (
                <div className="text-[#d7dadc] text-sm mb-2 leading-relaxed">
                  {comment.content}
                </div>
              )}

              {/* Comment media */}
              {comment.media && (
                <div className="mb-2 relative">
                  <div
                    className="relative rounded overflow-hidden"
                    style={{ maxWidth: "300px" }}
                  >
                    <Image
                      src={comment.media.url || "/placeholder.svg"}
                      alt="Comment media"
                      width={300}
                      height={150}
                      className="max-w-full"
                    />
                    {comment.media.type === "gif" && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        GIF
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Comment actions */}
              <div className="flex items-center text-xs text-[#818384] mb-2">
                {/* Vote buttons */}
                <div className="flex items-center mr-4">
                  <button
                    className={`p-1 hover:bg-[#272729] rounded ${
                      voted === "up" ? "text-[#ff4500]" : ""
                    }`}
                    onClick={() => setVoted(voted === "up" ? null : "up")}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4L3 15H21L12 4Z"
                        fill={voted === "up" ? "#ff4500" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                  <span className="mx-1 font-medium text-[#d7dadc]">
                    {formattedVotes}
                  </span>
                  <button
                    className={`p-1 hover:bg-[#272729] rounded ${
                      voted === "down" ? "text-[#7193ff]" : ""
                    }`}
                    onClick={() => setVoted(voted === "down" ? null : "down")}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 20L3 9H21L12 20Z"
                        fill={voted === "down" ? "#7193ff" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>

                {/* Reply button */}
                <button className="flex items-center mr-4 hover:bg-[#272729] px-2 py-1 rounded">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path
                      d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C10.8155 21 9.68577 20.7599 8.65079 20.3215L4.35683 21.5839C3.93521 21.7145 3.52952 21.3088 3.66014 20.8872L4.92346 16.5932C4.33562 15.2855 4 13.8204 4 12.3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Reply
                </button>

                {/* Award */}
                {comment.award && (
                  <div className="flex items-center mr-4">
                    <span className="mr-1">{comment.award.emoji}</span>
                    <span className="font-medium">{comment.award.count}</span>
                  </div>
                )}

                {/* Award button */}
                <button className="flex items-center mr-4 hover:bg-[#272729] px-2 py-1 rounded">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path
                      d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M8 14L5 23L12 20L19 23L16 14"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Award
                </button>

                {/* Share button */}
                <button className="flex items-center mr-4 hover:bg-[#272729] px-2 py-1 rounded">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path
                      d="M8 12H16M16 12L12 8M16 12L12 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Share
                </button>

                {/* More button */}
                <button className="hover:bg-[#272729] p-1 rounded">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H5.01M12 12H12.01M19 12H19.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* Replies */}
          {!collapsed && comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply, index) => (
                <div key={reply.id} className="relative">
                  <CommentThread
                    comment={reply}
                    isLastInThread={
                      index === comment.replies.length - 1 &&
                      !comment.moreRepliesCount
                    }
                  />
                </div>
              ))}

              {/* More replies button */}
              {comment.moreRepliesCount && comment.moreRepliesCount > 0 && (
                <div className="flex">
                  <div className="relative w-[40px] flex-shrink-0">
                    {/* Curved connector for more replies */}
                    <div className="absolute left-[24px] top-0 w-[16px] h-[16px]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="absolute"
                      >
                        <path
                          d="M 0 0 Q 0 16 16 16"
                          stroke="#343536"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </div>
                    <button className="absolute left-[32px] top-[16px] w-[18px] h-[18px] rounded-full border border-[#343536] flex items-center justify-center bg-[#1a1a1b]">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5V19M5 12H19"
                          stroke="#4fbcff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1">
                    <button className="text-[#4fbcff] text-sm py-2 hover:underline">
                      {comment.moreRepliesCount} more{" "}
                      {comment.moreRepliesCount === 1 ? "reply" : "replies"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
