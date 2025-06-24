import mongoose from "mongoose";

const chessGameSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeControl: {
      type: String,
      required: true,
    },
    rated: {
      type: Boolean,
      default: false,
    },
    challenger: {
      type: String,
      enum: ["everyone", "ally", "clan"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "aborted"],
      default: "pending",
    },
    opponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    gameId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChessGame = mongoose.model("ChessGame", chessGameSchema);
export default ChessGame;
