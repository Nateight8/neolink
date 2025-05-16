import Notification from "../models/notifications.js";
import Poll from "../models/poll.model.js";
import Post from "../models/post.js";
import User from "../models/User.js";

// Get a specific poll
export const getPoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const userId = req.user._id;

    const poll = await Poll.findById(pollId)
      .populate("creator", "username fullName handle")
      .populate("post");

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Check if user can access this poll
    const canAccess = await poll.canAccess(userId);
    if (!canAccess) {
      return res
        .status(403)
        .json({ message: "You don't have permission to view this poll" });
    }

    // Check if user has already voted
    const hasVoted = poll.hasVoted(userId);

    // Format response based on poll settings
    let response = {
      _id: poll._id,
      question: poll.question,
      creator: poll.creator,
      createdAt: poll.createdAt,
      expiresAt: poll.expiresAt,
      visibility: poll.visibility,
      allowMultipleVotes: poll.allowMultipleVotes,
      totalVotes: poll.totalVotes,
      hasVoted,
      post: poll.post,
    };

    // If user has voted or results are visible before voting, include results
    if (hasVoted || poll.showResultsBeforeVoting) {
      response.results = poll.getResults();
    } else {
      // Otherwise just return the options without vote data
      response.options = poll.options.map((option) => ({
        _id: option._id,
        text: option.text,
      }));
    }

    res.json(response);
  } catch (err) {
    console.error("Get poll error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Vote on a poll
export const votePoll = async (req, res) => {
  try {
    const { optionId } = req.body;
    const pollId = req.params.id;
    const userId = req.user._id;

    if (!optionId) {
      return res.status(400).json({ message: "Option ID is required" });
    }

    const poll = await Poll.findById(pollId).populate(
      "creator",
      "username fullName handle"
    );

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Check if poll has expired
    if (new Date() > new Date(poll.expiresAt)) {
      return res.status(400).json({ message: "This poll has expired" });
    }

    // Check if user can access this poll
    const canAccess = await poll.canAccess(userId);
    if (!canAccess) {
      return res
        .status(403)
        .json({ message: "You don't have permission to vote on this poll" });
    }

    // Find the option index
    const optionIndex = poll.options.findIndex(
      (option) => option._id.toString() === optionId
    );

    if (optionIndex === -1) {
      return res.status(404).json({ message: "Option not found" });
    }

    // Check if user has already voted and multiple votes are not allowed
    if (poll.hasVoted(userId) && !poll.allowMultipleVotes) {
      return res
        .status(400)
        .json({ message: "You have already voted on this poll" });
    }

    // Add the vote
    poll.options[optionIndex].votes.push(userId);
    poll.totalVotes += 1;

    // Create notification for poll creator (if not self-voting)
    if (String(userId) !== String(poll.creator._id)) {
      await Notification.create({
        userId: poll.creator._id,
        fromUserId: userId,
        type: "poll_vote",
        pollId: poll._id,
        postId: poll.post, // If linked to a post
      });
    }

    await poll.save();

    res.json({
      message: "Vote recorded successfully",
      results: poll.getResults(),
    });
  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Remove vote from a poll
export const removeVote = async (req, res) => {
  try {
    const { optionId } = req.body;
    const pollId = req.params.id;
    const userId = req.user._id;

    if (!optionId) {
      return res.status(400).json({ message: "Option ID is required" });
    }

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Find the option
    const option = poll.options.id(optionId);
    if (!option) {
      return res.status(404).json({ message: "Option not found" });
    }

    // Find the user vote
    const voteIndex = option.votes.findIndex(
      (vote) => vote.toString() === userId.toString()
    );

    if (voteIndex === -1) {
      return res
        .status(400)
        .json({ message: "You haven't voted for this option" });
    }

    // Remove the vote
    option.votes.splice(voteIndex, 1);
    poll.totalVotes -= 1;
    await poll.save();

    res.json({
      message: "Vote removed successfully",
      results: poll.getResults(),
    });
  } catch (err) {
    console.error("Remove vote error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get polls by the logged-in user
export const getMyPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ creator: req.user._id })
      .populate("creator", "username fullName handle")
      .sort({ createdAt: -1 });

    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get polls the user can access (public, friends, or own)
export const getAccessiblePolls = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all public polls, polls created by friends, and own polls
    const polls = await Poll.find({
      $or: [
        { visibility: "public" },
        { creator: userId },
        {
          visibility: "friends",
          creator: { $in: user.friends },
        },
      ],
      // Only return polls that haven't expired
      expiresAt: { $gt: new Date() },
    })
      .populate("creator", "username fullName handle")
      .sort({ createdAt: -1 })
      .limit(20); // Limit to prevent too many results

    res.json(polls);
  } catch (err) {
    console.error("Get accessible polls error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a poll
export const deletePoll = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const pollId = req.params.id;
    const userId = req.user._id;

    const poll = await Poll.findById(pollId).session(session);

    if (!poll) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Poll not found" });
    }

    // Check if user is the creator
    if (!poll.creator.equals(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "Unauthorized" });
    }

    // If poll is attached to a post, update the post
    if (poll.post) {
      await Post.findByIdAndUpdate(
        poll.post,
        { $unset: { poll: 1 }, hasPoll: false },
        { session }
      );
    }

    // Delete poll notifications
    await Notification.deleteMany({ pollId }, { session });

    // Delete the poll
    await Poll.findByIdAndDelete(pollId, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Poll deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Delete poll error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update the existing createPost controller function to support polls
export const createPostWithPoll = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { content, image, poll } = req.body;
    const authorId = req.user._id;

    if (!poll) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Poll data is required" });
    }

    // Create the post
    const post = await Post.create(
      [
        {
          content,
          image: image || null,
          author: authorId,
          hasPoll: true,
        },
      ],
      { session }
    );

    // Format options for the database
    const formattedOptions = poll.options.map((option) => ({
      text: option,
      votes: [],
    }));

    // Create the poll
    const newPoll = await Poll.create(
      [
        {
          question: poll.question,
          options: formattedOptions,
          creator: authorId,
          post: post[0]._id,
          visibility: poll.visibility || "public",
          showResultsBeforeVoting: poll.showResultsBeforeVoting || false,
          anonymousVoting: poll.anonymousVoting || false,
          allowMultipleVotes: poll.allowMultipleVotes || false,
          expiresAt: poll.expiresAt ? new Date(poll.expiresAt) : undefined,
        },
      ],
      { session }
    );

    // Update the post with the poll reference
    post[0].poll = newPoll[0]._id;
    await post[0].save({ session });

    // Process mentions (same as in your original controller)
    const mentionPattern = /@([a-zA-Z0-9_]+)/g;
    const mentions = [...content.matchAll(mentionPattern)].map(
      (match) => match[1]
    );

    if (mentions.length > 0) {
      const mentionedUsers = await User.find({
        $or: [
          { username: { $in: mentions.map((m) => new RegExp(`^${m}$`, "i")) } },
          { handle: { $in: mentions.map((m) => new RegExp(`^${m}$`, "i")) } },
        ],
      }).session(session);

      const notifications = mentionedUsers
        .filter((user) => String(user._id) !== String(authorId))
        .map((user) => ({
          userId: user._id,
          fromUserId: authorId,
          type: "mention",
          postId: post[0]._id,
        }));

      if (notifications.length) {
        await Notification.insertMany(notifications, { session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    // Return the complete post with poll
    const completePost = await Post.findById(post[0]._id)
      .populate("author", "username fullName handle")
      .populate({
        path: "poll",
        select: "question options visibility expiresAt",
      });

    res.status(201).json(completePost);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Post with poll creation error:", err);
    res.status(500).json({ message: err.message });
  }
};
