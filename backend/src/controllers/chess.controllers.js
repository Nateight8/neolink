// Removed createChessRoom controller and ChessRoom import as they are no longer needed.
import { nanoid } from "nanoid";
import User from "../models/User.js";
import ChessRoom from "../models/chessRoom.model.js";
import { Chess } from "chess.js";

export const acceptChessChallenge = async (req, res) => {
  try {
    const { postId } = req.body;
    const opponentId = req.user._id;

    // Find the chess room by post
    const chessRoom = await ChessRoom.findOne({ post: postId }).populate({
      path: "chessPlayers.user",
      select: "_id username",
    });
    if (!chessRoom) {
      return res.status(404).json({ error: "No such challenge on the grid." });
    }

    // Find creator
    const creatorPlayer = chessRoom.chessPlayers.find((p) => p.isCreator);
    if (!creatorPlayer) {
      return res.status(400).json({ error: "No creator found for this room." });
    }
    if (creatorPlayer.user._id.toString() === opponentId.toString()) {
      return res.status(400).json({
        error:
          "You can't jack into your own neural challenge. Await a worthy opponent.",
      });
    }

    // Check if opponent already joined
    const opponentPlayer = chessRoom.chessPlayers.find(
      (p) => !p.isCreator && p.user.toString() === opponentId.toString()
    );
    if (opponentPlayer) {
      return res.status(200).json({
        message: "Challenge already accepted by you.",
        room: chessRoom,
      });
    }
    if (chessRoom.chessPlayers.length >= 2) {
      return res.status(400).json({
        error: "Challenge already jacked in. Find another grid to conquer.",
      });
    }

    // Assign colors randomly
    const colors = ["white", "black"];
    const creatorColor = Math.random() < 0.5 ? "white" : "black";
    const opponentColor = creatorColor === "white" ? "black" : "white";
    creatorPlayer.color = creatorColor;
    chessRoom.chessPlayers.push({
      user: opponentId,
      isCreator: false,
      color: opponentColor,
    });
    chessRoom.status = "ongoing";
    await chessRoom.save();
    await chessRoom.populate({
      path: "chessPlayers.user",
      select: "_id username",
    });
    return res.status(200).json({
      message: "Challenge accepted. Time to duel in the neon arena.",
      room: chessRoom,
    });
  } catch (err) {
    console.error("[ChessRoom] Accept error:", err);
    return res.status(500).json({ error: "System overload. Try again later." });
  }
};

export const getChessRoomState = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await ChessRoom.findOne({ roomId }).populate({
      path: "chessPlayers.user",
      select: "_id username",
    });
    if (!room) {
      return res.status(404).json({ error: "Room not found." });
    }
    const roomObj = room.toObject();
    // chessPlayers is already populated
    res.json(roomObj);
  } catch (err) {
    console.error("[ChessRoom] Get state error:", err);
    res.status(500).json({ error: "Failed to fetch room state." });
  }
};

export const makeChessMove = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { from, to, san, fen } = req.body;
    if (!from || !to || !san || !fen) {
      return res.status(400).json({ error: "Missing move data." });
    }
    const room = await ChessRoom.findOne({ roomId }).populate({
      path: "chessPlayers.user",
      select: "_id username",
    });
    if (!room) {
      return res.status(404).json({ error: "Room not found." });
    }
    // Save move
    room.moves.push({ from, to, san, timestamp: new Date() });
    if (room.moves.length === 1) {
      room.status = "ongoing";
    }
    room.fen = fen;
    await room.save();
    await room.populate({ path: "chessPlayers.user", select: "_id username" });
    const roomObj = room.toObject();
    res.json(roomObj);
  } catch (err) {
    console.error("[ChessRoom] Move error:", err);
    res.status(500).json({ error: "Failed to make move." });
  }
};
