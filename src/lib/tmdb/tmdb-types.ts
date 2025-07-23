// TMDB Error Response
export interface TMDBError {
  status_code: number;
  status_message: string;
  success: boolean;
}

// TMDB Genre
export interface TMDBGenre {
  id: number;
  name: string;
}

// Basic TMDB Response wrapper
export interface TMDBResponse<T> {
  page?: number;
  results?: T[];
  total_pages?: number;
  total_results?: number;
}

// TMDB Trending Response (specific for trending endpoints)
export interface TMDBTrendingResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// TMDB Movie Response
export interface TMDBMovie {
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
export interface TMDBTVShow {
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

// Multi-search result with media type
export interface TMDBMultiSearchResult {
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

// Search Response
export interface TMDBSearchResponse {
  page: number;
  results: (TMDBMovie | TMDBTVShow)[];
  total_pages: number;
  total_results: number;
}

// Multi-search Response
export interface TMDBMultiSearchResponse {
  page: number;
  results: TMDBMultiSearchResult[];
  total_pages: number;
  total_results: number;
}

// Unified Content Interface for consistent rendering
export interface UnifiedContent {
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

// Search Options
export interface TMDBSearchOptions {
  query: string;
  page?: number;
  include_adult?: boolean;
  region?: string;
  year?: number;
  primary_release_year?: number; // for movies
  first_air_date_year?: number;  // for TV shows
}

// Movie-specific search options
export interface TMDBMovieSearchOptions {
  query: string;
  page?: number;
  include_adult?: boolean;
  region?: string;
  year?: number;
  primary_release_year?: number;
}

// TV Show-specific search options
export interface TMDBTVSearchOptions {
  query: string;
  page?: number;
  include_adult?: boolean;
  first_air_date_year?: number;
}

// Trending time window options
export type TMDBTrendingTimeWindow = 'day' | 'week';

// Trending options
export interface TMDBTrendingOptions {
  time_window?: TMDBTrendingTimeWindow;
  page?: number;
}

// Type guards for media type differentiation
export function isTMDBMovie(item: TMDBMovie | TMDBTVShow): item is TMDBMovie {
  return 'title' in item && 'release_date' in item;
}

export function isTMDBTVShow(item: TMDBMovie | TMDBTVShow): item is TMDBTVShow {
  return 'name' in item && 'first_air_date' in item;
}

export function isMultiSearchMovie(item: TMDBMultiSearchResult): item is TMDBMultiSearchResult & { media_type: 'movie'; title: string } {
  return item.media_type === 'movie' && 'title' in item && typeof item.title === 'string';
}

export function isMultiSearchTVShow(item: TMDBMultiSearchResult): item is TMDBMultiSearchResult & { media_type: 'tv'; name: string } {
  return item.media_type === 'tv' && 'name' in item && typeof item.name === 'string';
}

export function isMultiSearchPerson(item: TMDBMultiSearchResult): item is TMDBMultiSearchResult & { media_type: 'person' } {
  return item.media_type === 'person';
}

// Type guard for unified content
export function isUnifiedMovie(item: UnifiedContent): item is UnifiedContent & { media_type: 'movie' } {
  return item.media_type === 'movie';
}

export function isUnifiedTVShow(item: UnifiedContent): item is UnifiedContent & { media_type: 'tv' } {
  return item.media_type === 'tv';
}

// Type guard to check if an item is valid content (not a person)
export function isValidContent(item: TMDBMultiSearchResult): item is TMDBMultiSearchResult & { media_type: 'movie' | 'tv' } {
  return item.media_type === 'movie' || item.media_type === 'tv';
}

// Type guard for checking if search response has results
export function hasSearchResults<T>(response: TMDBResponse<T> | TMDBTrendingResponse<T>): response is TMDBResponse<T> & { results: T[] } {
  return response.results !== undefined && response.results.length > 0;
}

// Utility functions for content transformation
export function tmdbMovieToUnified(movie: TMDBMovie): UnifiedContent {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    year: new Date(movie.release_date).getFullYear() || 0,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    media_type: 'movie',
  };
}

export function tmdbTVShowToUnified(show: TMDBTVShow): UnifiedContent {
  return {
    id: show.id,
    title: show.name,
    overview: show.overview,
    year: new Date(show.first_air_date).getFullYear() || 0,
    poster_path: show.poster_path,
    backdrop_path: show.backdrop_path,
    vote_average: show.vote_average,
    vote_count: show.vote_count,
    media_type: 'tv',
  };
}

export function multiSearchResultToUnified(item: TMDBMultiSearchResult): UnifiedContent | null {
  if (isMultiSearchMovie(item)) {
    return {
      id: item.id,
      title: item.title,
      overview: item.overview || '',
      year: item.release_date ? new Date(item.release_date).getFullYear() : 0,
      poster_path: item.poster_path,
      backdrop_path: null, // Multi-search doesn't include backdrop_path
      vote_average: item.vote_average || 0,
      vote_count: 0, // Multi-search doesn't include vote_count
      media_type: 'movie',
    };
  }
  
  if (isMultiSearchTVShow(item)) {
    return {
      id: item.id,
      title: item.name,
      overview: item.overview || '',
      year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : 0,
      poster_path: item.poster_path,
      backdrop_path: null, // Multi-search doesn't include backdrop_path
      vote_average: item.vote_average || 0,
      vote_count: 0, // Multi-search doesn't include vote_count
      media_type: 'tv',
    };
  }
  
  // Return null for person results or invalid items
  return null;
}