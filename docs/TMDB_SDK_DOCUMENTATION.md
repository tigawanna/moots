# TMDB SDK Documentation

## Overview

The TMDB SDK (`src/lib/tmdb/sdk-via-pb.ts`) is a comprehensive TypeScript wrapper that provides type-safe access to The Movie Database (TMDB) API through PocketBase custom routes. This SDK acts as a bridge between your React Native app and TMDB's extensive movie/TV database.

## 🏗️ Architecture

### Integration Pattern
```
React Native App → TMDB SDK → PocketBase Custom Routes → TMDB API
```

The SDK doesn't call TMDB directly. Instead, it makes requests to PocketBase custom routes (e.g., `/api/tmdb/discover/movies`) which then proxy the requests to TMDB's actual API. This approach provides:

- **Centralized API key management** (stored securely in PocketBase)
- **Request caching and rate limiting** at the backend level
- **Consistent error handling** across the application
- **Type safety** with full TypeScript support

## 📊 Core Data Types

### Base Response Structure
```typescript
interface TMDBBaseResponse {
  page: number;           // Current page number
  total_results: number;  // Total number of results
  total_pages: number;    // Total number of pages
}
```

### Content Types

#### Movies (`TMDBMovie`)
```typescript
interface TMDBMovie {
  id: number;                    // Unique TMDB movie ID
  title: string;                 // Movie title
  original_title: string;        // Original title (in original language)
  overview: string;              // Plot summary
  poster_path: string | null;    // Poster image path
  backdrop_path: string | null;  // Backdrop image path
  release_date: string;          // Release date (YYYY-MM-DD)
  adult: boolean;                // Adult content flag
  genre_ids: number[];           // Array of genre IDs
  original_language: string;     // ISO 639-1 language code
  popularity: number;            // TMDB popularity score
  vote_average: number;          // Average user rating (0-10)
  vote_count: number;            // Number of votes
  video: boolean;                // Has video flag
}
```

#### TV Shows (`TMDBTVShow`)
```typescript
interface TMDBTVShow {
  id: number;                    // Unique TMDB TV show ID
  name: string;                  // TV show name
  original_name: string;         // Original name
  overview: string;              // Show description
  poster_path: string | null;    // Poster image path
  backdrop_path: string | null;  // Backdrop image path
  first_air_date: string;        // First air date (YYYY-MM-DD)
  genre_ids: number[];           // Array of genre IDs
  original_language: string;     // ISO 639-1 language code
  popularity: number;            // TMDB popularity score
  vote_average: number;          // Average user rating (0-10)
  vote_count: number;            // Number of votes
  origin_country: string[];      // Array of origin country codes
}
```

#### People (`TMDBPerson`)
```typescript
interface TMDBPerson {
  id: number;                           // Unique TMDB person ID
  name: string;                         // Person's name
  original_name: string;                // Original name
  profile_path: string | null;          // Profile image path
  adult: boolean;                       // Adult content flag
  popularity: number;                   // TMDB popularity score
  known_for_department: string;         // Primary department (Acting, Directing, etc.)
  known_for: (TMDBMovie | TMDBTVShow)[]; // Array of known works
}
```

## 🔧 SDK Methods

### 1. Movie Discovery (`discoverMovies`)

**Purpose**: Find movies based on various filtering criteria

**Endpoint**: `/api/tmdb/discover/movies`

**Parameters** (`DiscoverMoviesParams`):
```typescript
{
  sort_by?: string;              // e.g., 'popularity.desc', 'vote_average.desc'
  page?: number;                 // Page number (default: 1)
  with_genres?: string;          // Comma-separated genre IDs: '28,12'
  year?: string;                 // Release year: '2023'
  primary_release_year?: string; // Primary release year
  'vote_average.gte'?: number;   // Minimum rating: 7.0
  'vote_count.gte'?: number;     // Minimum vote count: 100
  with_cast?: string;            // Actor IDs
  with_crew?: string;            // Crew member IDs
  with_companies?: string;       // Production company IDs
  with_keywords?: string;        // Keyword IDs
  include_adult?: boolean;       // Include adult content
  include_video?: boolean;       // Include videos
  language?: string;             // Language code: 'en-US'
  region?: string;               // Region code
  'release_date.gte'?: string;   // Minimum release date
  'release_date.lte'?: string;   // Maximum release date
  // ... and more filtering options
}
```

