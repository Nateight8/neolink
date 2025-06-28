// Removed createChessRoom controller and ChessRoom import as they are no longer needed.
import { nanoid } from "nanoid";
import User from "../models/User.js";
import ChessRoom from "../models/chessRoom.model.js";
import { Chess } from "chess.js";
import { getGameOverResult } from "../services/chess.service.js";

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
      // If the user is the creator, just return the room (no error)
      return res.status(200).json({
        message: "You are the creator of this challenge.",
        room: chessRoom,
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
      // If the user is already a player, let them in
      const isPlayer = chessRoom.chessPlayers.some(
        (p) =>
          p.user._id.toString() === opponentId.toString() ||
          p.user.toString() === opponentId.toString()
      );
      if (isPlayer) {
        return res.status(200).json({
          message: "You are already a player in this challenge.",
          room: chessRoom,
        });
      }
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

    // If status is ongoing, check if the FEN is actually game over
    if (room.status === "ongoing") {
      const result = getGameOverResult(
        room.fen,
        room.chessPlayers,
        room.createdAt
      );
      if (result) {
        room.status = "finished";
        room.result = result;
        await room.save();
      }
    }

    const roomObj = room.toObject();
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
    console.log("[makeChessMove] Incoming move:", {
      roomId,
      from,
      to,
      san,
      fen,
    });
    if (!from || !to || !san || !fen) {
      console.error("[makeChessMove] Missing move data", {
        from,
        to,
        san,
        fen,
      });
      return res.status(400).json({
        error: "Missing move data. All of from, to, san, and fen are required.",
      });
    }
    const room = await ChessRoom.findOne({ roomId }).populate({
      path: "chessPlayers.user",
      select: "_id username",
    });
    if (!room) {
      console.error(`[makeChessMove] Room not found for roomId: ${roomId}`);
      return res
        .status(404)
        .json({ error: `Room not found for roomId: ${roomId}` });
    }
    // Save move
    room.moves.push({ from, to, san, timestamp: new Date() });
    if (room.moves.length === 1) {
      room.status = "ongoing";
    }
    room.fen = fen;

    // Use chess.js and the new FEN to check for game over
    const result = getGameOverResult(fen, room.chessPlayers, room.createdAt);
    if (result) {
      room.status = "finished";
      room.result = result;
      //we should update the user table here with xp,wins and lost also add these fields to user model
      //create an xp service. for now,
    }
    await room.save();
    await room.populate({ path: "chessPlayers.user", select: "_id username" });
    const roomObj = room.toObject();
    res.json(roomObj);
  } catch (err) {
    console.error("[ChessRoom] Move error:", err);
    res
      .status(500)
      .json({ error: "Failed to make move.", details: err?.message || err });
  }
};
