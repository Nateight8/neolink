// Removed createChessRoom controller and ChessRoom import as they are no longer needed.
import { nanoid } from "nanoid";
import User from "../models/User.js";
import ChessRoom from "../models/chessRoom.model.js";
import { Chess } from "chess.js";

export const acceptChessChallenge = async (req, res) => {
  try {
    const { postId } = req.body; // or req.params, depending on your route
    const opponentId = req.user._id;

    // Find the chess room by post
    const chessRoom = await ChessRoom.findOne({ post: postId });
    if (!chessRoom) {
      return res.status(404).json({ error: "No such challenge on the grid." });
    }

    if (chessRoom.creator.toString() === opponentId.toString()) {
      return res.status(400).json({
        error:
          "You can't jack into your own neural challenge. Await a worthy opponent.",
      });
    }

    if (chessRoom.status === "accepted") {
      return res.status(400).json({
        error: "Challenge already jacked in. Find another grid to conquer.",
      });
    }

    chessRoom.status = "accepted";
    chessRoom.opponent = opponentId;

    // Assign white and black randomly
    if (!chessRoom.white && !chessRoom.black) {
      if (Math.random() < 0.5) {
        chessRoom.white = chessRoom.creator;
        chessRoom.black = opponentId;
      } else {
        chessRoom.white = opponentId;
        chessRoom.black = chessRoom.creator;
      }
    }

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

export const getChessRoomState = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await ChessRoom.findOne({ roomId })
      .populate("creator", "_id username")
      .populate("opponent", "_id username")
      .populate("white", "_id username")
      .populate("black", "_id username");
    if (!room) {
      return res.status(404).json({ error: "Room not found." });
    }
    const roomObj = room.toObject();
    delete roomObj.opponent;
    delete roomObj.white;
    delete roomObj.black;
    const chessPlayers = [
      {
        _id: room.creator._id,
        username: room.creator.username,
        role: "creator",
        color:
          room.white && room.white._id.equals(room.creator._id)
            ? "white"
            : "black",
      },
      room.creator._id !== room.white._id || room.creator._id !== room.black._id
        ? {
            _id: room.opponent?._id,
            username: room.opponent?.username,
            role: "opponent",
            color:
              room.white && room.white._id.equals(room.opponent?._id)
                ? "white"
                : "black",
          }
        : null,
    ].filter(Boolean);
    roomObj.chessPlayers = chessPlayers;
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
    const room = await ChessRoom.findOne({ roomId })
      .populate("creator", "_id username")
      .populate("opponent", "_id username")
      .populate("white", "_id username")
      .populate("black", "_id username");
    if (!room) {
      return res.status(404).json({ error: "Room not found." });
    }
    // Optionally: validate move legality with chess.js
    // const chess = new Chess(room.fen || undefined);
    // if (!chess.move({ from, to, san })) {
    //   return res.status(400).json({ error: "Illegal move." });
    // }
    // Save move
    room.moves.push({ from, to, san, timestamp: new Date() });
    room.fen = fen;
    await room.save();
    // Prepare response without opponent, white, black
    const roomObj = room.toObject();
    delete roomObj.opponent;
    delete roomObj.white;
    delete roomObj.black;
    // Rebuild chessPlayers array
    const chessPlayers = [
      {
        _id: room.creator._id,
        username: room.creator.username,
        role: "creator",
        color:
          room.white && room.white._id.equals(room.creator._id)
            ? "white"
            : "black",
      },
      room.creator._id !== room.white._id || room.creator._id !== room.black._id
        ? {
            _id: room.opponent?._id,
            username: room.opponent?.username,
            role: "opponent",
            color:
              room.white && room.white._id.equals(room.opponent?._id)
                ? "white"
                : "black",
          }
        : null,
    ].filter(Boolean);
    roomObj.chessPlayers = chessPlayers;
    res.json(roomObj);
  } catch (err) {
    console.error("[ChessRoom] Move error:", err);
    res.status(500).json({ error: "Failed to make move." });
  }
};
