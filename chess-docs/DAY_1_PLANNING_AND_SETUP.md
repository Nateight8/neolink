# Day 1: Planning & Setup – Live Chess MVP

This document outlines the planning and setup tasks for Day 1 of the live chess MVP implementation.

---

## 1. Finalize Requirements & User Stories

### Core User Stories

- **Lobby:** Users can see a list of available games, create a new game, or join an existing one.
- **Game Room:** Two users can play chess in real time, with move synchronization.
- **Persistence:** Games are not lost on server restart; users can reconnect and resume.
- **Reconnection:** If a player disconnects, they can rejoin the game.
- **(Optional for MVP) Spectator Mode:** Others can watch ongoing games.

_Write these as user stories or acceptance criteria in your project management tool if needed._

---

## 2. Design DB Schema for `ChessGame`

Draft schema (Mongoose example):

```js
const ChessGameSchema = new mongoose.Schema({
  players: {
    white: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    black: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  moves: [
    {
      from: String,
      to: String,
      san: String,
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      timestamp: Date,
    },
  ],
  status: {
    type: String,
    enum: ["waiting", "ongoing", "finished", "draw", "resigned"],
    default: "waiting",
  },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

_Adjust as needed for your stack and features._

---

## 3. Set Up In-Memory Store

- For MVP, use a simple JS `Map` in your backend to hold active games:
  ```js
  // Example: global or module-level
  const activeGames = new Map(); // key: gameId, value: game state object
  ```
- For future scalability, consider Redis, but for MVP, a JS Map is sufficient.

---

## 4. Set Up Socket.IO Server Scaffolding

- Add a new namespace or event group for chess games.
- Example (in your backend entry point):

```js
io.on('connection', (socket) => {
  socket.on('chess:createGame', ...);
  socket.on('chess:joinGame', ...);
  socket.on('chess:move', ...);
  // etc.
});
```

- Ensure CORS and authentication are set up for sockets.

---

## 5. (Optional) Create Initial API Route Placeholders

- `/api/chess/games` (GET: list, POST: create)
- `/api/chess/games/:id` (GET: fetch by ID)

---

## Deliverables for Day 1

- Written requirements/user stories (in README, Notion, Jira, etc.)
- Drafted `ChessGame` schema
- In-memory store initialized in backend
- Socket.IO server with chess event scaffolding
- (Optional) API route placeholders
