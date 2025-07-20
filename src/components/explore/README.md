# Trakt API Integration

This implementation fetches trending movies and shows from the Trakt API and displays them in the Explore screen.

## Features

### 🎬 **Trending Content**
- **Movies**: Fetches trending movies from Trakt API
- **TV Shows**: Fetches trending TV shows from Trakt API
- **Real-time Data**: Shows current watchers and play counts
- **Responsive Grid**: 2-column layout with Material Design cards

### 🖼️ **Image Handling**
- **No Images in Lists**: Following Trakt's recommendation, lists don't load images
- **TMDB Integration**: Images loaded on-demand from TMDB using Trakt's TMDB IDs
- **Expo Image Caching**: Uses `expo-image` with `cachePolicy="memory-disk"`
- **Performance Optimized**: Images only loaded when needed (detail screens)

### 📱 **UI Components**

#### 1. **TraktTrendingMovies** (`/src/components/explore/trakt/TraktTrendingMovies.tsx`)
- Displays trending movies in a grid
- Shows title, year, watchers, and play count
- Handles loading and error states

#### 2. **TrakttrendingShows** (`/src/components/explore/trakt/TrakttrendingShows.tsx`)
- Displays trending TV shows in a grid
- Same functionality as movies component
- Optimized for show data structure

#### 3. **MediaItemWithImage** (`/src/components/shared/MediaItemWithImage.tsx`)
- Reusable component for detailed views
- Supports both movies and TV shows
- Conditional image loading with caching

### 🔧 **API Integration**

#### **Trakt API** (`/src/lib/trakt/trakt-trending.ts`)
```typescript
// Get trending movies
const { data: movies } = useQuery(traktTrendingMoviesQueryOptions());

// Get trending shows  
const { data: shows } = useQuery(traktTrendingShowsQueryOptions());
```

#### **TMDB Images** (`/src/lib/images/tmdb-images.ts`)
```typescript
// Get cached images for a movie/show
const images = await getCachedTMDBImages(tmdbId, 'movie');
```

### 📋 **Data Structure**

#### **Trakt Response**
```typescript
interface TraktTrendingMovieResponse {
  watchers: number;
  play_count: number;
  collected_count: number;
  collector_count: number;
  movie: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      imdb: string;
      tmdb: number;
    };
  };
}
```

### 🔐 **Environment Setup**

Required environment variables:
```bash
# Required for Trakt API
EXPO_PUBLIC_TRAKT_CLIENT_ID=your_client_id
EXPO_PUBLIC_TRAKT_CLIENT_SECRET=your_client_secret

# Optional for images
EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_key
```

### 🎯 **Performance Considerations**

1. **API Rate Limits**:
   - Trakt: Respect their rate limiting
   - TMDB: 40 requests per 10 seconds
   - Use React Query caching (30 min stale time)

2. **Image Optimization**:
   - Images only loaded on detail screens
   - Expo Image with memory + disk caching
   - TMDB image size optimization

3. **Data Caching**:
   - React Query for API response caching
   - In-memory cache for TMDB image URLs
   - AsyncStorage persistence for React Query

### 🚀 **Usage**

The explore screen automatically displays trending content:

```typescript
// In your explore screen
<Tabs>
  <TabScreen label="Movies">
    <TraktTrendingMovies />
  </TabScreen>
  <TabScreen label="TV Shows">
    <TrakttrendingShows />
  </TabScreen>
</Tabs>
```

### 🔄 **State Management**

- **Loading States**: Handled by React Query
- **Error States**: User-friendly error messages
- **Caching**: Automatic with React Query + Expo Image
- **Offline Support**: React Query provides offline-first behavior

This implementation provides a solid foundation for browsing trending content while respecting API limits and providing excellent user experience with cached images and responsive design.