**Development Log**: 🎬 TMDB Discover Movies: {baseUrl}/api/tmdb/discover/movies?{params}

### 2. TV Show Discovery (`discoverTV`)

**Purpose**: Find TV shows based on various filtering criteria

**Endpoint**: `/api/tmdb/discover/tv`

**Parameters** (`DiscoverTVParams`):
```typescript
{
  sort_by?: string;                    // Sorting criteria
  page?: number;                       // Page number
  with_genres?: string;                // Genre IDs
  first_air_date_year?: string;        // First air date year
  'vote_average.gte'?: number;         // Minimum rating
  'vote_count.gte'?: number;           // Minimum vote count
  with_networks?: string;              // Network IDs (Netflix: 213)
  with_companies?: string;             // Production company IDs
  with_keywords?: string;              // Keyword IDs
  include_null_first_air_dates?: boolean;
  language?: string;                   // Language code
  timezone?: string;                   // Timezone
  'first_air_date.gte'?: string;       // Minimum air date
  'first_air_date.lte'?: string;       // Maximum air date
  screened_theatrically?: boolean;     // Theatrically screened
  with_status?: string;                // Show status
  with_type?: string;                  // Show type
  // ... and more TV-specific options
}
```

**Development Log**: 📺 TMDB Discover TV: {baseUrl}/api/tmdb/discover/tv?{params}

### 3. Multi-Search (`search`)

**Purpose**: Search across movies, TV shows, and people simultaneously

**Endpoint**: `/api/tmdb/search`

**Parameters** (`SearchParams`):
```typescript
{
  query: string;           // Required search query
  page?: number;           // Page number
  include_adult?: boolean; // Include adult content
  language?: string;       // Language code
  region?: string;         // Region code
}
```

**Returns**: `TMDBSearchResponse` with mixed results (movies, TV shows, people)

**Development Log**: 🔍 TMDB Search: {baseUrl}/api/tmdb/search?{params}

### 4. Movie Details (`getMovieDetails`)

**Purpose**: Get comprehensive information about a specific movie

**Endpoint**: `/api/tmdb/details/movie/{id}`

**Parameters**:
- `id: number` - TMDB movie ID (required)
- `params: DetailsParams` - Additional options

**Returns**: `TMDBMovieDetails` with extended information:
```typescript
{
  // All TMDBMovie fields plus:
  belongs_to_collection: {...} | null;  // Collection info
  budget: number;                        // Production budget
  genres: {id: number, name: string}[];  // Full genre objects
  homepage: string | null;               // Official website
  imdb_id: string | null;               // IMDb ID
  production_companies: [...];           // Production companies
  production_countries: [...];           // Production countries
  revenue: number;                       // Box office revenue
  runtime: number | null;               // Runtime in minutes
  spoken_languages: [...];              // Spoken languages
  status: string;                       // Release status
  tagline: string | null;               // Movie tagline
}
```

**Development Log**: 🎭 TMDB Movie Details: {baseUrl}/api/tmdb/details/movie/{id}?{params}

### 5. TV Show Details (`getTVDetails`)

**Purpose**: Get comprehensive information about a specific TV show

**Endpoint**: `/api/tmdb/details/tv/{id}`

**Parameters**:
- `id: number` - TMDB TV show ID (required)
- `params: DetailsParams` - Additional options

