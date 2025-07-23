import { queryOptions } from "@tanstack/react-query";
import { fetchFromTrakt } from "./trakst-sdk";

// Common genres for filtering
export const MOVIE_GENRES = [
  'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary',
  'drama', 'family', 'fantasy', 'history', 'horror', 'music', 'mystery',
  'romance', 'science-fiction', 'thriller', 'war', 'western'
] as const;

export const TV_GENRES = [
  'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary',
  'drama', 'family', 'fantasy', 'game-show', 'history', 'horror', 'music',
  'mystery', 'news', 'reality', 'romance', 'science-fiction', 'soap',
  'talk-show', 'thriller', 'war', 'western'
] as const;

export type MovieGenre = typeof MOVIE_GENRES[number];
export type TVGenre = typeof TV_GENRES[number];

// Types for Trakt API responses
export interface TraktShow {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
    tvdb: number;
  };
  watchers?: number; // For trending
  plays?: number; // For trending
}

export interface TraktMovie {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
  };
  watchers?: number; // For trending
  plays?: number; // For trending
}

export interface TraktTrendingShowResponse {
  watchers: number;
  play_count: number;
  collected_count: number;
  collector_count: number;
  show: TraktShow;
}

export interface TraktTrendingMovieResponse {
  watchers: number;
  play_count: number;
  collected_count: number;
  collector_count: number;
  movie: TraktMovie;
}

// Search response types
export interface TraktSearchResult {
  type: 'movie' | 'show' | 'episode' | 'person' | 'list';
  score: number;
  movie?: TraktMovie;
  show?: TraktShow;
}

// Popular/Latest response types  
export interface TraktPopularShow {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
    tvdb: number;
  };
  rating: number;
  votes: number;
  updated_at: string;
  available_translations: string[];
  runtime: number;
  certification: string;
  network: string;
  country: string;
  trailer: string;
  homepage: string;
  status: string;
  language: string;
  genres: string[];
}

export interface TraktPopularMovie {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
  };
  tagline: string;
  overview: string;
  released: string;
  runtime: number;
  country: string;
  trailer: string;
  homepage: string;
  rating: number;
  votes: number;
  updated_at: string;
  available_translations: string[];
  genres: string[];
  certification: string;
}

// =============================================================================
// TRENDING ENDPOINTS
// =============================================================================

async function fetchTraktTrendingShows(): Promise<TraktTrendingShowResponse[]> {
  return fetchFromTrakt<TraktTrendingShowResponse[]>("/shows/trending");
}

async function fetchTraktTrendingMovies(): Promise<TraktTrendingMovieResponse[]> {
  return fetchFromTrakt<TraktTrendingMovieResponse[]>("/movies/trending");
}

// =============================================================================
// SEARCH ENDPOINTS
// =============================================================================

export interface SearchOptions {
  query: string;
  type?: 'movie' | 'show' | 'episode' | 'person' | 'list';
  fields?: string; // 'title', 'overview', 'people', 'translations', 'aliases'
  limit?: number;
}

async function fetchTraktSearch(options: SearchOptions): Promise<TraktSearchResult[]> {
  const params: Record<string, any> & { api_key: string | null } = {
    query: options.query,
    api_key: null
  };
  
  if (options.type) params.type = options.type;
  if (options.fields) params.fields = options.fields;
  if (options.limit) params.limit = options.limit;
  
  return fetchFromTrakt<TraktSearchResult[]>("/search/movie,show", params);
}

// =============================================================================
// POPULAR/LATEST ENDPOINTS
// =============================================================================

export interface PopularOptions {
  genres?: string;
  years?: string;
  runtimes?: string;
  ratings?: string;
  certifications?: string;
  networks?: string;
  status?: string;
  limit?: number;
  page?: number;
}

async function fetchTraktPopularShows(options: PopularOptions = {}): Promise<TraktPopularShow[]> {
  const params: Record<string, any> & { api_key: string | null } = { api_key: null };
  
  if (options.genres) params.genres = options.genres;
  if (options.years) params.years = options.years;
  if (options.runtimes) params.runtimes = options.runtimes;
  if (options.ratings) params.ratings = options.ratings;
  if (options.certifications) params.certifications = options.certifications;
  if (options.networks) params.networks = options.networks;
  if (options.status) params.status = options.status;
  if (options.limit) params.limit = options.limit;
  if (options.page) params.page = options.page;
  
  return fetchFromTrakt<TraktPopularShow[]>("/shows/popular", params);
}

async function fetchTraktPopularMovies(options: PopularOptions = {}): Promise<TraktPopularMovie[]> {
  const params: Record<string, any> & { api_key: string | null } = { api_key: null };
  
  if (options.genres) params.genres = options.genres;
  if (options.years) params.years = options.years;
  if (options.runtimes) params.runtimes = options.runtimes;
  if (options.ratings) params.ratings = options.ratings;
  if (options.certifications) params.certifications = options.certifications;
  if (options.limit) params.limit = options.limit;
  if (options.page) params.page = options.page;
  
  return fetchFromTrakt<TraktPopularMovie[]>("/movies/popular", params);
}

