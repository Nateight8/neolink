"use client";
import React from "react";

// Sample thread data (reuse from earlier)
const threadPost = {
  id: "post_001",
  author: "TechTalks",
  timestamp: "3h ago",
  content:
    "Just installed macOS Sequoia 15.1 RC — definitely snappier, but I’ve run into some Wi-Fi instability and the new multitasking window manager feels... undercooked. Anyone else experiencing this?",
  comments: [
    {
      id: "comment_001",
      author: "Elena92",
      timestamp: "2h ago",
      content:
        "Yep, same issue here. Wi-Fi drops randomly and reconnects after a few seconds. Thought it was just my router.",
      replies: [
        {
          id: "comment_002",
          author: "NeoDev",
          timestamp: "1h ago",
          content:
            "I’ve noticed that too, especially when switching between workspaces. Could be a driver issue.",
          replies: [
            {
              id: "comment_003",
              author: "CodeDruid",
              timestamp: "45m ago",
              content:
                "Confirmed. Packet loss spikes during window transitions. Temporary fix: disable handoff.",
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: "comment_004",
      author: "Alex_J",
      timestamp: "1h 30m ago",
      content:
        "I actually think the new window manager is a step forward. Not perfect, but it's more flexible than Sonoma.",
      replies: [
        {
          id: "comment_005",
          author: "MinaTech",
          timestamp: "1h 10m ago",
          content:
            "Same. Once you get used to it, the snapping behavior is much more intuitive.",
          replies: [],
        },
      ],
    },
    {
      id: "comment_006",
      author: "GrumpyOldCoder",
      timestamp: "50m ago",
      content:
        "Apple keeps adding flashy features before fixing the basics. Trackpad gesture lag is still there.",
      replies: [],
    },
    {
      id: "comment_007",
      author: "BetaVibes",
      timestamp: "25m ago",
      content:
        "Been running it on my M1 Air, and no real issues so far. Maybe it's more stable on ARM chips?",
      replies: [],
    },
  ],
};

// Recursive Comment Renderer
const Comment = ({ comment, depth = 0 }) => {
  return (
    <div
      style={{
        position: "relative",
        paddingLeft: depth > 0 ? "24px" : "0",
        marginBottom: "16px",
      }}
    >
      {/* Vertical line */}
      {depth > 0 && (
        <>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: "24px",
              top: "0",
              bottom: "0",
              width: "1px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          />
          {/* Curved corner */}
          <div
            style={{
              position: "absolute",
              left: "24px",
              top: "24px",
              width: "16px",
              height: "24px",
              borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              borderBottomLeftRadius: "8px",
              zIndex: 1,
            }}
          />
          {/* Connection dot */}
          <div
            style={{
              position: "absolute",
              left: "24px",
              top: "24px",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          />
        </>
      )}

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderRadius: "8px",
          padding: "12px 16px",
          transition: "background-color 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            {comment.author}
          </span>
          <span
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontSize: "0.75rem",
            }}
          >
            {comment.timestamp}
          </span>
        </div>
        <div
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
        >
          {comment.content}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const ThreadPost = () => {
  return (
    <div
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "24px 16px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        backgroundColor: "#0a0a0a",
        minHeight: "100vh",
        color: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#fff",
            marginBottom: "4px",
          }}
        >
          {threadPost.author}
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "0.875rem",
            marginBottom: "16px",
          }}
        >
          {threadPost.timestamp}
        </p>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            padding: "16px 20px",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: "1.6",
          }}
        >
          {threadPost.content}
        </div>
      </div>

      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "#fff",
          marginBottom: "16px",
          paddingBottom: "8px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        Comments
      </h2>

      <div style={{ marginTop: "8px" }}>
        {threadPost.comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default ThreadPost;
