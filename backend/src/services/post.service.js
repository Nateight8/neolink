import Post from "../models/post.js";

/**
 * Get posts, optionally filtered by authorId
 * @param {Object} options
 * @param {string} [options.authorId] - Optional author ID to filter posts
 * @returns {Promise<Array>} Array of posts
 */
export async function getPosts({ authorId } = {}) {
  const query = authorId ? { author: authorId } : {};
  return Post.find(query)
    .sort({ createdAt: -1 })
    .populate("author", "username handle fullName avatar")
    .select(
      "_id content image createdAt likes comments author likedBy poll hasPoll hasChess chess"
    )
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
    .lean();
}
