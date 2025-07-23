// Generated TypeScript types for new PocketBase collections
// This file provides type-safe interfaces for the watchlist collections

export interface Watchlist {
  id: string;
  title: string;
  description?: string;
  owner: string; // User ID
  isPublic: boolean;
  category?: 'movies' | 'tv_shows' | 'mixed' | 'documentaries' | 'anime' | 'comedy' | 'drama' | 'action' | 'horror' | 'sci_fi' | 'romance' | 'thriller' | 'other';
  coverImage?: string; // File field
  tags?: any[]; // JSON array of tags
  created: string; // ISO date string
  updated: string; // ISO date string
  
  // Expanded relations (when using expand)
  expand?: {
    owner?: User;
    watchlistItems_via_watchlist?: WatchlistItem[];
    watchlistLikes_via_watchlist?: WatchlistLike[];
    watchlistShares_via_watchlist?: WatchlistShare[];
    watchlistComments_via_watchlist?: WatchlistComment[];
  };
}

export interface WatchlistItem {
  id: string;
  watchlist: string; // Watchlist ID
  mediaType: 'movie' | 'tv_show';
  traktId: number;
  tmdbId?: number;
  imdbId?: string;
  title: string;
  year?: number;
  slug?: string;
  metadata?: any; // JSON metadata
  personalNote?: string;
  status?: 'plan_to_watch' | 'watching' | 'completed' | 'dropped' | 'on_hold';
  rating?: number; // 1-10
  order?: number;
  created: string; // ISO date string
  updated: string; // ISO date string
  
  // Expanded relations
  expand?: {
    watchlist?: Watchlist;
  };
}

export interface UserFollow {
  id: string;
  follower: string; // User ID
  following: string; // User ID
  created: string; // ISO date string
  
  // Expanded relations
  expand?: {
    follower?: User;
    following?: User;
  };
}

export interface WatchlistLike {
  id: string;
  user: string; // User ID
  watchlist: string; // Watchlist ID
  created: string; // ISO date string
  
  // Expanded relations
  expand?: {
    user?: User;
    watchlist?: Watchlist;
  };
}

export interface WatchlistShare {
  id: string;
  watchlist: string; // Watchlist ID
  user: string; // User ID (who the watchlist is shared with)
  permission: 'view' | 'edit';
  created: string; // ISO date string
  
  // Expanded relations
  expand?: {
    watchlist?: Watchlist;
    user?: User;
  };
}

export interface WatchlistComment {
  id: string;
  watchlist: string; // Watchlist ID
  author: string; // User ID
  content: string; // Rich text content
  parentComment?: string; // Parent comment ID for threading
  created: string; // ISO date string
  updated: string; // ISO date string
  
  // Expanded relations
  expand?: {
    watchlist?: Watchlist;
    author?: User;
    parentComment?: WatchlistComment;
    watchlistComments_via_parentComment?: WatchlistComment[]; // Replies
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
export type CreateWatchlist = Omit<Watchlist, 'id' | 'created' | 'updated' | 'expand'>;
export type CreateWatchlistItem = Omit<WatchlistItem, 'id' | 'created' | 'updated' | 'expand'>;
export type CreateUserFollow = Omit<UserFollow, 'id' | 'created' | 'expand'>;
export type CreateWatchlistLike = Omit<WatchlistLike, 'id' | 'created' | 'expand'>;
export type CreateWatchlistShare = Omit<WatchlistShare, 'id' | 'created' | 'expand'>;
export type CreateWatchlistComment = Omit<WatchlistComment, 'id' | 'created' | 'updated' | 'expand'>;

// Utility types for updating records
export type UpdateWatchlist = Partial<Omit<Watchlist, 'id' | 'created' | 'updated' | 'expand'>>;
export type UpdateWatchlistItem = Partial<Omit<WatchlistItem, 'id' | 'created' | 'updated' | 'expand'>>;
export type UpdateWatchlistShare = Partial<Omit<WatchlistShare, 'id' | 'created' | 'expand'>>;
export type UpdateWatchlistComment = Partial<Omit<WatchlistComment, 'id' | 'created' | 'updated' | 'expand'>>;

// Collection names constants
export const COLLECTIONS = {
  WATCHLISTS: 'watchlists',
  WATCHLIST_ITEMS: 'watchlistItems',
  USER_FOLLOWS: 'userFollows',
  WATCHLIST_LIKES: 'watchlistLikes',
  WATCHLIST_SHARES: 'watchlistShares',
  WATCHLIST_COMMENTS: 'watchlistComments',
  USERS: 'users',
} as const;

// Status options
export const WATCHLIST_STATUSES = [
  'plan_to_watch',
  'watching', 
  'completed',
  'dropped',
  'on_hold'
] as const;

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

export const MEDIA_TYPES = [
  'movie',
  'tv_show'
] as const;

export type WatchlistStatus = typeof WATCHLIST_STATUSES[number];
export type WatchlistCategory = typeof WATCHLIST_CATEGORIES[number];
export type MediaType = typeof MEDIA_TYPES[number];
