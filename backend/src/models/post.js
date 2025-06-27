// Update to your existing Post model to support polls

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // Optional
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    retweetedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // New field to link a poll to a post
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
    },
    // Flag to determine if the post is a poll post
    hasPoll: {
      type: Boolean,
      default: false,
    },
    hasChess: {
      type: Boolean,
      default: false,
    },
    chess: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChessRoom",
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
