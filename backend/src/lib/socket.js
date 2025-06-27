import { Server as SocketIOServer } from "socket.io";

export const io = new SocketIOServer();

export const initializeSocket = (server) => {
  io.attach(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://neolink-2.onrender.com",
        process.env.CORS_ORIGIN,
        /https?:\/\/neolink-[a-z0-9-]+\.vercel\.app$/,
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
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
  });
};
