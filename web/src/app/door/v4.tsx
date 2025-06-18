"use client";

import { useState } from "react";

interface Comment {
  id: string;
  username: string;
  timestamp: string;
  content: string;
  votes: number;
  replies: Comment[];
  isDeleted?: boolean;
}

const comments: Comment[] = [
  {
    id: "1",
    username: "stjimmy96",
    timestamp: "2y ago",
    content:
      "I personally find that approach much more readable than using class names.\n\nIf I stumble across a '<TitleText>' I immediately know what that component's role in the layout is. If I see a P tag instead it could have multiple classes and even just the syntax 'className={styles.titleText}' is less readable",
    votes: 14,
    replies: [
      {
        id: "2",
        username: "fredsq",
        timestamp: "2y ago",
        content:
          "your arguments are valid but there's a level of obscuring there: what's the semantic html tag being rendered? (it'll be a div, it's always a div)\n\nwhat other elements does this element affect?",
        votes: 1,
        replies: [
          {
            id: "3",
            username: "Kablaow",
            timestamp: "2y ago",
            content:
              "for your second question... couldn't that be an issue with css classes as well?",
            votes: 3,
            replies: [
              {
                id: "4",
                username: "fredsq",
                timestamp: "2y ago",
                content: "yea and that's why I love tailwind ❤️",
                votes: 1,
                replies: [
                  {
                    id: "5",
                    username: "stjimmy96",
                    timestamp: "2y ago",
                    content:
                      "`what's the semantic html tag being rendered?` Well, that's something you'd have to enforce anyway with a code-review. Nothing would prevent me from using a `<div class='page-title'>` anyway but a comment by a colleague.\n\n`what other elements does this element affect?` Again, more an issue with inherited styles. This question remains whether you use styled components or css modules.",
                    votes: 2,
                    replies: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function RedditThread() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 bg-[#030303] min-h-screen">
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} depth={0} />
        ))}
      </div>
    </div>
  );
}

function Comment({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [collapsed, setCollapsed] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="relative">
      {/* Thread connectors for nested comments */}
      {depth > 0 && (
        <div className="absolute left-0 top-0 w-10 h-full">
          {/* Vertical line from top */}
          <div className="absolute left-4 top-0 w-0.5 h-8 bg-[#343536]" />

          {/* Curved connector to avatar */}
          <div className="absolute left-4 top-8 w-4 h-4">
            <div className="w-4 h-4 border-l-2 border-b-2 border-[#343536] rounded-bl-lg" />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Spacing for nested comments */}
        {depth > 0 && <div className="w-10 flex-shrink-0" />}

        {/* Avatar */}
        <div className="relative flex-shrink-0 mr-3">
          <div className="w-8 h-8 bg-[#4a90e2] rounded-full flex items-center justify-center text-white text-sm font-medium relative z-10">
            {comment.username.charAt(0).toUpperCase()}
          </div>

          {/* Collapse/Expand button - positioned below avatar */}
          {hasReplies && (
            <button
              onClick={toggleCollapse}
              className="absolute left-1/2 -translate-x-1/2 top-10 w-4 h-4 bg-[#272729] border border-[#343536] rounded-full flex items-center justify-center hover:bg-[#343536] z-20"
            >
              {/* Plus icon when collapsed, minus when expanded */}
              <div className="relative">
                <div className="w-2 h-0.5 bg-[#818384]" />
                {collapsed && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-2 bg-[#818384]" />
                )}
              </div>
            </button>
          )}
        </div>

        {/* Comment content */}
        <div className="flex-1 min-w-0">
          {/* Comment header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#d7dadc] font-medium text-sm">
              {comment.username}
            </span>
            <span className="text-[#818384] text-xs">
              • {comment.timestamp}
            </span>
          </div>

          {/* Comment content - show unless collapsed */}
          {!collapsed && (
            <>
              <div
                className={`text-[#d7dadc] text-sm mb-3 leading-relaxed whitespace-pre-line ${
                  comment.isDeleted ? "text-[#818384] italic" : ""
                }`}
              >
                {comment.content}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-4 text-xs text-[#818384] mb-4">
                {/* Voting */}
                <div className="flex items-center">
                  <button className="p-1 hover:bg-[#272729] rounded transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 4L3 15H21L12 4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <span className="mx-2 font-medium text-[#d7dadc] min-w-[20px] text-center">
                    {comment.votes}
                  </span>
                  <button className="p-1 hover:bg-[#272729] rounded transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 20L3 9H21L12 20Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Action buttons */}
                <button className="text-[#818384] hover:text-[#d7dadc] transition-colors font-medium">
                  Reply
                </button>
                <button className="text-[#818384] hover:text-[#d7dadc] transition-colors font-medium">
                  Award
                </button>
                <button className="text-[#818384] hover:text-[#d7dadc] transition-colors font-medium">
                  Share
                </button>
                <button className="text-[#818384] hover:text-[#d7dadc] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                    <circle cx="19" cy="12" r="1" fill="currentColor" />
                    <circle cx="5" cy="12" r="1" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* Collapsed state indicator */}
          {collapsed && hasReplies && (
            <button
              onClick={toggleCollapse}
              className="text-[#4fbcff] text-sm hover:underline mb-4"
            >
              [{comment.replies.length} more{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}]
            </button>
          )}
        </div>
      </div>

      {/* Replies section */}
      {!collapsed && hasReplies && (
        <div className="relative">
          {/* Vertical continuation line for replies */}
          {depth >= 0 && (
            <div
              className="absolute left-4 top-0 w-0.5 bg-[#343536]"
              style={{ height: `${comment.replies.length * 120}px` }}
            />
          )}

          <div className="space-y-4 mt-4">
            {comment.replies.map((reply, index) => (
              <Comment key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
