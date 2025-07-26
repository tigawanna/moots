// Streamlined watchlist types matching TMDB structure
// Simplified for personal watchlist management with social features

/**
 * Main watchlist item - stores TMDB data + user preferences
 * This is the core entity for personal watchlists
 */
export interface WatchlistItem {
  id: string;
  user_id: string; // Owner of this watchlist item
  
  // TMDB Core Data
  tmdb_id: number;
  media_type: 'movie' | 'tv';
  title: string;
  name?: string; // For TV shows
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null; // YYYY-MM-DD format
  vote_average: number;
  genre_ids: number[];
  
  // User Personal Data
  added_date: string; // ISO date string
  watched_status: 'unwatched' | 'watching' | 'watched';
  personal_rating: number | null; // 1-10 scale
  notes: string | null;
  watch_date: string | null; // When they actually watched it
  
  // System fields
  created: string;
  updated: string;
}






// Collection names constants
// export const COLLECTIONS = {
//   WATCHLIST_ITEMS: 'watchlistItems',
//   COMMUNITY_WATCHLISTS: 'communityWatchlists',
//   COMMUNITY_WATCHLIST_ITEMS: 'communityWatchlistItems',
//   USER_FOLLOWS: 'userFollows',
//   COMMUNITY_WATCHLIST_LIKES: 'communityWatchlistLikes',
//   COMMUNITY_WATCHLIST_COMMENTS: 'communityWatchlistComments',
//   USERS: 'users',
// } as const;

// Watched status options
export const WATCHED_STATUSES = [
  'unwatched',
  'watching', 
  'watched'
] as const;

// Community watchlist categories
export const WATCHLIST_CATEGORIES = [
  'movies',
  'tv_shows',
  'mixed',
  'documentaries',
  'anime',
  'comedy',
  'drama',
  'action',
  'horror',
  'sci_fi',
  'romance',
  'thriller',
  'other'
] as const;

// Media types (matching TMDB)
export const MEDIA_TYPES = [
  'movie',
  'tv'
] as const;

export type WatchedStatus = typeof WATCHED_STATUSES[number];
export type WatchlistCategory = typeof WATCHLIST_CATEGORIES[number];
export type MediaType = typeof MEDIA_TYPES[number];

// Watchlist statistics type
export interface WatchlistStats {
  total: number;
  watched: number;
  watching: number;
  unwatched: number;
  movies: number;
  tvShows: number;
  averageRating: number;
  limitUsed: number;
}
