# Live Chess (Human-vs-Human) Feature Implementation Guide

This document outlines the architecture, requirements, and step-by-step plan for adding **live chess play** (human-vs-human, real-time) to the Neolink project.

---

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Architecture](#architecture)
- [Backend Implementation](#backend-implementation)
- [Frontend Implementation](#frontend-implementation)
- [Optional Enhancements](#optional-enhancements)
- [References](#references)

---

## Overview

The goal is to enable users to play chess against each other in real time, with move synchronization, game rooms, player assignment, and (optionally) persistence and spectator support.

---

## Requirements

### Functional

- Users can create or join chess games (rooms/lobbies)
- Real-time move synchronization between two players
- Player assignment (white/black)
- Turn management and game state validation
- Game end detection (checkmate, draw, resignation)
- (Optional) Spectator support
- (Optional) Game persistence (ongoing/completed games)

### Technical

- WebSocket-based real-time communication (e.g., Socket.IO)
- Backend models for games and moves
- Secure room management and user authentication
- Frontend integration with backend for live updates

---

## Architecture

### Backend

- **WebSocket Server**: Handles real-time events (join room, move, resign, etc.)
- **Game Model**: Stores game state, players, moves, status
- **Room Management**: Assigns users to games, manages player colors
- **Move Validation**: Ensures only legal moves are accepted
- **Hybrid State Management (Recommended)**: Active games are kept in memory for speed, but all moves and game state are also persisted to the database for reliability and resumability. On disconnect or server restart, games can be restored from the database.
- **Persistence**: Store ongoing and completed games in DB

### Frontend

- **Lobby UI**: List/join/create games
- **Chessboard UI**: Shows live board, move input, timers, player info
- **Socket Client**: Connects to backend, sends/receives events
- **State Management**: Syncs board state, turn, and game status

---

## Backend Implementation

### Hybrid In-Memory + Database Model (Recommended)

- **Active Games in Memory:**
  - When a game is created or joined, its state is loaded into an in-memory store (e.g., a JS Map or Redis).
  - All real-time operations (move validation, turn management) are performed in memory for low latency.
- **Database Persistence:**
  - Every move (or at regular intervals) is also written to the database (e.g., MongoDB).
  - If the server restarts or a player disconnects, the game state can be restored from the database.
  - Completed games are removed from memory but remain in the database for history and analysis.
- **Benefits:**
  - Fast real-time play with reliability and resumability.
  - Scalable to multiple servers (with a shared memory store like Redis).

### 1. Models

- `ChessGame` (Mongoose):
  - `players`: [whiteId, blackId]
  - `moves`: [{from, to, san, timestamp, by}]
  - `status`: ongoing, finished, draw, resigned, etc.
  - `winner`: userId/null
  - `createdAt`, `updatedAt`

### 2. Socket Events

- `createGame` / `joinGame`
- `move` (with move data)
- `resign`, `drawOffer`, `drawAccept`
- `gameOver`
- `spectateGame` (optional)

### 3. Controllers/Handlers

- On game creation/join: load or create game in memory, sync with DB.
- On move: update in-memory state, persist move to DB.
- On disconnect/reconnect: restore game from DB if not in memory.
- On game end: remove from memory, keep in DB.

### 4. REST Endpoints (Optional)

- List active games
- Fetch game history
- Fetch specific game by ID

---

## Frontend Implementation

### 1. Lobby

- List available games (REST or socket event)
- Create/join game buttons

### 2. Chessboard

- Display board using `react-chessboard` or similar
- Show player info, timers, move list
- Send moves via socket
- Receive and apply opponent moves
- Show game status (turn, check, mate, draw, etc.)

### 3. Socket Integration

- Connect/disconnect logic
- Join/leave room
- Handle all relevant events (move, resign, game over, etc.)

---

## Optional Enhancements

- **Spectator Mode**: Allow users to watch ongoing games
- **Persistence**: Save games to DB for history and resuming
- **Rematch/Chat**: Allow rematches or in-game chat
- **Elo/Rating**: Track player ratings
- **Anti-cheat**: Detect engine use or suspicious play

---

## References

- [Socket.IO Docs](https://socket.io/docs/)
- [chess.js](https://github.com/jhlywa/chess.js/)
- [react-chessboard](https://github.com/Clariity/react-chessboard)
- [lichess API](https://lichess.org/api)

---

## Next Steps

1. **Backend**: Implement models, socket server, and event handlers
2. **Frontend**: Build lobby and chessboard UI, integrate sockets
3. **Test**: End-to-end test with two users
4. **Iterate**: Add enhancements as needed

---

## MVP Timeline (1 Week)

**Goal:** Ship a working live chess MVP (human-vs-human, hybrid backend) in 7 days.

### Day 1: Planning & Setup

- Finalize requirements and user stories (lobby, play, persistence, reconnection).
- Design DB schema for `ChessGame`.
- Set up in-memory store (JS Map or Redis).
- Set up basic Socket.IO server scaffolding for chess namespace/events.

### Day 2: Backend – Game Model & REST

- Implement `ChessGame` Mongoose model.
- Create REST endpoints for:
  - Creating a game
  - Listing/joining games
  - Fetching game by ID
- Write utility functions for move validation (using chess.js).

### Day 3: Backend – Real-Time Logic

- Implement Socket.IO events:
  - `createGame`, `joinGame`, `move`, `resign`, `gameOver`
- Integrate hybrid state management:
  - On game start/join, load/create in memory and DB.
  - On move, update both in-memory and DB.
  - On disconnect/reconnect, restore from DB if needed.
- Test backend logic with mock clients.

### Day 4: Frontend – Lobby & Game Room UI

- Build lobby page: list games, create/join buttons.
- Build basic chessboard page (use `react-chessboard`).
- Connect frontend to backend REST endpoints for lobby/game list.

### Day 5: Frontend – Real-Time Play

- Integrate Socket.IO client for chess events.
- Implement move sending/receiving, board updates, turn logic.
- Show player info, game status, and simple move list.

### Day 6: Persistence, Reconnection, and Polish

- Ensure game state persists and can be restored after disconnect/reload.
- Handle edge cases: resign, game over, illegal moves, timeouts.
- Add minimal UI polish: loading states, error handling, basic notifications.

### Day 7: Testing & Buffer

- End-to-end testing with two users (different browsers/devices).
- Fix bugs, polish UX, and write/update documentation.
- Buffer for any spillover or unexpected issues.

**Tips:**

- Prioritize core features: lobby, real-time play, persistence, reconnection.
- Defer extras: spectator mode, chat, advanced UI, rating system.
- Test early and often, especially real-time and reconnection flows.

---

## Updated User Flow & Requirements: One Active Room, Notifications, and Dashboard

### 1. Notification When Opponent Joins

- After creating a room, the user does not have to wait on a "waiting" screen.
- User receives a notification (in-app, push, or email) when another user joins their room.
- Backend emits a real-time event (Socket.IO) or sends a notification when a second player joins.

### 2. Room Dashboard / Room List UI

- User can view their active room at any time (e.g., "My Chess Room" dashboard or tab).
- UI shows room status (waiting, ongoing, finished), join link, and opponent info if joined.

### 3. Restrict to One Active Room/Game Per User

- User cannot create a new room if they already have one open (waiting or ongoing).
- On room creation, backend checks if the user already has an active room. If so, prevent new room creation and direct user to their existing room.

### 4. Each User Can Only Be in One Game at a Time

- If a user tries to join another game while in an active one, prompt them to finish or leave the current game first.
- On join, backend checks if the user is already in a game. If so, block the join and inform the user.

---

### Backend Logic Checklist

- [ ] On room creation, check for existing active room for user.
- [ ] On join, check if user is already in a game.
- [ ] Emit real-time event to creator when opponent joins.
- [ ] Expose endpoint to fetch user's active room(s).

### Frontend Checklist

- [ ] Show "Room Created" screen with info and share options.
- [ ] Add "My Chess Room" dashboard/tab.
- [ ] Listen for real-time notifications (Socket.IO) for opponent join.
- [ ] Prevent creating/joining multiple games at once.

---

_This document will be updated as the feature is developed._
