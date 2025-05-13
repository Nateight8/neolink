import Post from "../models/post.js";
import Notification from "../models/notifications.js";

// Create a post
export const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      image: req.body.image || null,
      author: req.user._id,
    });
    res.status(201).json(post);
  } catch (err) {
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
