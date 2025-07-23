import { fetchFromTMDB } from './tmdb-sdk';
import {
    TMDBMovie,
    TMDBMultiSearchResponse,
    TMDBResponse,
    TMDBSearchOptions,
    TMDBTVShow
} from './tmdb-types';

// Basic trending movies endpoint for testing the foundation
export async function fetchTMDBTrendingMovies(): Promise<TMDBResponse<TMDBMovie>> {
  return fetchFromTMDB<TMDBResponse<TMDBMovie>>('/trending/movie/day');
}

// Basic trending TV shows endpoint for testing the foundation
export async function fetchTMDBTrendingTVShows(): Promise<TMDBResponse<TMDBTVShow>> {
  return fetchFromTMDB<TMDBResponse<TMDBTVShow>>('/trending/tv/day');
}

// Multi-search endpoint for combined movie/TV search
export async function fetchTMDBMultiSearch(options: TMDBSearchOptions): Promise<TMDBMultiSearchResponse> {
  const params = {
    query: options.query,
    page: options.page || 1,
    include_adult: options.include_adult || false,
    ...(options.region && { region: options.region }),
    ...(options.year && { year: options.year }),
  };
  
  return fetchFromTMDB<TMDBMultiSearchResponse>('/search/multi', params);
}

// Individual movie search endpoint
export async function fetchTMDBMovieSearch(options: TMDBSearchOptions): Promise<TMDBResponse<TMDBMovie>> {
  const params = {
    query: options.query,
    page: options.page || 1,
    include_adult: options.include_adult || false,
    ...(options.region && { region: options.region }),
    ...(options.year && { year: options.year }),
    ...(options.primary_release_year && { primary_release_year: options.primary_release_year }),
  };
  
  return fetchFromTMDB<TMDBResponse<TMDBMovie>>('/search/movie', params);
}

// Individual TV show search endpoint
export async function fetchTMDBTVSearch(options: TMDBSearchOptions): Promise<TMDBResponse<TMDBTVShow>> {
  const params = {
    query: options.query,
    page: options.page || 1,
    include_adult: options.include_adult || false,
    ...(options.first_air_date_year && { first_air_date_year: options.first_air_date_year }),
  };
  
  return fetchFromTMDB<TMDBResponse<TMDBTVShow>>('/search/tv', params);
}