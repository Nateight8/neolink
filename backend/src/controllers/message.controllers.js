import { Conversation } from "../models/dm.models.js";
import { Message } from "../models/conversation.js";
import mongoose from "mongoose";
import { getOtherParticipant } from "../lib/utils/get-other-participant.js";

// ============================================
// MESSAGE QUERY CONTROLLERS
// ============================================

// Get messages for a conversation (cursor-based pagination) through conversationId
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const participantId = req.user.participantId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const before = req.query.before; // Message ID for cursor-based pagination

    // Verify conversation exists and user has access
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(participantId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    let query = {
      conversationId,
      isDeleted: false,
    };

    // Cursor-based pagination
    if (before) {
      const beforeMessage = await Message.findById(before);
      if (beforeMessage) {
        query.createdAt = { $lt: beforeMessage.createdAt };
      }
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("replyTo", "content senderId createdAt");

    // Reverse to show oldest first
    messages.reverse();

    const response = {
      messages: messages.map((msg) => ({
        id: msg._id,
        conversationId: msg.conversationId,
        senderId: msg.senderId,
        content: msg.content,
        messageType: msg.messageType,
        attachments: msg.attachments,
        readBy: msg.readBy,
        replyTo: msg.replyTo,
        createdAt: msg.createdAt,
        editedAt: msg.editedAt,
        isRead: msg.readBy.some((read) => read.userId === participantId),
      })),
      hasMore: messages.length === limit,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// ============================================
// MESSAGE MUTATION CONTROLLERS
// ============================================

// Send a message
const sendMessage = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { conversationId } = req.params;
    const participantId = req.user.participantId; // Using participantId from auth middleware
    const { content, messageType = "text", replyToId } = req.body;

    // Verify conversation exists and user has access
    let conversation = await Conversation.findById(conversationId).session(
      session
    );

    if (!conversation) {
      // Create conversation if it doesn't exist
      const participants = conversationId.split("-").sort();
      if (!participants.includes(participantId)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ error: "Access denied" });
      }

      conversation = new Conversation({
        _id: conversationId,
        participants,
        unreadCount: new Map([
          [participants[0], 0],
          [participants[1], 0],
        ]),
        isActive: true,
      });

      await conversation.save({ session });
    } else if (!conversation.participants.includes(participantId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ error: "Access denied" });
    }

    // Handle file attachments
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        attachments.push({
          url: file.path, // This would be your file storage URL
          filename: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
        });
      }
    }

    // Create message
    const message = new Message({
      conversationId,
      senderId: participantId,
      content: content || (attachments.length > 0 ? "Sent an attachment" : ""),
      messageType,
      attachments,
      readBy: [
        {
          userId: participantId,
          readAt: new Date(),
        },
      ],
      ...(replyToId && { replyTo: replyToId }),
    });

    await message.save({ session });

    // Update conversation
    const otherParticipant = getOtherParticipant(conversationId, participantId);
    const currentUnread = conversation.unreadCount.get(otherParticipant) || 0;

    const updateOps = {
      lastMessage: {
        content:
          content || (attachments.length > 0 ? "Sent an attachment" : ""),
        senderId: participantId,
        timestamp: new Date(),
        messageType,
      },
      [`unreadCount.${otherParticipant}`]: currentUnread + 1,
      updatedAt: new Date(),
      isActive: true,
    };

    await Conversation.findByIdAndUpdate(
      conversationId,
      { $set: updateOps },
      { session, new: true }
    );

    await session.commitTransaction();
    session.endSession();

    // Populate reply if exists
    const populatedMessage = await Message.findById(message._id).populate(
      "replyTo",
      "content senderId createdAt"
    );

    const response = {
      success: true,
      message: {
        id: populatedMessage._id,
        conversationId: populatedMessage.conversationId,
        senderId: populatedMessage.senderId,
        content: populatedMessage.content,
        messageType: populatedMessage.messageType,
        attachments: populatedMessage.attachments,
        replyTo: populatedMessage.replyTo,
        createdAt: populatedMessage.createdAt,
        updatedAt: populatedMessage.updatedAt,
      },
    };

    res.status(201).json(response);

    // TODO: Emit socket event for real-time updates
    // io.to(conversationId).emit('new-message', response);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error sending message:", error);
    res.status(500).json({
      error: "Failed to send message",
      details: error.message,
    });
  }
};

export { sendMessage, getConversationMessages };
