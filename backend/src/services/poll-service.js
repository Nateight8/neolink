// pollService.js - Business logic layer for polls
import Poll from "../models/Poll.js";
import Post from "../models/post.js";
import User from "../models/User.js";
import Notification from "../models/notifications.js";
import mongoose from "mongoose";

/**
 * Creates a standalone poll
 * @param {Object} pollData - Poll data (question, options, settings)
 * @param {String} creatorId - User ID creating the poll
 * @param {mongoose.ClientSession} session - MongoDB session for transactions
 * @returns {Promise<Object>} Created poll
 */
export const createStandalonePoll = async (pollData, creatorId, session) => {
  const {
    question,
    options,
    visibility = "public",
    expiresAt,
    showResultsBeforeVoting = false,
    anonymousVoting = false,
    allowMultipleVotes = false,
  } = pollData;

  // Format options for the database
  const formattedOptions = options.map((option) => ({
    text: option,
    votes: [],
  }));

  // Create the poll
  const poll = await Poll.create(
    [
      {
        question,
        options: formattedOptions,
        creator: creatorId,
        visibility,
        showResultsBeforeVoting,
        anonymousVoting,
        allowMultipleVotes,
        ...(expiresAt && { expiresAt: new Date(expiresAt) }),
      },
    ],
    { session }
  );

  return poll[0];
};

/**
 * Creates a poll with an associated post
 * @param {Object} postData - Post data (content, image)
 * @param {Object} pollData - Poll data (question, options, settings)
 * @param {String} authorId - User ID creating the post and poll
 * @param {mongoose.ClientSession} session - MongoDB session for transactions
 * @returns {Promise<Object>} Object containing created post and poll
 */
export const createPollWithPost = async (
  postData,
  pollData,
  authorId,
  session
) => {
  // Create the post
  const post = await Post.create(
    [
      {
        content: postData.content,
        image: postData.image || null,
        author: authorId,
        hasPoll: true,
      },
    ],
    { session }
  );

  // Create the poll
  const poll = await createStandalonePoll({ ...pollData }, authorId, session);

  // Link the poll to the post
  poll.post = post[0]._id;
  await poll.save({ session });

  // Link the post to the poll
  post[0].poll = poll._id;
  await post[0].save({ session });

  return { post: post[0], poll };
};

/**
 * Process mentions in content and create notifications
 * @param {String} content - Content to process for mentions
 * @param {String} authorId - Author of the content
 * @param {String} postId - ID of the post containing mentions
 * @param {mongoose.ClientSession} session - MongoDB session for transactions
 * @returns {Promise<void>}
 */
export const processMentions = async (content, authorId, postId, session) => {
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
        postId,
      }));

    if (notifications.length) {
      await Notification.insertMany(notifications, { session });
    }
  }
};

/**
 * Record a vote on a poll option
 * @param {String} pollId - Poll ID
 * @param {String} optionId - Option ID
 * @param {String} userId - User ID voting
 * @returns {Promise<Object>} Updated poll with vote recorded
 */
export const recordVote = async (pollId, optionId, userId) => {
  const poll = await Poll.findById(pollId).populate(
    "creator",
    "username fullName handle"
  );

  if (!poll) {
    throw new Error("Poll not found");
  }

  // Check if poll has expired
  if (new Date() > new Date(poll.expiresAt)) {
    throw new Error("This poll has expired");
  }

  // Find the option index
  const optionIndex = poll.options.findIndex(
    (option) => option._id.toString() === optionId
  );

  if (optionIndex === -1) {
    throw new Error("Option not found");
  }

  // Check if user has already voted and multiple votes are not allowed
  if (poll.hasVoted(userId) && !poll.allowMultipleVotes) {
    throw new Error("You have already voted on this poll");
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
  return poll;
};

/**
 * Remove a vote from a poll option
 * @param {String} pollId - Poll ID
 * @param {String} optionId - Option ID
 * @param {String} userId - User ID removing vote
 * @returns {Promise<Object>} Updated poll with vote removed
 */
export const removeVoteFromPoll = async (pollId, optionId, userId) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new Error("Poll not found");
  }

  // Find the option
  const option = poll.options.id(optionId);
  if (!option) {
    throw new Error("Option not found");
  }

  // Find the user vote
  const voteIndex = option.votes.findIndex(
    (vote) => vote.toString() === userId.toString()
  );

  if (voteIndex === -1) {
    throw new Error("You haven't voted for this option");
  }

  // Remove the vote
  option.votes.splice(voteIndex, 1);
  poll.totalVotes -= 1;
  await poll.save();

  return poll;
};

/**
 * Delete a poll and clean up related data
 * @param {String} pollId - Poll ID
 * @param {String} userId - User ID attempting to delete
 * @param {mongoose.ClientSession} session - MongoDB session for transactions
 * @returns {Promise<void>}
 */
export const deletePollAndCleanup = async (pollId, userId, session) => {
  const poll = await Poll.findById(pollId).session(session);

  if (!poll) {
    throw new Error("Poll not found");
  }

  // Check if user is the creator
  if (!poll.creator.equals(userId)) {
    throw new Error("Unauthorized");
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
};
