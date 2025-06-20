import sanitizeHtml from "sanitize-html";
import mongoose from "mongoose";

export const validateMessage = (req, res, next) => {
  const { content, messageType = "text", replyToId } = req.body;

  // Content validation
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return res.status(400).json({ error: "Message content is required" });
  }

  if (content.length > 2000) {
    return res
      .status(400)
      .json({ error: "Message too long (max 2000 characters)" });
  }

  // Message type validation
  const validTypes = ["text", "image", "file", "audio"];
  if (!validTypes.includes(messageType)) {
    return res.status(400).json({ error: "Invalid message type" });
  }

  // Sanitize content (prevent XSS)
  req.body.content = sanitizeHtml(content.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });

  // Validate replyToId if provided
  if (replyToId && !mongoose.Types.ObjectId.isValid(replyToId)) {
    return res.status(400).json({ error: "Invalid reply message ID" });
  }

  // File validation (if files are attached)
  if (req.files && req.files.length > 0) {
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "audio/mpeg",
      "audio/wav",
    ];

    for (const file of req.files) {
      if (file.size > maxFileSize) {
        return res.status(400).json({
          error: `File "${file.originalname}" is too large (max 10MB)`,
        });
      }

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error: `File type "${file.mimetype}" is not allowed`,
        });
      }
    }

    // Limit number of attachments
    if (req.files.length > 5) {
      return res.status(400).json({ error: "Too many attachments (max 5)" });
    }
  }

  next();
};
