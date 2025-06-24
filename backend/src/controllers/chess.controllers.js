// Removed createChessRoom controller and ChessRoom import as they are no longer needed.
import { nanoid } from "nanoid";
import User from "../models/User.js";
import ChessRoom from "../models/chessRoom.model.js";

export const acceptChessChallenge = async (req, res) => {
  try {
    const { postId } = req.body; // or req.params, depending on your route
    const opponentId = req.user._id;

    // Find the chess room by post
    const chessRoom = await ChessRoom.findOne({ post: postId });
    if (!chessRoom) {
      return res.status(404).json({ error: "No such challenge on the grid." });
    }

    if (chessRoom.status === "accepted") {
      return res.status(400).json({
        error: "Challenge already jacked in. Find another grid to conquer.",
      });
    }

    chessRoom.status = "accepted";
    chessRoom.opponent = opponentId;
    await chessRoom.save();

    return res.status(200).json({
      message: "Challenge accepted. Time to duel in the neon arena.",
      room: chessRoom,
    });
  } catch (err) {
    console.error("[ChessRoom] Accept error:", err);
    return res.status(500).json({ error: "System overload. Try again later." });
  }
};
