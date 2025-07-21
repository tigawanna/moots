# Typed PocketBase Usage Guide

This guide explains how to use the typed PocketBase client in our movie social app, with proper query patterns and type safety.

## Overview

Our app uses `@tigawanna/typed-pocketbase` which provides full type safety for PocketBase operations. The types are auto-generated from the PocketBase schema using the `pb-types` script.

## Client Setup

The typed PocketBase client is configured in `/src/lib/pb/client.ts`:

```typescript
import { TypedPocketBase } from "@tigawanna/typed-pocketbase";
import { Schema } from "./types/pb-types";

export const pb = new TypedPocketBase<Schema>(url, authStore);
```

## Type Generation

Types are generated using:
```bash
pnpm run pb-types
```

This generates `/src/lib/pb/types/pb-types.ts` with all collection types.

## Collections Overview

### 1. **watchlists** - User-created movie/TV show lists
- **Purpose**: Core content lists (public/private, categorized)
- **Relations**: owned by users, contains items, can be liked/shared/commented
- **Key Features**: Public/private visibility, categories, cover images, tags

### 2. **watchlistItems** - Individual movies/TV shows in lists
- **Purpose**: Actual content entries with Trakt/TMDB integration
- **Relations**: belongs to watchlists
- **Key Features**: Status tracking, ratings, personal notes, ordering

### 3. **userFollows** - Social following system
- **Purpose**: User-to-user following relationships
- **Relations**: follower and following users
- **Key Features**: Prevents self-following, mutual following support

### 4. **watchlistLikes** - Like/favorite system for watchlists
- **Purpose**: Users can like/favorite watchlists
- **Relations**: user who liked, watchlist being liked
- **Key Features**: Prevents self-liking, analytics for owners

### 5. **watchlistShares** - Granular sharing permissions
- **Purpose**: Share watchlists with specific users
- **Relations**: watchlist being shared, user receiving access
- **Key Features**: View/edit permissions, collaborative lists

### 6. **watchlistComments** - Comments and discussions
- **Purpose**: Comments on watchlists with threading
- **Relations**: watchlist, author, parent comment (for replies)
- **Key Features**: Threaded replies, rich text content

## Typed Query Patterns

### Basic Queries

```typescript
// Get paginated list with type safety
const watchlists = await pb.from("watchlists").getList({
  page: 1,
  perPage: 20,
  select: {
    id: true,
    title: true,
    isPublic: true,
    // TypeScript will autocomplete available fields
  }
});

// Get single record
const watchlist = await pb.from("watchlists").getOne("id", {
  select: {
    id: true,
    title: true,
    description: true,
  }
});
```

### Filtering with Type Safety

```typescript
import { eq, and, or } from "@tigawanna/typed-pocketbase";

// Type-safe filters
const publicWatchlists = await pb.from("watchlists").getList({
  filter: eq('isPublic', true),
  select: { id: true, title: true }
});

// Complex filters
const userWatchlists = await pb.from("watchlists").getList({
  filter: and(
    eq('owner', userId),
    or(eq('category', 'movies'), eq('category', 'tv_shows'))
  ),
});
```

### Expanding Relations

```typescript
// Expand related data with type safety
const watchlistWithDetails = await pb.from("watchlists").getOne("id", {
  select: {
    id: true,
    title: true,
    expand: {
      owner: {
        id: true,
        name: true,
        avatar: true,
      },
      watchlistItems_via_watchlist: {
        id: true,
        title: true,
        mediaType: true,
        status: true,
      },
      watchlistLikes_via_watchlist: {
        id: true,
        expand: {
          user: {
            id: true,
            name: true,
          }
        }
      }
    }
  }
});
```

### Mutations with Type Safety

```typescript
// Create with proper types
const newWatchlist = await pb.from("watchlists").create({
  title: "My Movies",
  description: "Best movies ever",
  owner: userId,
  isPublic: true,
  category: ['movies'], // Type-safe enum
});

// Update with partial types
const updated = await pb.from("watchlists").update("id", {
  title: "Updated Title",
  // Only include fields you want to update
});
```

## Query Options Patterns

### 1. Logical Grouping

We organize query options into logical groups:

```typescript
// WATCHLIST OPERATIONS
export function watchlistsListQueryOptions(options) { ... }
export function watchlistDetailQueryOptions(id, options) { ... }
export function publicWatchlistsQueryOptions(options) { ... }

// WATCHLIST ITEMS OPERATIONS  
export function watchlistItemsQueryOptions(watchlistId, options) { ... }
export function addWatchlistItemMutation() { ... }

// USER SOCIAL OPERATIONS
export function userFollowersQueryOptions(userId, options) { ... }
export function userFollowingQueryOptions(userId, options) { ... }
```

