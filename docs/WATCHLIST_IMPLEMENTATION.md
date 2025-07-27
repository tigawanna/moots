# Watchlist Operations Implementation Summary

## Overview
We've implemented a comprehensive watchlist system with proper PocketBase relations and TanStack Query cache management.

## Key Features Implemented

### 1. Watchlist Operations (`/src/lib/tanstack/operations/watchlist/operations-options.ts`)

#### Core Mutations:
- **`createWatchListMutationOptions()`** - Create new watchlist
- **`updateWatchListMutationOptions()`** - Update existing watchlist  
- **`deleteWatchListMutationOptions()`** - Delete watchlist
- **`addTowatchListMutationOptions()`** - Add item to specific watchlist
- **`removeFromWatchListMutationOptions()`** - Remove item from watchlist

#### Queries:
- **`getUserWatchlistQueryOptions()`** - Get user's watchlists with expanded items

### 2. Watchlist Items Operations (`/src/lib/tanstack/operations/watchlist-items/query-options.ts`)

#### Key Mutations:
- **`quickAddToDefaultWatchlistMutationOptions()`** - Automatically adds items to user's "Want to Watch" list
- **`addToWatchListItemsMutationOptions()`** - Create new watchlist item
- **`removeFromWatchListItemsMutationOptions()`** - Delete watchlist item completely
- **`updateWatchListItemMutationOptions()`** - Update item details
- **`toggleWatchedListItemMutationOptions()`** - Toggle watched status

### 3. Hooks (`/src/lib/tanstack/operations/watchlist/hooks.ts`)

- **`useIsInWatchlist({ tmdbId })`** - Check if TMDB item exists in any user watchlist

### 4. Component Integration (`/src/components/shared/watchlist/WatchlistItemActions.tsx`)

Updated to use the new `quickAddToDefaultWatchlistMutationOptions()` for seamless adding.

## PocketBase Relation Strategy

### Database Structure:
```
watchlist_items (collection)
├── tmdb_id (number) - TMDB movie/TV ID
├── title (string) - Movie/TV title
├── media_type (string) - "movie" or "tv"
├── added_by (relation) - User who added it
└── ... other TMDB metadata

watchlist (collection)  
├── title (string) - Watchlist name
├── user_id (relation array) - Owners/collaborators
├── items (relation array) - References to watchlist_items
├── visibility (select) - "public", "private", "followers_only"
└── is_collaborative (boolean)
```

### Relation Operations:
- **Adding items**: Uses `"items+": itemId` to append to relation array
- **Removing items**: Uses `"items-": itemId` to remove from relation array
- **Deduplication**: PocketBase automatically handles duplicate prevention in relations

## Cache Invalidation Strategy

All mutations include `meta.invalidates` arrays to automatically refresh relevant queries:

```typescript
meta: {
  invalidates: [
    ["watchlist"], // Invalidate all watchlist queries
    ["watchlist-items"], // Invalidate watchlist items queries
  ],
}
```

## Quick Add Flow

1. **Check for existing watchlist**: Looks for user's "Want to Watch" list
2. **Create if missing**: Auto-creates default watchlist
3. **Check for existing item**: Looks for item in `watchlist_items` by `tmdb_id`
4. **Create if missing**: Creates new `watchlist_items` record
5. **Link to watchlist**: Uses `"items+": itemId` to add relation
6. **Cache refresh**: Automatically invalidates related queries

## Usage Examples

### Quick Add (Recommended for UI buttons):
```typescript
const quickAddMutation = useMutation(quickAddToDefaultWatchlistMutationOptions());

await quickAddMutation.mutateAsync({
  userId: user.id,
  payload: {
    added_by: user.id,
    media_type: "movie",
    tmdb_id: 550,
    title: "Fight Club",
    // ... other metadata
  },
});
```

### Check if in watchlist:
```typescript
const isInWatchlist = useIsInWatchlist({ tmdbId: 550 });
```

### Add to specific watchlist:
```typescript
const addToWatchlistMutation = useMutation(addTowatchListMutationOptions());

await addToWatchlistMutation.mutateAsync({
  watchlistId: "specific_watchlist_id",
  itemPayload: { /* watchlist item data */ }
});
```

## Debug Tools

Created `WatchlistDebugScreen` component (`/src/components/watchlist/WatchlistDebugScreen.tsx`) accessible at `/watchlist-debug` route for testing operations.

## Benefits of This Implementation

1. **Efficient Relations**: Avoids duplicate items across watchlists
2. **Automatic Cache Management**: TanStack Query handles UI updates
3. **Type Safety**: Full TypeScript support with proper PocketBase types
4. **Error Handling**: Comprehensive error states and user feedback
5. **Flexible**: Supports both personal and collaborative watchlists
6. **Performance**: Minimal database queries with smart caching

## Migration Notes

- Updated `WatchlistItemActions` to use new quick add mutation
- Fixed PocketBase filter syntax (`user_id ~ "userId"` instead of `eq()`)
- Added proper TypeScript casting for relation operations (`as any`)
- Implemented automatic default watchlist creation

## Testing

Navigate to `/watchlist-debug` in the app to test all operations with a simple UI.
