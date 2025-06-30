# Profile Data Structure (MVP)

This document outlines the data structure for user profiles in the MVP version of the application.

## Core Profile Data

```typescript
interface UserProfile {
  // Core Identity
  _id: string; // Unique identifier
  username: string; // Display name (e.g., "CYBER_USER")
  handle: string; // @handle (e.g., "@cyber_user123")
  fullName?: string; // For avatar fallback
  email?: string; // For account management
  avatar?: string; // URL to profile picture
  banner?: string; // URL to banner image
  bio?: string; // User's bio text
  location?: string; // User's location
  website?: string; // Personal website URL
  joinedDate: string; // ISO date string

  // Stats
  stats: {
    posts: number; // Number of posts
    allies: number; // Number of allies (mutual connections)
    power: number; // User's power/level score
  };

  // Authentication
  participantId: string; // Used for messaging/chat

  // Status
  isOnline: boolean; // Online status
  lastSeen: string; // Last active timestamp (ISO)

  // Metadata
  createdAt: string; // Account creation date (ISO)
  updatedAt: string; // Last update date (ISO)
}
```

## Allies Data

```typescript
interface Ally {
  _id: string;
  username: string;
  handle: string;
  avatar?: string;
  fullName?: string;
  isOnline: boolean;
  lastSeen: string;
}
```

## Achievements Data

```typescript
interface Achievement {
  _id: string;
  name: string; // e.g., "NEURAL HACKER"
  icon: string; // Emoji or icon code
  level: number; // Current level
  color: "cyan" | "fuchsia"; // Color theme
  unlockedAt: string; // When achieved (ISO date)
}
```

## Example Data

```typescript
const exampleUser: UserProfile = {
  _id: "507f1f77bcf86cd799439011",
  username: "CYBER_USER",
  handle: "@cyber_user123",
  fullName: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=128&width=128",
  banner: "/banner-placeholder.svg",
  bio: "⚡ EXPLORING THE DIGITAL FRONTIER ⚡",
  location: "Neo-Tokyo",
  website: "https://cyber-user.example",
  joinedDate: "2023-01-15T00:00:00Z",

  stats: {
    posts: 248,
    allies: 12400, // 12.4K
    power: 342,
  },

  participantId: "usr_507f1f77bcf86cd799439011",
  isOnline: true,
  lastSeen: new Date().toISOString(),

  createdAt: "2023-01-15T00:00:00Z",
  updatedAt: new Date().toISOString(),
};
```

## UI Implementation Notes

1. **Profile Header**:

   - Uses `avatar`, `username`, `handle`
   - Shows edit/logout buttons based on `isLoggedInUser`

2. **Stats Section**:

   - Displays `stats.posts`, `stats.allies`, `stats.power`
   - Format large numbers (e.g., 12400 → "12.4K")

3. **Bio Section**:

   - Shows `bio` text
   - Future: May include `location` and `website`

4. **Tabs**:
   - Posts: Fetched separately via `Posts` component
   - Allies: Lists user's allies
   - Achievements: Shows unlocked achievements
