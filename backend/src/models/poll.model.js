import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        votes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    // Link to a post if the poll is attached to one
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      default: function () {
        // Default to 7 days from creation
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
      },
    },
    // Privacy settings
    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
    // Whether the poll results are visible to voters before voting
    showResultsBeforeVoting: {
      type: Boolean,
      default: false,
    },
    // Whether voters can see who voted for which option
    anonymousVoting: {
      type: Boolean,
      default: false,
    },
    // Whether users can select multiple options
    allowMultipleVotes: {
      type: Boolean,
      default: false,
    },
    // Total number of votes cast (for quick access)
    totalVotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if a user has already voted on this poll
pollSchema.methods.hasVoted = function (userId) {
  for (const option of this.options) {
    if (option.votes.includes(userId)) {
      return true;
    }
  }
  return false;
};

// Method to check if a user can access this poll
pollSchema.methods.canAccess = async function (userId) {
  // Public polls are accessible to everyone
  if (this.visibility === "public") return true;

  // Creator can always access their own polls
  if (this.creator.toString() === userId.toString()) return true;

  // For friend-only polls, check if the user is a friend of the creator
  if (this.visibility === "friends") {
    const User = mongoose.model("User");
    const creator = await User.findById(this.creator);
    return creator && creator.friends.includes(userId);
  }

  // Private polls are only accessible to the creator
  return false;
};

// Method to add a vote to an option
pollSchema.methods.addVote = function (userId, optionIndex) {
  // If user has already voted and multiple votes are not allowed, return false
  if (this.hasVoted(userId) && !this.allowMultipleVotes) {
    return false;
  }

  // Add vote to the option
  this.options[optionIndex].votes.push(userId);
  this.totalVotes += 1;
  return true;
};

// Method to remove a vote from an option
pollSchema.methods.removeVote = function (userId, optionIndex) {
  const optionVotes = this.options[optionIndex].votes;
  const userIndex = optionVotes.findIndex(
    (id) => id.toString() === userId.toString()
  );

  if (userIndex !== -1) {
    optionVotes.splice(userIndex, 1);
    this.totalVotes -= 1;
    return true;
  }

  return false;
};

// Method to get poll results
pollSchema.methods.getResults = function () {
  return this.options.map((option) => ({
    text: option.text,
    voteCount: option.votes.length,
    percentage:
      this.totalVotes > 0 ? (option.votes.length / this.totalVotes) * 100 : 0,
    voters: this.anonymousVoting ? [] : option.votes,
  }));
};

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;
