import mongoose from "mongoose";

// Conversation Schema
const conversationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    participants: [
      {
        type: String, // participantId (Snowflake)
        required: true,
      },
    ],
    userRefs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      content: String,
      senderId: String,
      timestamp: Date,
      messageType: {
        type: String,
        enum: ["text", "image", "file", "audio"],
        default: "text",
      },
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "conversations",
  }
);

// Indexes for performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

// Static method to create deterministic conversation ID
conversationSchema.statics.createConversationId = function (userAId, userBId) {
  const sortedIds = [userAId, userBId].sort();
  return sortedIds.join("-");
};

const Conversation = mongoose.model("Conversation", conversationSchema);

export { Conversation };