### 2. Query Key Factories

Use consistent query key patterns:

```typescript
export const watchlistKeys = {
  all: ['watchlists'],
  lists: () => [...watchlistKeys.all, 'list'],
  list: (filters: Record<string, any>) => [...watchlistKeys.lists(), { filters }],
  details: () => [...watchlistKeys.all, 'detail'],
  detail: (id: string) => [...watchlistKeys.details(), id],
  items: (id: string) => [...watchlistKeys.detail(id), 'items'],
};
```

### 3. Consistent Options Patterns

Use consistent option patterns across query functions:

```typescript
interface QueryOptions {
  page?: number;
  perPage?: number;
  filter?: ReturnType<typeof eq | typeof and | typeof or>;
  sort?: string[];
  expand?: {
    [key: string]: boolean | object;
  };
}
```

## Hook Patterns

### 1. Query Hooks

```typescript
export const useWatchlists = (options?: Parameters<typeof watchlistsListQueryOptions>[0]) => {
  return useQuery(watchlistsListQueryOptions(options));
};
```

### 2. Mutation Hooks with Cache Invalidation

```typescript
export const useCreateWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: WatchlistsCreate) => pb.from('watchlists').create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
    },
  });
};
```

## Best Practices

### 1. Use Type-Safe Selects

Always use the `select` option to specify exactly what fields you need:

```typescript
// ✅ Good - explicit field selection
select: {
  id: true,
  title: true,
  isPublic: true,
}

// ❌ Avoid - fetching all fields
// No select specified
```

### 2. Leverage Expand for Related Data

Use expand to fetch related data in a single query:

```typescript
// ✅ Good - fetch related data in one query
expand: {
  owner: {
    id: true,
    name: true,
    avatar: true,
  },
  watchlistItems_via_watchlist: {
    id: true,
    title: true,
  }
}

// ❌ Avoid - multiple separate queries
```

### 3. Use Proper Filter Types

Import and use the filter helper functions:

```typescript
import { eq, and, or, gt, lt } from "@tigawanna/typed-pocketbase";

// ✅ Good - type-safe filters
filter: and(eq('isPublic', true), gt('created', '2024-01-01'))

// ❌ Avoid - string filters (no type safety)
filter: "isPublic = true && created > '2024-01-01'"
```

### 4. Consistent Error Handling

Handle errors consistently across all hooks:

```typescript
export const useWatchlist = (id: string) => {
  return useQuery({
    ...watchlistDetailQueryOptions(id),
    retry: (failureCount, error) => {
      // Don't retry for 404s
      if (error?.status === 404) return false;
      return failureCount < 3;
    },
  });
};
```

### 5. Optimistic Updates

Use optimistic updates for better UX:

```typescript
export const useLikeWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ watchlistId, userId }: { watchlistId: string; userId: string }) => 
      pb.from('watchlistLikes').create({ watchlist: watchlistId, user: userId }),
    onMutate: async ({ watchlistId }) => {
      // Optimistically update UI
      const previousData = queryClient.getQueryData(watchlistKeys.detail(watchlistId));
      // ... optimistic update logic
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(watchlistKeys.detail(variables.watchlistId), context.previousData);
      }
    },
  });
};
```

## Performance Tips

1. **Use pagination** for large datasets
2. **Select only needed fields** to reduce payload size  
3. **Use expand strategically** - don't over-expand
4. **Implement proper cache invalidation** strategies
5. **Use background refetching** for better UX
6. **Implement infinite queries** for feeds

## Common Patterns

### 1. Conditional Queries

```typescript
export const useWatchlist = (id: string, enabled = true) => {
  return useQuery({
    ...watchlistDetailQueryOptions(id),
    enabled: !!id && enabled,
  });
};
```

### 2. Dependent Queries

```typescript
export const useWatchlistWithItems = (watchlistId: string) => {
  const watchlistQuery = useWatchlist(watchlistId);
  const itemsQuery = useWatchlistItems(watchlistId, {
    enabled: !!watchlistQuery.data,
  });
  
  return {
    watchlist: watchlistQuery.data,
    items: itemsQuery.data,
    isLoading: watchlistQuery.isLoading || itemsQuery.isLoading,
  };
};
```

### 3. Real-time Updates

```typescript
export const useWatchlistWithRealtime = (id: string) => {
  const query = useWatchlist(id);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = pb.collection('watchlists').subscribe(id, (e) => {
      queryClient.setQueryData(watchlistKeys.detail(id), e.record);
    });
    
    return unsubscribe;
  }, [id]);
  
  return query;
};
```

This guide ensures type safety, performance, and maintainability across your movie social app.
