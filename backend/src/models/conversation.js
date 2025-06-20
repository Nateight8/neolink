import mongoose from "mongoose";

// Message Schema
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      ref: "Conversation",
    },
    senderId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 2000,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "audio", "system"],
      default: "text",
    },
    attachments: [
      {
        url: String,
        filename: String,
        size: Number,
        mimeType: String,
      },
    ],
    readBy: [
      {
        userId: String,
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    editedAt: Date,
    deletedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "messages",
  }
);

// Indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, isDeleted: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export { Message };
