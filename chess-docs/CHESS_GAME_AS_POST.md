# Chess Game Creation as a Special Post

## Overview

Chess game creation will be treated as a special kind of post in the social feed. Instead of a separate lobby or modal, users will create a chess room through the existing "create post" modal. This approach unifies game invitations and social activity, making chess games more discoverable and integrated with the main feed.

## Flow

1. **Create Post Modal**

   - The modal for creating a new post will now support two modes:
     - Regular text/media post (default)
     - Chess game invitation (special post)

2. **Play Game Button**

   - The "Create AR Post" button is replaced with a "Play Game" button.
   - Clicking "Play Game" toggles the modal between the regular input field and the chess room creation UI.

3. **Chess Room Creation UI**

   - When toggled, the modal displays the chess room creation interface (time control, rated/casual, invite/open challenge, etc.).
   - On submission, a chess room is created and a special post is published to the feed, containing the room link and game details.

4. **Feed Integration**
   - Chess game posts appear in the main feed, making it easy for users to discover and join games.
   - Users can interact with these posts (join, comment, share) like any other post.

## Rationale

- **Unified Experience:** Game invites and social posts are managed in one place.
- **Discoverability:** Chess games are visible in the main feed, increasing engagement.
- **Simplicity:** No need for a separate lobby or navigation; everything happens through the familiar post creation flow.

## Next Steps

- Refactor the create post modal to support toggling between regular and chess game post modes.
- Implement the chess room creation UI within the modal.
- Ensure chess game posts are rendered with appropriate join/interact options in the feed.
