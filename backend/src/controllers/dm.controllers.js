import { Conversation } from "../models/dm.models.js";
import { Message } from "../models/conversation.js";
import mongoose from "mongoose";

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

    if (conversation) {
      console.log("Found existing conversation:", conversation._id);
    } else {
      console.log("Creating new conversation...");

      // STEP 5: Create new conversation if it doesn't exist
      const sortedIds = participants.sort(); // Ensure consistent ordering

      conversation = new Conversation({
        _id: conversationId,
        participants: sortedIds,
        participantA: sortedIds[0],
        participantB: sortedIds[1],
        unreadCount: new Map([
          [sortedIds[0], 0],
          [sortedIds[1], 0],
        ]),
        isActive: true,
      });

      await conversation.save();
      console.log("Created new conversation:", conversation._id);
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

export { getOrCreateConversation };
