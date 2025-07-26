# Typed PocketBase Usage Guide

## Overview

We use `@tigawanna/typed-pocketbase` for type-safe PocketBase operations. This library provides full TypeScript support for PocketBase queries with compile-time type checking.

**Repository**: https://github.com/tigawanna/typed-pocketbase

## Core Concepts

### Type-Safe Query Building
The library provides helper functions that ensure type safety at compile time:

```typescript
import { and, eq, gt, lt, like, or } from "@tigawanna/typed-pocketbase";

// Type-safe filter building
const filter = and(
  eq("user_id", userId),
  gt("created", "2024-01-01"),
  like("title", "movie%")
);
```

### Schema Integration
All operations are validated against your PocketBase schema types:

```typescript
// This will show TypeScript errors if 'watchlist' collection doesn't exist
// or if field names are incorrect
pb.from("watchlist").getList(1, 25, {
  filter: eq("user_id", userId) // TypeScript validates field exists
});
```

## Query Helpers

### Basic Comparison Operators

```typescript
import { eq, gt, lt, gte, lte, like, ilike } from "@tigawanna/typed-pocketbase";

// Equality
eq("status", "active")
eq("user_id", [userId1, userId2]) // IN operator for arrays

// Comparisons
gt("rating", 7.5)
lt("created", "2024-01-01")
gte("year", 2020)
lte("duration", 180)

// Text search
like("title", "Star%") // Case-sensitive LIKE
ilike("description", "%action%") // Case-insensitive LIKE
```

### Logical Operators

```typescript
import { and, or, not } from "@tigawanna/typed-pocketbase";

// AND conditions
const filter = and(
  eq("user_id", userId),
  gt("rating", 7.0),
  eq("watched", true)
);

// OR conditions
const filter = or(
  eq("genre", "action"),
  eq("genre", "thriller")
);

// NOT conditions
const filter = not(eq("watched", true));

// Complex combinations
const filter = and(
  eq("user_id", userId),
  or(
    gt("rating", 8.0),
    eq("favorite", true)
  ),
  not(eq("archived", true))
);
```

## Common Patterns

### Watchlist Queries

```typescript
import { and, eq, gt, like } from "@tigawanna/typed-pocketbase";

// Basic user watchlist
export function usewatchListItemsQueryOptions({ userId, page = 1 }: UseWatchListQueryFunctionProps) {
  return queryOptions({
    queryKey: ["watchlist", userId],
    queryFn: () =>
      pb.from("watchlist").getList(page, 25, {
        filter: userId && eq("user_id", userId),
        sort: "-created" // Sort by created date descending
      }),
  });
}

// Filtered watchlist with search and status
export function useFilteredWatchListQuery({ 
  userId, 
  searchTerm, 
  watched, 
  page = 1 
}: FilteredWatchListProps) {
  return queryOptions({
    queryKey: ["watchlist", userId, { searchTerm, watched }],
    queryFn: () =>
      pb.from("watchlist").getList(page, 25, {
        filter: and(
          eq("user_id", userId),
          searchTerm ? like("title", `%${searchTerm}%`) : undefined,
          watched !== undefined ? eq("watched", watched) : undefined
        ),
      }),
  });
}
```

### User Queries

```typescript
// Find users by email or username
export function findUserQuery(searchTerm: string) {
  return queryOptions({
    queryKey: ["users", "search", searchTerm],
    queryFn: () =>
      pb.from("users").getList(1, 10, {
        filter: or(
          like("email", `%${searchTerm}%`),
          like("username", `%${searchTerm}%`)
        ),
      }),
  });
}

// Get user profile with relations
export function userProfileQuery(userId: string) {
  return queryOptions({
    queryKey: ["users", userId, "profile"],
    queryFn: () =>
      pb.from("users").getOne(userId, {
        expand: "watchlists,followers,following"
      }),
  });
}
```

### Relationship Queries

```typescript
// Get watchlist items with movie details
export function watchlistWithMoviesQuery(userId: string) {
  return queryOptions({
    queryKey: ["watchlist", userId, "expanded"],
    queryFn: () =>
      pb.from("watchlist").getList(1, 50, {
        filter: eq("user_id", userId),
        expand: "movie_id", // Expand related movie record
        sort: "-created"
      }),
  });
}

// Get user's reviews with movie info
export function userReviewsQuery(userId: string) {
  return queryOptions({
    queryKey: ["reviews", "user", userId],
    queryFn: () =>
      pb.from("reviews").getList(1, 25, {
        filter: eq("user_id", userId),
        expand: "movie_id,user_id",
        sort: "-updated"
      }),
  });
}
```

## Mutations with Type Safety

### Create Operations

```typescript
import { useMutation } from "@tanstack/react-query";

// Add to watchlist
export function useAddToWatchlist() {
  return useMutation({
    mutationFn: async (data: { user_id: string; movie_id: string; title: string }) => {
      return pb.from("watchlist").create(data);
    },
    meta: {
      invalidates: [["watchlist"]], // Auto-invalidate watchlist queries
    },
  });
}

// Update watchlist item
export function useUpdateWatchlistItem() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WatchlistRecord> }) => {
      return pb.from("watchlist").update(id, data);
    },
    meta: {
      invalidates: [["watchlist"], ["watchlistItem"]],
    },
  });
}
```

### Delete Operations

