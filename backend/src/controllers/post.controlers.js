import Post from "../models/post.js";
import Notification from "../models/notifications.js";
import User from "../models/User.js";
import Poll from "../models/poll.model.js";
import mongoose from "mongoose";
import {
  handlePollCreation,
  handleChessChallengeCreation,
  handleMentionProcessing,
} from "../services/post.services.js";

export const createPost = async (req, res) => {
  const session = await mongoose.startSession();
  let committed = false;
  session.startTransaction();

  try {
    const { content, image, poll, chess } = req.body;
    const authorId = req.user._id;

    if (!content && !image && !poll && !chess) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Post cannot be empty." });
    }

    const post = new Post({
      content,
      image: image || null,
      author: authorId,
      hasPoll: !!poll,
      hasChess: !!chess,
    });

    await post.save({ session });

    if (poll) {
      await handlePollCreation(post, poll, authorId, session);
    }

    if (chess) {
      await handleChessChallengeCreation(post, chess, authorId, session);
    }

    if (content) {
      await handleMentionProcessing(post, authorId, session);
    }

    await session.commitTransaction();
    committed = true;

    const completePost = await Post.findById(post._id)
      .populate("author", "username fullName handle")
      .populate({
        path: "poll",
        select: "question options visibility expiresAt totalVotes",
      })
      .populate("chess");

    // Ensure roomId is present in the chess object
    const completePostObj = completePost.toObject();
    if (completePostObj.chess && completePostObj.chess.roomId) {
      completePostObj.chess.roomId = completePostObj.chess.roomId;
    }

    res.status(201).json(completePostObj);
  } catch (err) {
    if (!committed) {
      try {
        await session.abortTransaction();
      } catch (e) {}
    }
    console.error("Post creation error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username name avatar verified handle participantId")
      .populate({
        path: "poll",
        select: "question options visibility expiresAt totalVotes",
        populate: {
          path: "options",
          select: "_id text votes",
        },
      })
      .populate({
        path: "chess",
        select:
          "roomId timeControl rated challenger status createdAt updatedAt post chessPlayers fen moves result",
        populate: [
          {
            path: "chessPlayers.user",
            select: "username name avatar verified handle participantId",
          },
        ],
      })
      .sort({ createdAt: -1 });

    // Ensure roomId is present in the chess object for each post
    const postsWithRoomId = posts.map((post) => {
      const obj = post.toObject();
      if (obj.chess && obj.chess.roomId) {
        obj.chess.roomId = obj.chess.roomId;
      }
      return obj;
    });

    res.json(postsWithRoomId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get posts by the logged-in user
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit a post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.author.equals(req.user._id))
      return res.status(403).json({ message: "Unauthorized" });

    post.content = req.body.content || post.content;
    post.image = req.body.image || post.image;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.author.equals(req.user._id))
      return res.status(403).json({ message: "Unauthorized" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle like or retweet
export const reactToPost = async (req, res) => {
  const { type } = req.body; // "like" or "retweet"
  const userId = req.user._id;

  try {
    const post = await Post.findById(req.params.id).populate("author");
    if (!post) return res.status(404).json({ message: "Post not found" });

    let field;
    if (type === "like") {
      field = "likedBy";
    } else if (type === "retweet") {
      field = "retweetedBy";
    } else {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    const index = post[field].indexOf(userId);
    const isAdding = index === -1;

    if (isAdding) {
      post[field].push(userId);

      // Only send notification if user is not the post author
      if (String(userId) !== String(post.author._id)) {
        await Notification.create({
          userId: post.author._id,
          fromUserId: userId,
          type,
          postId: post._id,
        });

        // TODO: optionally emit socket event for real-time updates or use invalidateQueries
      }
    } else {
      post[field].splice(index, 1);
    }

    // Update the post without updating timestamps
    const updatedPost = await Post.findByIdAndUpdate(
      post._id,
      { [field]: post[field] },
      { new: true, timestamps: false } // `new: true` returns the updated doc
    ).populate("author");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single post by username and post ID
export const getUserPostById = async (req, res) => {
  try {
    const { username, id } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const post = await Post.findOne({ _id: id, author: user._id }).populate(
      "author",
      "username name avatar verified handle participantId"
    );
    if (!post)
      return res.status(404).json({ message: "Post not found for this user" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
