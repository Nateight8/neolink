import Notification from "../models/notifications.js";

export async function getNotifcations(req, res) {
  console.log("GET /api/notifications hit");
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "fromUserId",
        select: "username handle", // only fields we have
      })
      .populate({
        path: "postId",
        select: "content", // adjust to title or body if needed
      });

    const formatted = notifications.map((n) => ({
      id: n._id,
      type: n.type,
      user: {
        name: n.fromUserId?.username || "Unknown",
        handle: n.fromUserId?.handle || "",
        avatar:
          "/placeholder.svg?height=50&width=50&text=" +
          (n.fromUserId?.username?.slice(0, 2).toUpperCase() || "NA"),
      },
      postId: n.postId?._id || null,
      postContent: n.postId?.content || null,
      time: n.createdAt,
      isRead: n.isRead,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
}