```typescript
// Remove from watchlist
export function useRemoveFromWatchlist() {
  return useMutation({
    mutationFn: async (id: string) => {
      return pb.from("watchlist").delete(id);
    },
    meta: {
      invalidates: [["watchlist"]],
    },
  });
}
```

## Advanced Filtering Patterns

### Date Range Queries

```typescript
import { and, gte, lte } from "@tigawanna/typed-pocketbase";

// Movies added this week
const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const filter = and(
  eq("user_id", userId),
  gte("created", weekAgo)
);

// Movies from specific year range
const filter = and(
  gte("release_year", 2020),
  lte("release_year", 2024)
);
```

### Complex Search Queries

```typescript
// Multi-field search
export function searchMoviesQuery(searchTerm: string) {
  return queryOptions({
    queryKey: ["movies", "search", searchTerm],
    queryFn: () =>
      pb.from("movies").getList(1, 25, {
        filter: or(
          like("title", `%${searchTerm}%`),
          like("director", `%${searchTerm}%`),
          like("genre", `%${searchTerm}%`),
          like("cast", `%${searchTerm}%`)
        ),
      }),
  });
}
```

### Pagination with Filters

```typescript
// Infinite query with filters
export function useInfiniteWatchlistQuery(userId: string, filters: WatchlistFilters) {
  return useInfiniteQuery({
    queryKey: ["watchlist", userId, "infinite", filters],
    queryFn: ({ pageParam = 1 }) =>
      pb.from("watchlist").getList(pageParam, 25, {
        filter: and(
          eq("user_id", userId),
          filters.watched !== undefined ? eq("watched", filters.watched) : undefined,
          filters.genre ? eq("genre", filters.genre) : undefined,
          filters.searchTerm ? like("title", `%${filters.searchTerm}%`) : undefined
        ),
        sort: `${filters.sort.direction === "desc" ? "-" : ""}${filters.sort.field}`
      }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.items.length < 25) return undefined;
      return pages.length + 1;
    },
  });
}
```

## Error Handling

### Type-Safe Error Handling

```typescript
import { ClientResponseError } from "pocketbase";

export function useCreateWatchlistItem() {
  return useMutation({
    mutationFn: async (data: CreateWatchlistData) => {
      try {
        return await pb.from("watchlist").create(data);
      } catch (error) {
        if (error instanceof ClientResponseError) {
          // Handle specific PocketBase errors
          if (error.status === 400) {
            throw new Error("Invalid watchlist data");
          }
          if (error.status === 403) {
            throw new Error("Not authorized to create watchlist item");
          }
        }
        throw error;
      }
    },
  });
}
```

## Best Practices

### 1. Always Use Type-Safe Helpers
```typescript
// ✅ Good - Type-safe
const filter = and(eq("user_id", userId), gt("rating", 7.0));

// ❌ Bad - String-based, no type safety
const filter = `user_id = "${userId}" && rating > 7.0`;
```

### 2. Handle Undefined Filters Gracefully
```typescript
// ✅ Good - Filters out undefined conditions
const filter = and(
  eq("user_id", userId),
  searchTerm ? like("title", `%${searchTerm}%`) : undefined,
  watched !== undefined ? eq("watched", watched) : undefined
);

// ❌ Bad - Could create invalid filters
const filter = and(
  eq("user_id", userId),
  like("title", `%${searchTerm}%`), // searchTerm might be empty
  eq("watched", watched) // watched might be undefined
);
```

### 3. Use Consistent Query Key Patterns
```typescript
// ✅ Good - Consistent, hierarchical keys
["watchlist", userId]
["watchlist", userId, { filters, search }]
["watchlistItem", itemId]

// ❌ Bad - Inconsistent patterns
["userWatchlist", userId]
["watchlist-filtered", userId, filters]
```

### 4. Leverage Expand for Relations
```typescript
// ✅ Good - Single query with expanded relations
pb.from("watchlist").getList(1, 25, {
  filter: eq("user_id", userId),
  expand: "movie_id,user_id"
});

// ❌ Bad - Multiple queries for related data
const watchlist = await pb.from("watchlist").getList(1, 25, {
  filter: eq("user_id", userId)
});
// Then fetch movies separately...
```

### 5. Use Proper Sorting
```typescript
// ✅ Good - Clear sort direction
sort: "-created" // Descending by created date
sort: "+title"   // Ascending by title (+ is optional)

// Multiple sort fields
sort: "-created,+title" // Created desc, then title asc
```

## Integration with Zustand Stores

```typescript
interface WatchlistState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sort: {
    field: string;
    direction: "asc" | "desc";
  };
  setSort: (sort: { field: string; direction: "asc" | "desc" }) => void;
  filters: {
    watched?: boolean;
    genre?: string;
  };
  setFilters: (filters: Partial<WatchlistState["filters"]>) => void;
}

export const useWatchlistFiltersStore = create<WatchlistState>()(
  devtools(
    persist(
      (set) => ({
        searchTerm: "",
        setSearchTerm: (term) => set({ searchTerm: term }),
        sort: { field: "created", direction: "desc" },
        setSort: (sort) => set({ sort }),
        filters: {},
        setFilters: (filters) => set((state) => ({ 
          filters: { ...state.filters, ...filters } 
        })),
      }),
      {
        name: "watchlist-filters-storage",
      }
    )
  )
);
```

This comprehensive guide ensures type-safe, efficient, and maintainable PocketBase operations throughout the application.
