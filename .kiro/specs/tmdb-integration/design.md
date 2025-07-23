# Design Document

## Overview

This design outlines the implementation of TMDB (The Movie Database) API integration as a proof of concept for trending and search capabilities. The implementation follows the established patterns in the codebase, mirroring the Trakt API structure with fetchWrapper → types → endpoints → queryOptions → hooks architecture.

## Architecture

### High-Level Structure
```
src/lib/tmdb/
├── tmdb-sdk.ts          # Fetch wrapper (similar to trakst-sdk.ts)
├── tmdb-api.ts          # API endpoints and query options
└── tmdb-hooks.ts        # React Query hooks

src/components/screens/tmdb/
├── TMDBTrendingContent.tsx    # Trending movies/shows component
├── TMDBSearchResults.tsx      # Search results component
└── TMDBDiscovery.tsx          # Combined discovery screen
```

### API Integration Pattern
Following the established Trakt pattern:
1. **SDK Layer**: `fetchFromTMDB()` function with authentication and error handling
2. **Types Layer**: TypeScript interfaces matching TMDB API responses
3. **Endpoints Layer**: Async functions for specific API calls
4. **Query Options Layer**: TanStack Query configurations
5. **Hooks Layer**: React hooks for components

## Components and Interfaces

### Core Types (tmdb-api.ts)

```typescript
// TMDB Movie Response
interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
}

// TMDB TV Show Response
interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  popularity: number;
}

// Search Response
interface TMDBSearchResponse {
  page: number;
  results: (TMDBMovie | TMDBTVShow)[];
  total_pages: number;
  total_results: number;
}

// Multi-search result with media type
interface TMDBMultiSearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string; // for movies
  name?: string;  // for TV shows
  overview?: string;
  release_date?: string; // for movies
  first_air_date?: string; // for TV shows
  poster_path: string | null;
  vote_average?: number;
  popularity: number;
}
```

### SDK Implementation (tmdb-sdk.ts)

```typescript
const TMDB_API_BASE = "https://api.themoviedb.org/3";

export async function fetchFromTMDB<T>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T> {
  const url = new URL(`${TMDB_API_BASE}${endpoint}`);
  
  // Add API key to all requests
  url.searchParams.append('api_key', process.env.EXPO_PUBLIC_TMDB_API_KEY!);
  
  // Add other parameters
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key].toString());
    }
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
```

### API Endpoints (tmdb-api.ts)

Key endpoints to implement:
- `/trending/movie/day` - Trending movies
- `/trending/tv/day` - Trending TV shows  
- `/search/multi` - Multi-search (movies + TV shows)
- `/search/movie` - Movie-specific search
- `/search/tv` - TV show-specific search

### Query Options Pattern

Following Trakt's pattern:
```typescript
export function tmdbTrendingMoviesQueryOptions() {
  return queryOptions({
    queryKey: ["tmdb", "movies", "trending"],
    queryFn: fetchTMDBTrendingMovies,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
```

## Data Models

### Unified Content Interface
Create a unified interface that can represent both movies and TV shows for consistent component rendering:

```typescript
interface UnifiedContent {
  id: number;
  title: string;
  overview: string;
  year: number;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  media_type: 'movie' | 'tv';
  genres?: string[];
}
```

### Search Options
```typescript
interface TMDBSearchOptions {
  query: string;
  page?: number;
  include_adult?: boolean;
  region?: string;
  year?: number;
  primary_release_year?: number; // for movies
  first_air_date_year?: number;  // for TV shows
}
```

## Error Handling

### API Error Types
```typescript
interface TMDBError {
  status_code: number;
  status_message: string;
  success: boolean;
}
```

### Error Handling Strategy
1. **Network Errors**: Retry with exponential backoff
2. **Rate Limiting**: Respect TMDB rate limits (40 requests per 10 seconds)
3. **Invalid API Key**: Clear error messaging
4. **Not Found**: Graceful fallback to empty results
5. **Malformed Responses**: Type validation and error boundaries

## Testing Strategy

### Unit Tests
- API endpoint functions
- Type transformations
- Error handling scenarios
- Query option configurations

### Integration Tests
- Full API call flows
- React Query integration
- Component rendering with real data
- Error state handling

### Component Tests
- Loading states
- Error states
- Empty states
- User interactions (tap to navigate)
- Search functionality

### API Testing
- Mock TMDB responses for consistent testing
- Test rate limiting scenarios
- Test network failure scenarios
- Validate response type safety

## Implementation Notes

### Environment Configuration
Add TMDB API key to environment schema:
```typescript
// In src/lib/env.ts
export const envSchema = z.object({
  EXPO_PUBLIC_PB_URL: z.url(),
  EXPO_PUBLIC_TRAKT_CLIENT_ID: z.string().min(1),
  EXPO_PUBLIC_TMDB_API_KEY: z.string().min(1, "TMDB API Key is required"),
});
```

### Image Integration
Leverage existing TMDB image utilities in `src/lib/images/tmdb-images.ts` for poster and backdrop images.

### Navigation Integration
Components will use the existing navigation pattern to route to movie/show detail screens using the dynamic routes `[movie].tsx` and `[show].tsx`.

### Performance Considerations
- Implement proper caching with TanStack Query
- Use appropriate stale times for different content types
- Implement pagination for search results
- Optimize image loading with lazy loading

### Accessibility
- Proper ARIA labels for content items
- Screen reader support for search functionality
- Keyboard navigation support
- High contrast support for images and text

### Responsive Design
- Adapt to different screen sizes
- Proper touch targets for mobile
- Optimized layouts for tablets
- Support for landscape/portrait orientations