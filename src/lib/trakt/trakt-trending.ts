import { useTraktStore } from "@/store/trakt-store";
import { queryOptions } from "@tanstack/react-query";
import { envVariables } from "../env";



const TRAKT_API_BASE = "https://api.trakt.tv";
const TRAKT_API_VERSION = "2";

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

async function fetchTraktTrendingShows(): Promise<TraktTrendingShowResponse[]> {
  const response = await fetch(`${TRAKT_API_BASE}/shows/trending`, {
    headers: {
      'Content-Type': 'application/json',
      'trakt-api-version': TRAKT_API_VERSION,
      'trakt-api-key': process.env.EXPO_PUBLIC_TRAKT_CLIENT_ID!,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trending shows: ${response.statusText}`);
  }

  return response.json();
}

async function fetchTraktTrendingMovies(): Promise<TraktTrendingMovieResponse[]> {
  const traktAccessToken = useTraktStore.getState().tokens?.accessToken
 const trakktClientId = envVariables.EXPO_PUBLIC_TRAKT_CLIENT_ID 
  const response = await fetch(`${TRAKT_API_BASE}/movies/trending`, {
    headers: {
      'Content-Type': 'application/json',
      'trakt-api-version': TRAKT_API_VERSION,
      'trakt-api-key': trakktClientId,
      'Authorization': `Bearer ${traktAccessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies: ${response.statusText}`);
  }

  return response.json();
}

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
