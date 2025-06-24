import ChessRoom from "../models/chessRoom.model.js";
import { nanoid } from "nanoid";
import User from "../models/User.js";

// POST /api/chess/rooms
export const createChessRoom = async (req, res) => {
  try {
    // Generate a unique roomId with CHESS prefix and 6-char NanoID
    const roomId = `CHESS${nanoid(6)}`;
    const creatorId = req.user._id;

    // Create the room in DB
    const room = await ChessRoom.create({
      roomId,
      creator: creatorId,
      status: "waiting",
    });

    // populate creator info for response
    const creator = await User.findById(creatorId).select("_id username");

    res.status(201).json({
      roomId: room.roomId,
      joinUrl: `/chess/room/${room.roomId}`,
      status: room.status,
      creator,
    });
  } catch (err) {
    console.error("[ChessRoom] Create error:", err);
    res.status(500).json({ error: "Failed to create chess room" });
  }
};
