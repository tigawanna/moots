# FlatList Refresh Patterns with TanStack Query

## Core Principle
Every FlatList powered by TanStack Query should implement pull-to-refresh functionality using the appropriate refresh method based on data availability.

## Implementation Pattern

### Primary Approach: Use Query Refetch
When the query data is available, use the `refetch` method returned from `useQuery`:

```tsx
import { useQuery } from '@tanstack/react-query';
import { FlatList, RefreshControl } from 'react-native';

function MovieListScreen() {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
  });

  return (
    <FlatList
      data={data}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      }
      // ... other props
    />
  );
}
```

### Fallback Approach: Use QueryClient Invalidation
When the query data is not available or you need broader invalidation, use `queryClient.invalidateQueries`:

```tsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FlatList, RefreshControl } from 'react-native';

function MovieListScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
  });

  const handleRefresh = () => {
    // Invalidates all queries with 'movies' key prefix
    queryClient.invalidateQueries({ queryKey: ['movies'] });
  };

  return (
    <FlatList
      data={data}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={handleRefresh}
        />
      }
      // ... other props
    />
  );
}
```

## When to Use Each Approach

### Use `refetch` when:
- You have a single, specific query to refresh
- The query hook is available in the component
- You want precise control over the refresh state

### Use `queryClient.invalidateQueries` when:
- You need to refresh multiple related queries
- The query hook is not directly available
- You want to trigger a broader data refresh
- Working with complex query key patterns

## Query Key Invalidation Patterns

### Exact Match
```tsx
// Only invalidates queries with exact key ['movies']
queryClient.invalidateQueries({ queryKey: ['movies'] });
```

### Prefix Match (Recommended)
```tsx
// Invalidates all queries starting with ['movies']
// e.g., ['movies'], ['movies', { page: 1 }], ['movies', 'popular']
queryClient.invalidateQueries({ queryKey: ['movies'] });
```

### Predicate-based Invalidation
```tsx
// Custom logic for complex invalidation patterns
queryClient.invalidateQueries({
  predicate: (query) => 
    query.queryKey[0] === 'movies' && query.queryKey[1]?.userId === currentUserId
});
```

## Complete Example with Error Handling

```tsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FlatList, RefreshControl } from 'react-native';
import { useState } from 'react';

function WatchlistScreen() {
  const queryClient = useQueryClient();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  
  const { data, isLoading, refetch, isRefetching, error } = useQuery({
    queryKey: ['watchlist'],
    queryFn: fetchWatchlist,
  });

  const handleRefresh = async () => {
    try {
      setIsManualRefreshing(true);
      
      // Prefer refetch when available
      if (refetch) {
        await refetch();
      } else {
        // Fallback to invalidation
        await queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const refreshing = isRefetching || isManualRefreshing;

  return (
    <FlatList
      data={data || []}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
      // ... other props
    />
  );
}
```

## Best Practices

1. **Always implement refresh**: Every FlatList with remote data should support pull-to-refresh
2. **Use appropriate loading state**: Show `isRefetching` for refetch, `isLoading` for invalidation
3. **Handle errors gracefully**: Don't let refresh failures crash the app
4. **Prefer refetch over invalidation**: Use `refetch` when the query is directly available
5. **Consider user feedback**: Provide visual feedback during refresh operations
6. **Test offline scenarios**: Ensure refresh works properly when offline

## Common Patterns by Screen Type

### Simple List Screens
Use `refetch` from the primary query hook.

### Complex Screens with Multiple Queries
Use `queryClient.invalidateQueries` with appropriate key patterns.

### Infinite Query Lists
Use `refetch` from `useInfiniteQuery` which handles pagination correctly.

### Search/Filter Screens
Invalidate queries based on current search/filter state.