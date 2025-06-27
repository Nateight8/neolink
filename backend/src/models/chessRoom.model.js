import mongoose from "mongoose";

const chessRoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    chessPlayers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        isCreator: { type: Boolean, required: true },
        color: { type: String, enum: ["white", "black"], required: true },
      },
    ],
    status: {
      type: String,
      enum: ["waiting", "ongoing", "finished", "aborted"],
      default: "waiting",
    },
    result: {
      status: { type: String, enum: ["win", "draw"] },
      reason: {
        type: String,
        enum: [
          "checkmate",
          "timeout",
          "resignation",
          "stalemate",
          "threefold_repetition",
          "insufficient_material",
          "agreement",
          "abandonment",
        ],
      },
      winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      ended: { type: Date },
      duration: { type: Number }, // in seconds
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
      default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    },
  },
  {
    timestamps: true,
  }
);

const ChessRoom = mongoose.model("ChessRoom", chessRoomSchema);
export default ChessRoom;
