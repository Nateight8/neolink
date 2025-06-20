import { Conversation } from "../models/dm.models.js";
import { Message } from "../models/conversation.js";
import mongoose from "mongoose";
import User from "../models/User.js";

const getOrCreateConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const meParticipantId = req.user.participantId.toString();

    console.log("Current participant ID:", meParticipantId);
    console.log("Request for conversation:", conversationId);

    // STEP 1: Validate conversation ID format
    const conversationIdPattern = /^\d+-\d+$/;
    if (!conversationIdPattern.test(conversationId)) {
      return res.status(400).json({
        error: "Invalid conversation ID format. Expected: userA-userB",
      });
    }

    // STEP 2: Extract participants from conversation ID
    const participants = conversationId.split("-");
    console.log("Participants:", participants);

    // STEP 3: Security check - ensure current user is one of the participants
    if (!participants.includes(meParticipantId)) {
      return res.status(403).json({
        error: "Access denied: You are not a participant in this conversation",
      });
    }

    // STEP 4: Try to find existing conversation
    let conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      // Find the other user by participantId
      const otherParticipantId = participants.find(
        (p) => p !== meParticipantId
      );
      const otherUser = await User.findOne({
        participantId: otherParticipantId,
      });
      if (!otherUser) {
        return res.status(404).json({ error: "Other participant not found" });
      }
      conversation = new Conversation({
        _id: conversationId,
        participants: participants,
        userRefs: [req.user._id, otherUser._id], // Do not sort
        unreadCount: new Map([
          [participants[0], 0],
          [participants[1], 0],
        ]),
        isActive: true,
      });
      await conversation.save();
    }

    // STEP 6: Fetch messages for this conversation
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(50) // Limit to 50 most recent messages
      .lean(); // Convert to plain JavaScript objects

    // STEP 6: Determine the other participant
    const otherParticipant = participants.find((p) => p !== meParticipantId);

    // STEP 7: Format response
    const response = {
      success: true,
      conversation: {
        id: conversation._id,
        participants: conversation.participants,
        currentUser: meParticipantId,
        otherParticipant: otherParticipant,
        lastMessage: conversation.lastMessage || null,
        unreadCount: conversation.unreadCount.get(meParticipantId) || 0,
        messages: messages.reverse(), // Reverse to show oldest first
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        isActive: conversation.isActive,
      },
    };

    console.log("Returning response:", response);
    res.json(response);
  } catch (error) {
    console.error("Error in getOrCreateConversation:", error);
    res.status(500).json({
      error: "Failed to get or create conversation",
      details: error.message,
    });
  }
};

// Get all conversations for the authenticated user
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id; // Use MongoDB _id
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {
      userRefs: userId,
      isActive: true,
    };

    const conversations = await Conversation.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalCount = await Conversation.countDocuments(query);

    const response = {
      conversations: await Promise.all(
        conversations.map(async (conv) => {
          // Find the other participantId
          const otherParticipantId = conv.participants.find(
            (p) => p !== req.user.participantId
          );
          // Fetch the other participant's user document
          const otherUser = await User.findOne(
            { participantId: otherParticipantId },
            "_id participantId fullName username handle avatarUrl status verified"
          );
          return {
            id: conv._id,
            otherParticipant: otherUser
              ? {
                  id: otherUser._id,
                  participantId: otherUser.participantId,
                  fullName: otherUser.fullName,
                  username: otherUser.username,
                  handle: otherUser.handle,
                  avatarUrl: otherUser.avatarUrl,
                  status: otherUser.status,
                  verified: otherUser.verified,
                }
              : null,
            lastMessage: conv.lastMessage,
            unreadCount: conv.unreadCount.get(userId.toString()) || 0,
            updatedAt: conv.updatedAt,
            createdAt: conv.createdAt,
          };
        })
      ),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

export { getOrCreateConversation, getConversations };
