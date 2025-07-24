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

/**
 * Community watchlist - for sharing and discovery
 * Users can create public lists that others can browse and import from
 */
export interface CommunityWatchlist {
  id: string;
  user_id: string; // Creator
  title: string;
  description: string | null;
  is_public: boolean;
  category: WatchlistCategory | null;
  cover_image: string | null; // File field
  tags: string[]; // Array of tag strings
  
  // Stats (computed or cached)
  item_count: number;
  like_count: number;
  
  // System fields
  created: string;
  updated: string;
  
  // Expanded relations
  expand?: {
    user?: User;
    communityWatchlistItems_via_watchlist?: CommunityWatchlistItem[];
    communityWatchlistLikes_via_watchlist?: CommunityWatchlistLike[];
  };
}

/**
 * Items within a community watchlist
 * Lighter version of WatchlistItem for community sharing
 */
export interface CommunityWatchlistItem {
  id: string;
  watchlist_id: string; // CommunityWatchlist ID
  
  // TMDB Core Data (minimal for community lists)
  tmdb_id: number;
  media_type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number;
  
  // Community specific
  order: number; // Position in the list
  creator_note: string | null; // Why the creator added this
  
  // System fields
  created: string;
  updated: string;
}

/**
 * User follows for social features
 */
export interface UserFollow {
  id: string;
  follower_id: string; // User ID
  following_id: string; // User ID
  created: string;
  
  expand?: {
    follower?: User;
    following?: User;
  };
}

/**
 * Likes for community watchlists
 */
export interface CommunityWatchlistLike {
  id: string;
  user_id: string;
  watchlist_id: string; // CommunityWatchlist ID
  created: string;
  
  expand?: {
    user?: User;
    watchlist?: CommunityWatchlist;
  };
}

/**
 * Comments on community watchlists
 */
export interface CommunityWatchlistComment {
  id: string;
  watchlist_id: string; // CommunityWatchlist ID
  author_id: string; // User ID
  content: string;
  parent_comment_id: string | null; // For threading
  created: string;
  updated: string;
  
  expand?: {
    watchlist?: CommunityWatchlist;
    author?: User;
    parent_comment?: CommunityWatchlistComment;
    replies?: CommunityWatchlistComment[];
  };
}

// Base User type (should match your existing User interface)
export interface User {
  id: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name?: string;
  avatar?: string;
  traktAccessToken?: string;
  traktRefreshToken?: string;
  created: string;
  updated: string;
}

// Utility types for creating new records (without system fields)
export type CreateWatchlistItem = Omit<WatchlistItem, 'id' | 'created' | 'updated'>;
export type CreateCommunityWatchlist = Omit<CommunityWatchlist, 'id' | 'created' | 'updated' | 'item_count' | 'like_count' | 'expand'>;
export type CreateCommunityWatchlistItem = Omit<CommunityWatchlistItem, 'id' | 'created' | 'updated'>;
export type CreateUserFollow = Omit<UserFollow, 'id' | 'created' | 'expand'>;
export type CreateCommunityWatchlistLike = Omit<CommunityWatchlistLike, 'id' | 'created' | 'expand'>;
export type CreateCommunityWatchlistComment = Omit<CommunityWatchlistComment, 'id' | 'created' | 'updated' | 'expand'>;

// Utility types for updating records
export type UpdateWatchlistItem = Partial<Omit<WatchlistItem, 'id' | 'created' | 'updated' | 'user_id' | 'tmdb_id' | 'media_type'>>;
export type UpdateCommunityWatchlist = Partial<Omit<CommunityWatchlist, 'id' | 'created' | 'updated' | 'user_id' | 'item_count' | 'like_count' | 'expand'>>;
export type UpdateCommunityWatchlistItem = Partial<Omit<CommunityWatchlistItem, 'id' | 'created' | 'updated' | 'watchlist_id' | 'tmdb_id' | 'media_type'>>;
export type UpdateCommunityWatchlistComment = Partial<Omit<CommunityWatchlistComment, 'id' | 'created' | 'updated' | 'watchlist_id' | 'author_id' | 'expand'>>;

// Legacy aliases for backward compatibility
export type CreateWatchlistItemInput = CreateWatchlistItem;
export type UpdateWatchlistItemInput = UpdateWatchlistItem;

// Collection names constants
export const COLLECTIONS = {
  WATCHLIST_ITEMS: 'watchlistItems',
  COMMUNITY_WATCHLISTS: 'communityWatchlists',
  COMMUNITY_WATCHLIST_ITEMS: 'communityWatchlistItems',
  USER_FOLLOWS: 'userFollows',
  COMMUNITY_WATCHLIST_LIKES: 'communityWatchlistLikes',
  COMMUNITY_WATCHLIST_COMMENTS: 'communityWatchlistComments',
  USERS: 'users',
} as const;

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
