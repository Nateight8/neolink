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

// Add pre-remove middleware to delete associated chess room when a post is deleted
postSchema.pre('remove', async function(next) {
  try {
    // Only proceed if the post has a chess room
    if (this.chess) {
      const ChessRoom = mongoose.model('ChessRoom');
      await ChessRoom.findByIdAndDelete(this.chess);
      console.log(`Deleted chess room ${this.chess} associated with post ${this._id}`);
    }
    next();
  } catch (error) {
    console.error('Error in post pre-remove middleware:', error);
    next(error);
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
