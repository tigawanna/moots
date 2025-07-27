# Old Implementations Backup

This file documents the old list implementations that were replaced with the unified card system.

## Replaced Components

### DiscoverList.tsx
- **Old**: Used `WatchlistItemCard` component directly with TMDB data
- **New**: Uses `UnifiedWatchlistItemCard` with converted `UnifiedMediaItem` data
- **Change**: Added conversion logic using `movieToUnified` and `tvToUnified` helpers
- **Benefit**: Consistent display format and integrated watchlist dropdown

### TMDBSearchResults.tsx
- **Old**: Custom `SearchResultItem` component with inline Card styling for each media type
- **New**: Uses `UnifiedWatchlistItemCard` with filtered and converted media items
- **Change**: Filters out persons (only shows movies/TV), converts to unified format
- **Benefit**: Consistent appearance with discovery and watchlist views, integrated actions

### TMDBTrendingMovies.tsx
- **Old**: Custom `MovieItem` component with specific movie styling
- **New**: Uses `UnifiedWatchlistItemCard` with converted movie data
- **Change**: Added `movieToUnified` conversion, removed custom styling
- **Benefit**: Consistent with rest of app, watchlist integration

### TMDBTrendingTV.tsx
- **Old**: Custom `TVShowItem` component with specific TV show styling
- **New**: Uses `UnifiedWatchlistItemCard` with converted TV data
- **Change**: Added `tvToUnified` conversion, removed custom styling
- **Benefit**: Consistent with rest of app, watchlist integration

## Key Benefits of Unified System

1. **Consistency**: All media items display the same way across the app
2. **Maintainability**: Single source of truth for media item display logic
3. **Functionality**: Integrated watchlist dropdown and actions
4. **Type Safety**: Strong typing with `UnifiedMediaItem` interface
5. **Performance**: Unified memoization and optimization strategies

## Files Modified

- `/src/components/discover/DiscoverList.tsx`
- `/src/components/tmdb/TMDBSearchResults.tsx`
- `/src/components/tmdb/TMDBTrendingMovies.tsx`
- `/src/components/tmdb/TMDBTrendingTV.tsx`

All old custom item components and their associated styles have been removed and replaced with the unified card system.