// Recently updated shows/movies (closest to "latest")
async function fetchTraktUpdatedShows(options: Pick<PopularOptions, 'limit' | 'page'> = {}): Promise<TraktPopularShow[]> {
  const params: Record<string, any> & { api_key: string | null } = { api_key: null };
  
  if (options.limit) params.limit = options.limit;
  if (options.page) params.page = options.page;
  
  return fetchFromTrakt<TraktPopularShow[]>("/shows/updates", params);
}

async function fetchTraktUpdatedMovies(options: Pick<PopularOptions, 'limit' | 'page'> = {}): Promise<TraktPopularMovie[]> {
  const params: Record<string, any> & { api_key: string | null } = { api_key: null };
  
  if (options.limit) params.limit = options.limit;
  if (options.page) params.page = options.page;
  
  return fetchFromTrakt<TraktPopularMovie[]>("/movies/updates", params);
}

// =============================================================================
// QUERY OPTIONS - TRENDING
// =============================================================================

export function traktTrendingShowsQueryOptions() {
  return queryOptions({
    queryKey: ["trakt", "shows", "trending"],
    queryFn: fetchTraktTrendingShows,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function traktTrendingMoviesQueryOptions() {
  return queryOptions({
    queryKey: ["trakt", "movies", "trending"],
    queryFn: fetchTraktTrendingMovies,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// =============================================================================
// QUERY OPTIONS - SEARCH
// =============================================================================

export function traktSearchQueryOptions(options: SearchOptions) {
  return queryOptions({
    queryKey: ["trakt", "search", options.query, options.type, options.fields, options.limit],
    queryFn: () => fetchTraktSearch(options),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!options.query && options.query.length >= 2, // Only search if query is at least 2 chars
  });
}

// =============================================================================
// QUERY OPTIONS - POPULAR (with genre filtering)
// =============================================================================

export function traktPopularShowsQueryOptions(options: PopularOptions = {}) {
  return queryOptions({
    queryKey: ["trakt", "shows", "popular", options],
    queryFn: () => fetchTraktPopularShows(options),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function traktPopularMoviesQueryOptions(options: PopularOptions = {}) {
  return queryOptions({
    queryKey: ["trakt", "movies", "popular", options],
    queryFn: () => fetchTraktPopularMovies(options),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// =============================================================================
// QUERY OPTIONS - LATEST/UPDATED
// =============================================================================

export function traktLatestShowsQueryOptions(options: Pick<PopularOptions, 'limit' | 'page'> = {}) {
  return queryOptions({
    queryKey: ["trakt", "shows", "latest", options],
    queryFn: () => fetchTraktUpdatedShows(options),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function traktLatestMoviesQueryOptions(options: Pick<PopularOptions, 'limit' | 'page'> = {}) {
  return queryOptions({
    queryKey: ["trakt", "movies", "latest", options],
    queryFn: () => fetchTraktUpdatedMovies(options),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

// =============================================================================
// CONVENIENCE FUNCTIONS FOR GENRE FILTERING
// =============================================================================

/**
 * Get popular horror shows
 */
export function traktPopularHorrorShowsQueryOptions(options: Omit<PopularOptions, 'genres'> = {}) {
  return traktPopularShowsQueryOptions({
    ...options,
    genres: 'horror'
  });
}

/**
 * Get popular horror movies
 */
export function traktPopularHorrorMoviesQueryOptions(options: Omit<PopularOptions, 'genres'> = {}) {
  return traktPopularMoviesQueryOptions({
    ...options,
    genres: 'horror'
  });
}

/**
 * Get popular drama shows
 */
export function traktPopularDramaShowsQueryOptions(options: Omit<PopularOptions, 'genres'> = {}) {
  return traktPopularShowsQueryOptions({
    ...options,
    genres: 'drama'
  });
}

/**
 * Get popular drama movies
 */
export function traktPopularDramaMoviesQueryOptions(options: Omit<PopularOptions, 'genres'> = {}) {
  return traktPopularMoviesQueryOptions({
    ...options,
    genres: 'drama'
  });
}

/**
 * Get popular content by specific genre
 */
export function traktPopularByGenreQueryOptions(
  contentType: 'shows' | 'movies',
  genre: MovieGenre | TVGenre,
  options: Omit<PopularOptions, 'genres'> = {}
) {
  if (contentType === 'shows') {
    return traktPopularShowsQueryOptions({
      ...options,
      genres: genre
    });
  } else {
    return traktPopularMoviesQueryOptions({
      ...options,
      genres: genre
    });
  }
}