**Returns**: `TMDBTVDetails` with extended information:
```typescript
{
  // All TMDBTVShow fields plus:
  created_by: [...];                    // Show creators
  episode_run_time: number[];           // Episode runtimes
  genres: {id: number, name: string}[]; // Full genre objects
  homepage: string;                     // Official website
  in_production: boolean;               // Currently in production
  languages: string[];                  // Languages
  last_air_date: string;               // Last episode air date
  last_episode_to_air: {...} | null;   // Last episode info
  networks: [...];                      // Broadcasting networks
  number_of_episodes: number;           // Total episodes
  number_of_seasons: number;            // Total seasons
  production_companies: [...];          // Production companies
  production_countries: [...];          // Production countries
  seasons: [...];                       // Season information
  spoken_languages: [...];              // Spoken languages
  status: string;                       // Show status
  tagline: string;                      // Show tagline
  type: string;                         // Show type
}
```

**Development Log**: 📻 TMDB TV Details: {baseUrl}/api/tmdb/details/tv/{id}?{params}

### 6. Generic Details (`getDetails`)

**Purpose**: Unified method to get details for either movies or TV shows

**Usage**:
```typescript
const movieDetails = await tmdb.getDetails('movie', 550);
const tvDetails = await tmdb.getDetails('tv', 1399);
```

## 🖼️ Image Utilities

### Image Size Configuration

The SDK provides comprehensive image handling utilities:

```typescript
const TMDB_IMAGE_SIZES = {
  poster: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
  backdrop: ['w300', 'w780', 'w1280', 'original'],
  still: ['w92', 'w185', 'w300', 'original'],
  profile: ['w45', 'w185', 'h632', 'original']
};
```

### Image Presets

Predefined size presets for common use cases:

```typescript
const TMDB_IMAGE_PRESETS = {
  poster: {
    thumbnail: 'w185',    // List items
    small: 'w342',        // Card components
    medium: 'w500',       // Detail views
    large: 'w780',        // Hero sections
    original: 'original'  // Full resolution
  },
  backdrop: {
    small: 'w300',        // Mobile backgrounds
    medium: 'w780',       // Tablet backgrounds
    large: 'w1280',       // Desktop backgrounds
    original: 'original'  // Full resolution
  },
  profile: {
    small: 'w45',         // Tiny avatars
    medium: 'w185',       // Standard avatars
    large: 'h632',        // Profile pages
    original: 'original'  // Full resolution
  }
};
```

### Image Utility Functions

#### `buildTMDBImageUrl(imagePath, size)`
```typescript
const posterUrl = buildTMDBImageUrl('/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg', 'w500');
// Returns: "https://image.tmdb.org/t/p/w500/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg"
```

#### `buildTMDBImageUrls(imagePath, sizes)`
```typescript
const urls = buildTMDBImageUrls('/poster.jpg', ['w300', 'w500', 'w780']);
// Returns: {
//   w300: "https://image.tmdb.org/t/p/w300/poster.jpg",
//   w500: "https://image.tmdb.org/t/p/w500/poster.jpg",
//   w780: "https://image.tmdb.org/t/p/w780/poster.jpg"
// }
```

#### `getOptimizedImageUrl(imagePath, type, usage)`
```typescript
const thumbnailUrl = getOptimizedImageUrl('/poster.jpg', 'poster', 'thumbnail');
// Returns: "https://image.tmdb.org/t/p/w185/poster.jpg"
```

#### `generateImageSrcSet(imagePath, type)`
```typescript
const srcset = generateImageSrcSet('/poster.jpg', 'poster');
// Returns: "https://image.tmdb.org/t/p/w185/poster.jpg 185w, https://image.tmdb.org/t/p/w342/poster.jpg 342w, ..."
```

## 🔍 Type Guards

The SDK provides type guards to safely handle search results:

```typescript
// Check if search result is a movie
if (isMovie(result)) {
  console.log(result.title); // TypeScript knows this is a movie
}

// Check if search result is a TV show
if (isTVShow(result)) {
  console.log(result.name); // TypeScript knows this is a TV show
}

// Check if search result is a person
if (isPerson(result)) {
  console.log(result.known_for_department); // TypeScript knows this is a person
}
```

