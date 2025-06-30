import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Snowflake } from "@theinternetfolks/snowflake";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 6,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    handle: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
    },

    stats: {
      posts: {
        type: Number,
        default: 0,
      },
      allies: {
        type: Number,
        default: 0,
      },
      power: {
        type: Number,
        default: 0,
      },
    },

    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      },
    ],

    hasSeenSuggestions: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
    },

    emailVerificationTokenExpires: {
      type: Date,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    participantId: {
      type: String,
      unique: true,
      default: () => Snowflake.generate(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

// Instance method for comparing passwords
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw error;
  }
};

// Now compile the model
const User = mongoose.model("User", userSchema);

export default User;
