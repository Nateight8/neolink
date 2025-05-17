// models/notifications.js

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["like", "comment", "follow", "mention", "poll_vote"], // Added poll_vote
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null, // If the notification is related to a post
    },
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      default: null, // If the notification is related to a poll
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FriendRequest",
      default: null, // For storing friend request ID
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
