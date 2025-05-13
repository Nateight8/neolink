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
      enum: ["like", "comment", "follow", "mention"], // Example types
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null, // If the notification is related to a post
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
