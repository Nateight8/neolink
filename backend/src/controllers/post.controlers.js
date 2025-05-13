import Post from "../models/post.js";
import Notification from "../models/notifications.js";
import User from "../models/User.js";

// Create a post
export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const authorId = req.user._id;

    // 1. Create the post
    const post = await Post.create({
      content,
      image: image || null,
      author: authorId,
    });

    // 2. Extract mentions from content using regex
    const mentionPattern = /@([a-zA-Z0-9_]+)/g;
    const mentions = [...content.matchAll(mentionPattern)].map(
      (match) => match[1]
    );

    // 3. Find mentioned users by username or handle
    if (mentions.length > 0) {
      const mentionedUsers = await User.find({
        $or: [
          { username: { $in: mentions.map((m) => new RegExp(`^${m}$`, "i")) } },
          { handle: { $in: mentions.map((m) => new RegExp(`^${m}$`, "i")) } },
        ],
      });

      // 4. Create a notification for each user (excluding the post author)
      const notifications = mentionedUsers
        .filter((user) => String(user._id) !== String(authorId))
        .map((user) => ({
          userId: user._id,
          fromUserId: authorId,
          type: "mention",
          postId: post._id,
        }));

      if (notifications.length) {
        await Notification.insertMany(notifications);
        // Optionally emit socket events here
      }
    }

    res.status(201).json(post);
  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username name avatar verified")
      .sort({ createdAt: -1 });

    res.json(posts);
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

        // TODO: optionally emit socket event for real-time updates
      }
    } else {
      post[field].splice(index, 1);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
