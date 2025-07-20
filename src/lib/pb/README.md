# Watchlist Collections

This document describes the new PocketBase collection structure to support watchlists, user follows, and social features in the movie app.

## Collections Overview

### 1. Watchlists Collection (`watchlists`)
Main collection for storing user-created watchlists.

**Fields:**
- `title` (text) - Watchlist name
- `description` (editor) - Rich text description
- `owner` (relation to users) - User who created the watchlist
- `isPublic` (bool) - Whether the watchlist is publicly visible
- `category` (select) - Category (movies, tv_shows, mixed, etc.)
- `coverImage` (file) - Optional cover image
- `tags` (json) - Array of tags for categorization

**API Rules:**
- Public watchlists are visible to all authenticated users
- Private watchlists are only visible to owner and shared users
- Only owners can edit/delete their watchlists (unless specifically shared with edit permissions)

### 2. Watchlist Items Collection (`watchlistItems`)
Individual movies/shows within watchlists.

**Fields:**
- `watchlist` (relation) - Parent watchlist
- `mediaType` (select) - movie, show, season, episode
- `traktId`, `tmdbId`, `imdbId` - External IDs for fetching data
- `title`, `year`, `posterUrl`, `overview` - Cached metadata
- `status` (select) - plan_to_watch, watching, completed, dropped, on_hold
- `rating` (number) - User rating 1-10
- `notes` (editor) - Personal notes
- `order` (number) - Custom ordering
- `addedBy` (relation to users) - Who added this item

**Features:**
- Import functionality to copy items from one watchlist to another
- Support for different media types (movies, shows, episodes)
- Personal tracking with status and ratings

### 3. User Follows Collection (`userFollows`)
Manages user following relationships.

**Fields:**
- `follower` (relation to users) - User doing the following
- `following` (relation to users) - User being followed

**Features:**
- Prevents self-following
- Enables discovery of other users' public watchlists
- Foundation for social features

### 4. Watchlist Likes Collection (`watchlistLikes`)
Track likes on watchlists.

**Fields:**
- `user` (relation to users) - User who liked
- `watchlist` (relation) - Watchlist being liked

**Features:**
- Prevents liking your own watchlists
- Shows popularity of watchlists
- Used for discovery algorithms

### 5. Watchlist Shares Collection (`watchlistShares`)
Fine-grained sharing permissions.

**Fields:**
- `watchlist` (relation) - Watchlist being shared
- `user` (relation to users) - User it's shared with
- `canView`, `canEdit` (bool) - Permission levels
- `sharedBy` (relation to users) - Who shared it

**Features:**
- Granular permissions (view-only vs edit access)
- Allows collaboration on watchlists
- Overrides public/private settings

### 6. Watchlist Comments Collection (`watchlistComments`)
Comments and discussions on watchlists.

**Fields:**
- `watchlist` (relation) - Parent watchlist
- `author` (relation to users) - Comment author
- `content` (editor) - Comment text
- `parentComment` (relation) - For threaded replies

**Features:**
- Threaded discussions
- Only visible on accessible watchlists
- Authors can edit their own comments

## API Usage

### TypeScript Types
Import types from `@/lib/pb/types/watchlist-types`:
```typescript
import { Watchlist, WatchlistItem, CreateWatchlist } from '@/lib/pb/types/watchlist-types';
```

### API Functions
Import functions from `@/lib/pb/watchlist-api`:
```typescript
import { watchlistsApi, watchlistItemsApi, userFollowsApi } from '@/lib/pb/watchlist-api';
```

### React Query Hooks
Import hooks from `@/lib/tanstack/watchlist-hooks`:
```typescript
import { useWatchlists, useCreateWatchlist, useFollowUser } from '@/lib/tanstack/watchlist-hooks';
```

## Example Usage

### Creating a Watchlist
```typescript
const createWatchlist = useCreateWatchlist();

const handleCreate = () => {
  createWatchlist.mutate({
    title: "My Action Movies",
    description: "Collection of my favorite action films",
    owner: currentUser.id,
    isPublic: true,
    category: "movies",
    tags: ["action", "thriller"]
  });
};
```

### Following a User
```typescript
const followUser = useFollowUser();

const handleFollow = (userId: string) => {
  followUser.mutate({
    followingUserId: userId,
    followerUserId: currentUser.id
  });
};
```

### Importing Watchlist Items
```typescript
const importItems = useImportWatchlistItems();

const handleImport = (sourceWatchlistId: string, targetWatchlistId: string) => {
  importItems.mutate({
    sourceWatchlistId,
    targetWatchlistId,
    userId: currentUser.id
  });
};
```

## Security & Privacy

- **Authentication Required**: All operations require user authentication
- **Ownership Model**: Users can only modify their own watchlists unless explicitly shared
- **Privacy Controls**: Public/private settings with granular sharing permissions
- **Audit Trail**: All records track creation/update timestamps and responsible users

## Next Steps

1. **UI Components**: Create React Native components for watchlist management
2. **Discovery Features**: Implement recommendation algorithms based on follows/likes
3. **Notifications**: Add real-time updates for comments, follows, likes
4. **Advanced Sharing**: Add time-limited shares, view analytics
5. **Mobile Optimizations**: Offline support, background sync

This collection structure provides a solid foundation for building a comprehensive social movie tracking experience while maintaining proper security and scalability.
