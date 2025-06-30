import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      enum: ["cyan", "fuchsia"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
