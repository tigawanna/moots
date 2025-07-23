
import { useQuery } from '@tanstack/react-query';
import { createTMDBSDK, DiscoverMoviesParams, DiscoverTVParams, SearchParams } from './sdk-via-pb';
import { pb } from '../pb/client';

// Create TMDB SDK instance
const tmdb = createTMDBSDK(pb);

// ============================================================================
// TMDB Hooks
// ============================================================================

/**
 * Hook to discover popular movies
 */
export function useTMDBDiscoverMovies(params: DiscoverMoviesParams = {}) {
  return useQuery({
    queryKey: ['tmdb', 'discover', 'movies', params],
    queryFn: () => tmdb.discoverMovies({
      sort_by: 'popularity.desc',
      page: 1,
      ...params,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to discover popular TV shows
 */
export function useTMDBDiscoverTV(params: DiscoverTVParams = {}) {
  return useQuery({
    queryKey: ['tmdb', 'discover', 'tv', params],
    queryFn: () => tmdb.discoverTV({
      sort_by: 'popularity.desc',
      page: 1,
      ...params,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to search TMDB content
 */
export function useTMDBSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['tmdb', 'search', params],
    queryFn: () => tmdb.search(params),
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get trending movies (using discover with popularity sort)
 */
export function useTMDBTrendingMovies() {
  return useQuery({
    queryKey: ['tmdb', 'trending', 'movies'],
    queryFn: () => tmdb.discoverMovies({
      sort_by: 'popularity.desc',
      'vote_count.gte': 100,
      page: 1,
    }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to get trending TV shows (using discover with popularity sort)
 */
export function useTMDBTrendingTV() {
  return useQuery({
    queryKey: ['tmdb', 'trending', 'tv'],
    queryFn: () => tmdb.discoverTV({
      sort_by: 'popularity.desc',
      'vote_count.gte': 50,
      page: 1,
    }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to get top rated movies
 */
export function useTMDBTopRatedMovies() {
  return useQuery({
    queryKey: ['tmdb', 'top-rated', 'movies'],
    queryFn: () => tmdb.discoverMovies({
      sort_by: 'vote_average.desc',
      'vote_count.gte': 1000,
      'vote_average.gte': 7.0,
      page: 1,
    }),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to get top rated TV shows
 */
export function useTMDBTopRatedTV() {
  return useQuery({
    queryKey: ['tmdb', 'top-rated', 'tv'],
    queryFn: () => tmdb.discoverTV({
      sort_by: 'vote_average.desc',
      'vote_count.gte': 500,
      'vote_average.gte': 7.5,
      page: 1,
    }),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}
