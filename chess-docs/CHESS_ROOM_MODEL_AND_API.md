# ChessRoom Model & Room Creation API

## ChessRoom Model (Mongoose)

Stores metadata for live chess rooms.

### Fields

- `roomId` (String, unique): Unique identifier for the room (e.g., UUID or short code)
- `creator` (ObjectId, ref User): User who created the room
- `status` (String): 'waiting', 'ongoing', or 'finished'
- `gameId` (ObjectId, ref ChessGame, optional): Link to the actual chess game document
- `createdAt`, `updatedAt`: Timestamps

### Example Schema

```js
const chessRoomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true, index: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "ongoing", "finished"],
      default: "waiting",
    },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "ChessGame" },
  },
  { timestamps: true }
);
```

---

## Room Creation API

### Endpoint

- `POST /api/chess/rooms`

### Request Body

- (Authenticated) No body required, or optionally allow custom room options.

### Response

- `roomId`: The unique room identifier
- `joinUrl`: URL to join the room
- `status`: Room status
- `creator`: Creator info

### Example Response

```json
{
  "roomId": "abc123xyz",
  "joinUrl": "/chess/room/abc123xyz",
  "status": "waiting",
  "creator": { "_id": "...", "username": "alice" }
}
```

---

_See backend model for implementation details._
