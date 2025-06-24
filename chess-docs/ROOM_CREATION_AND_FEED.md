# Chess Room Creation & Feed Integration – Initial Plan

## User Flow

1. **Create Room:**
   - User can create a chess room (for human-vs-human play) from the lobby.
2. **Share Room:**
   - After creation, the user can share the room link (or room info) on the main feed.
   - This could be automatic (room is posted to the feed by default) or manual (user chooses to share).
3. **Feed Tab:**
   - There will be a dedicated tab or section in the feed UI for chess rooms/games, making it easy for users to discover and join active games.

---

## Design/Implementation Notes

- **Room Creation:**
  - On creation, generate a unique room ID (UUID or short code).
  - Store room info in DB and in-memory store.
- **Sharing:**
  - If automatic: trigger a feed post with room details (creator, time, join link).
  - If manual: show a "Share to Feed" button after room creation.
- **Feed UI:**
  - Add a "Chess" or "Games" tab to the feed.
  - Display active/joinable rooms with creator info, time, and join button.
- **Room Link:**
  - Clicking the link or "Join" button takes the user directly to the chess game room.

---

## Open Questions / Decisions

- Should sharing to the feed be **automatic** or **user-initiated**?
- Should rooms expire after a certain time if not joined?
- Should you allow spectators to join from the feed?

---

## Next Steps

- Finalize sharing logic (automatic vs. manual).
- Design the feed tab UI for chess rooms.
- Implement backend logic for room creation and sharing.
- Update frontend to support the new tab and sharing flow.
