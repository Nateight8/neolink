import mongoose from "mongoose";

const chessRoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "waiting",
        "ongoing",
        "finished",
        "pending",
        "accepted",
        "completed",
        "aborted",
      ],
      default: "waiting",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: false,
    },
    timeControl: {
      type: String,
      required: false,
    },
    rated: {
      type: Boolean,
      default: false,
    },
    challenger: {
      type: String,
      enum: ["everyone", "ally", "clan"],
      required: false,
    },
    opponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    white: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    black: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    moves: [
      {
        from: { type: String, required: true },
        to: { type: String, required: true },
        san: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    fen: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const ChessRoom = mongoose.model("ChessRoom", chessRoomSchema);
export default ChessRoom;
