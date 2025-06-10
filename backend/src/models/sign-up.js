import mongoose from "mongoose";

const signupSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    step: {
      type: Number,
      default: 1,
      enum: [1, 2], // 1: email sent, 2: email verified
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL - auto-delete expired docs
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
signupSessionSchema.index({ sessionId: 1, isEmailVerified: 1 });

const SignupSession = mongoose.model("SignupSession", signupSessionSchema);
export default SignupSession;
