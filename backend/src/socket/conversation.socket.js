// Socket.IO conversation and typing event handlers
export function registerConversationSocketHandlers(io, socket) {
  // Join a conversation room
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  // Handle typing indicators
  socket.on("typing", (conversationId) => {
    socket.broadcast.to(conversationId).emit("isTyping");
  });

  socket.on("stopTyping", (conversationId) => {
    socket.broadcast.to(conversationId).emit("isNotTyping");
  });
}
