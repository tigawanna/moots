/**
 * TRAKT API REACT QUERY HOOKS
 * 
 * Provides comprehensive hooks for Trakt API operations including:
 * - Trending content
 * - Search functionality  
 * - Popular content with genre filtering
 * - Latest/recently updated content
 */

import { useQuery } from '@tanstack/react-query';
import {
    MovieGenre,
    PopularOptions,
    // Types
    SearchOptions,
    traktLatestMoviesQueryOptions,
    // Latest/Updated
    traktLatestShowsQueryOptions,
    traktPopularDramaMoviesQueryOptions,
    traktPopularDramaShowsQueryOptions,
    traktPopularHorrorMoviesQueryOptions,
    // Genre-specific convenience functions
    traktPopularHorrorShowsQueryOptions,
    traktPopularMoviesQueryOptions,
    // Popular with filtering
    traktPopularShowsQueryOptions,
    // Search
    traktSearchQueryOptions,
    traktTrendingMoviesQueryOptions,
    // Trending
    traktTrendingShowsQueryOptions,
    TVGenre,
} from './trakt-trending';

// =============================================================================
// TRENDING HOOKS
// =============================================================================

/**
 * Get trending TV shows
 */
export const useTraktTrendingShows = () => {
  return useQuery(traktTrendingShowsQueryOptions());
};

/**
 * Get trending movies
 */
export const useTraktTrendingMovies = () => {
  return useQuery(traktTrendingMoviesQueryOptions());
};

// =============================================================================
// SEARCH HOOKS
// =============================================================================

/**
 * Search for movies and shows
 * @param options Search options including query, type filter, etc.
 */
export const useTraktSearch = (options: SearchOptions) => {
  return useQuery(traktSearchQueryOptions(options));
};

/**
 * Search specifically for movies
 */
export const useTraktSearchMovies = (query: string, limit?: number) => {
  return useQuery(traktSearchQueryOptions({
    query,
    type: 'movie',
    limit,
  }));
};

/**
 * Search specifically for TV shows
 */
export const useTraktSearchShows = (query: string, limit?: number) => {
  return useQuery(traktSearchQueryOptions({
    query,
    type: 'show', 
    limit,
  }));
};

// =============================================================================
// POPULAR CONTENT HOOKS (with genre filtering)
// =============================================================================

/**
 * Get popular TV shows with optional filtering
 * @param options Filtering options including genres, years, ratings, etc.
 */
export const useTraktPopularShows = (options?: PopularOptions) => {
  return useQuery(traktPopularShowsQueryOptions(options));
};

/**
 * Get popular movies with optional filtering
 * @param options Filtering options including genres, years, ratings, etc.
 */
export const useTraktPopularMovies = (options?: PopularOptions) => {
  return useQuery(traktPopularMoviesQueryOptions(options));
};

/**
 * Get popular content by specific genre (shows)
 */
export const useTraktPopularShowsByGenre = (
  genre: MovieGenre | TVGenre,
  options?: Omit<PopularOptions, 'genres'>
) => {
  return useQuery(traktPopularShowsQueryOptions({
    ...options,
    genres: genre
  }));
};

/**
 * Get popular content by specific genre (movies)
 */
export const useTraktPopularMoviesByGenre = (
  genre: MovieGenre | TVGenre,
  options?: Omit<PopularOptions, 'genres'>
) => {
  return useQuery(traktPopularMoviesQueryOptions({
    ...options,
    genres: genre
  }));
};

// =============================================================================
// LATEST/UPDATED CONTENT HOOKS
// =============================================================================

/**
 * Get recently updated TV shows (closest to "latest")
 */
export const useTraktLatestShows = (options?: Pick<PopularOptions, 'limit' | 'page'>) => {
  return useQuery(traktLatestShowsQueryOptions(options));
};

/**
 * Get recently updated movies (closest to "latest")
 */
export const useTraktLatestMovies = (options?: Pick<PopularOptions, 'limit' | 'page'>) => {
  return useQuery(traktLatestMoviesQueryOptions(options));
};

// =============================================================================
// GENRE-SPECIFIC CONVENIENCE HOOKS
// =============================================================================

/**
 * Get popular horror TV shows
 */
export const useTraktPopularHorrorShows = (options?: Omit<PopularOptions, 'genres'>) => {
  return useQuery(traktPopularHorrorShowsQueryOptions(options));
};

/**
 * Get popular horror movies
 */
export const useTraktPopularHorrorMovies = (options?: Omit<PopularOptions, 'genres'>) => {
  return useQuery(traktPopularHorrorMoviesQueryOptions(options));
};

/**
 * Get popular drama TV shows
 */
export const useTraktPopularDramaShows = (options?: Omit<PopularOptions, 'genres'>) => {
  return useQuery(traktPopularDramaShowsQueryOptions(options));
};

/**
 * Get popular drama movies
 */
export const useTraktPopularDramaMovies = (options?: Omit<PopularOptions, 'genres'>) => {
  return useQuery(traktPopularDramaMoviesQueryOptions(options));
};

// =============================================================================
// COMBINED/UTILITY HOOKS
// =============================================================================

/**
 * Get trending and popular content for a comprehensive feed
 */
export const useTraktDiscoveryFeed = () => {
  const trendingShows = useTraktTrendingShows();
  const trendingMovies = useTraktTrendingMovies();
  const popularShows = useTraktPopularShows({ limit: 10 });
  const popularMovies = useTraktPopularMovies({ limit: 10 });
  
  return {
    trending: {
      shows: trendingShows.data,
      movies: trendingMovies.data,
      isLoading: trendingShows.isLoading || trendingMovies.isLoading,
    },
    popular: {
      shows: popularShows.data,
      movies: popularMovies.data,
      isLoading: popularShows.isLoading || popularMovies.isLoading,
    },
    isLoading: trendingShows.isLoading || trendingMovies.isLoading || 
               popularShows.isLoading || popularMovies.isLoading,
  };
};

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Basic trending content
const { data: trendingShows } = useTraktTrendingShows();
const { data: trendingMovies } = useTraktTrendingMovies();

// Search functionality
const { data: searchResults } = useTraktSearch({
  query: "breaking bad",
  type: "show",
  limit: 10
});

// Genre-specific content
const { data: horrorMovies } = useTraktPopularHorrorMovies({ limit: 20 });
const { data: dramaShows } = useTraktPopularDramaShows({ 
  limit: 15,
  years: "2020-2024"
});

// Custom genre filtering
const { data: actionMovies } = useTraktPopularMoviesByGenre('action', {
  limit: 10,
  ratings: "7.0-10.0"
});
const { data: actionShows } = useTraktPopularShowsByGenre('action', {
  limit: 10,
  ratings: "7.0-10.0"
});

// Latest/updated content
const { data: latestShows } = useTraktLatestShows({ limit: 30 });
const { data: latestMovies } = useTraktLatestMovies({ limit: 30 });

// Discovery feed
const discoveryFeed = useTraktDiscoveryFeed();
if (discoveryFeed.isLoading) return <Loading />;

// For multi-genre exploration, use individual hooks:
const { data: horrorShows } = useTraktPopularShowsByGenre('horror', { limit: 5 });
const { data: horrorMovies } = useTraktPopularMoviesByGenre('horror', { limit: 5 });
const { data: dramaShows } = useTraktPopularShowsByGenre('drama', { limit: 5 });
const { data: dramaMovies } = useTraktPopularMoviesByGenre('drama', { limit: 5 });
*/
