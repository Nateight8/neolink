import Notification from "../models/notifications.js";

export async function getNotifications(req, res) {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "fromUserId",
        select: "username handle",
      })
      .populate({
        path: "postId",
        select: "content",
      });

    notifications[0].id;

    const formatted = notifications.map((n) => ({
      id: n._id,
      type: n.type,
      user: {
        _id: n.fromUserId?._id,
        name: n.fromUserId?.username || "Unknown",
        handle: n.fromUserId?.handle || "",
        avatar:
          "/placeholder.svg?height=50&width=50&text=" +
          (n.fromUserId?.username?.slice(0, 2).toUpperCase() || "NA"),
      },
      postId: n.postId?._id || null,
      postContent: n.postId?.content || null,
      requestId: n.requestId, // Include the friend request ID
      time: n.createdAt,
      isRead: n.isRead,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}

export async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({
      _id: id,
      userId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}
