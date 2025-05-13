import express from "express";
import Notification from "../models/notifications.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getNotifications } from "../controllers/notifications.js";

const notificationRoute = express.Router();
notificationRoute.use(authMiddleware);
/**
 * @route   POST /api/notifications
 * @desc    Create a new notification
 * @body    { userId, fromUserId, type, postId? }
 */
notificationRoute.post("/", async (req, res) => {
  try {
    const { userId, fromUserId, type, postId } = req.body;

    if (!userId || !fromUserId || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const notification = await Notification.create({
      userId,
      fromUserId,
      type,
      postId: postId || null,
    });

    // TODO:emit a WebSocket event here if needed
    return res.status(201).json(notification);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for the authenticated user
 */
notificationRoute.get("/", getNotifications);
/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a single notification as read
 */
notificationRoute.patch("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route   PATCH /api/notifications/:userId/read-all
 * @desc    Mark all notifications as read for a user
 */
notificationRoute.patch(
  "/:userId/read-all",

  async (req, res) => {
    try {
      const { userId } = req.params;

      const result = await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );

      return res.status(200).json({
        message: `Marked ${result.modifiedCount} notifications as read.`,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }
);

export default notificationRoute;
