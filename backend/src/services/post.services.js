import mongoose from "mongoose";
import Poll from "../models/poll.model.js";
import User from "../models/User.js";
import Notification from "../models/notifications.js";
import ChessRoom from "../models/chessRoom.model.js";
import { nanoid } from "nanoid";

export const handlePollCreation = async (post, pollData, authorId, session) => {
  if (!pollData) return;

  const formattedOptions = (pollData.options || []).map((option) => ({
    text: option,
    votes: [],
  }));

  const newPoll = await Poll.create(
    [
      {
        question: pollData.question || post.content,
        options: formattedOptions,
        creator: authorId,
        post: post._id,
        visibility: pollData.visibility || "public",
        showResultsBeforeVoting: pollData.showResultsBeforeVoting || false,
        anonymousVoting: pollData.anonymousVoting || false,
        allowMultipleVotes: pollData.allowMultipleVotes || false,
        expiresAt: pollData.expiresAt
          ? new Date(pollData.expiresAt)
          : undefined,
      },
    ],
    { session }
  );

  post.poll = newPoll[0]._id;
  await post.save({ session });
};

export const handleChessChallengeCreation = async (
  post,
  chessData,
  authorId,
  session
) => {
  if (!chessData) return;

  const id = `CHZ-${nanoid(6)}`;
  const newChessRoom = await ChessRoom.create(
    [
      {
        ...chessData,
        chessPlayers: [
          {
            user: authorId,
            isCreator: true,
            color: "white", // default, will be randomized on accept
          },
        ],
        post: post._id,
        roomId: id,
      },
    ],
    { session }
  );

  post.chess = newChessRoom[0]._id;
  await post.save({ session });
};

export const handleMentionProcessing = async (post, authorId, session) => {
  if (!post.content) return;

  const mentionPattern = /@([a-zA-Z0-9_]+)/g;
  const mentions = [...post.content.matchAll(mentionPattern)].map((m) => m[1]);

  if (mentions.length > 0) {
    const mentionedUsers = await User.find({
      username: { $in: mentions.map((m) => new RegExp(`^${m}$`, "i")) },
    }).session(session);

    const notifications = mentionedUsers
      .filter((user) => String(user._id) !== String(authorId))
      .map((user) => ({
        userId: user._id,
        fromUserId: authorId,
        type: "mention",
        postId: post._id,
      }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications, { session });
    }
  }
};