## 🚀 Usage Examples

### Basic Movie Discovery
```typescript
import { createTMDBSDK } from '@/lib/tmdb/sdk-via-pb';
import { pb } from '@/lib/pb/client';

const tmdb = createTMDBSDK(pb);

// Get popular action movies from 2023
const movies = await tmdb.discoverMovies({
  with_genres: '28', // Action genre
  year: '2023',
  sort_by: 'popularity.desc',
  'vote_average.gte': 7.0
});
```

### Advanced TV Show Discovery
```typescript
// Get highly-rated Netflix sci-fi shows
const tvShows = await tmdb.discoverTV({
  with_genres: '10765', // Sci-Fi & Fantasy
  with_networks: '213', // Netflix
  'vote_average.gte': 8.0,
  'vote_count.gte': 100,
  sort_by: 'vote_average.desc'
});
```

### Search with Type Checking
```typescript
const searchResults = await tmdb.search({
  query: 'The Matrix',
  include_adult: false
});

searchResults.results.forEach(result => {
  if (isMovie(result)) {
    console.log(`Movie: ${result.title} (${result.release_date})`);
  } else if (isTVShow(result)) {
    console.log(`TV Show: ${result.name} (${result.first_air_date})`);
  } else if (isPerson(result)) {
    console.log(`Person: ${result.name} (${result.known_for_department})`);
  }
});
```

### Get Detailed Information
```typescript
// Get comprehensive movie details
const movieDetails = await tmdb.getMovieDetails(550, {
  append_to_response: 'credits,videos,images'
});

console.log(`Budget: $${movieDetails.budget.toLocaleString()}`);
console.log(`Revenue: $${movieDetails.revenue.toLocaleString()}`);
console.log(`Runtime: ${movieDetails.runtime} minutes`);
```

## 🐛 Development Logging

During development (`__DEV__ === true`), the SDK logs all API calls with distinctive emojis:

```
🎬 TMDB Discover Movies: http://localhost:8090/api/tmdb/discover/movies?sort_by=popularity.desc&with_genres=28&year=2023
📺 TMDB Discover TV: http://localhost:8090/api/tmdb/discover/tv?with_networks=213&vote_average.gte=8.0
🔍 TMDB Search: http://localhost:8090/api/tmdb/search?query=The%20Matrix&include_adult=false
🎭 TMDB Movie Details: http://localhost:8090/api/tmdb/details/movie/550
📻 TMDB TV Details: http://localhost:8090/api/tmdb/details/tv/1399
```

This makes debugging and monitoring API calls much easier during development.

## ⚠️ Known Issues

1. **Deprecated `baseUrl`**: The PocketBase `baseUrl` property is deprecated. This should be updated to use the current PocketBase API for getting the base URL.

## 🔧 Error Handling

The SDK includes built-in validation:

- **Search queries**: Must not be empty
- **Movie/TV IDs**: Must be positive numbers
- **Content types**: Must be 'movie' or 'tv' for generic details method

All methods return properly typed responses or throw descriptive errors.

## 🎯 Integration with React Query

The SDK is designed to work seamlessly with TanStack Query (React Query) for caching and state management. See `src/lib/tanstack/operations/discover/tmdb-hooks.ts` for pre-built React Query hooks that use this SDK.

## 📝 Summary

This TMDB SDK provides a comprehensive, type-safe interface to TMDB's movie and TV database through PocketBase. It handles:

- ✅ **Type Safety**: Full TypeScript support with detailed interfaces
- ✅ **Image Handling**: Complete image URL utilities with responsive support
- ✅ **Development Tools**: Detailed logging for debugging
- ✅ **Error Handling**: Proper validation and error messages
- ✅ **Flexibility**: Support for all major TMDB endpoints and parameters
- ✅ **Performance**: Designed for caching and optimization with React Query

The SDK serves as the foundation for all movie and TV show data in the Moots application, providing reliable access to TMDB's extensive database through a clean, maintainable interface.