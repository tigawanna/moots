import { WatchlistItemsResponse } from "@/lib/pb/types/pb-types";

// Base interface for watchlist items that can come from TMDB or PocketBase
export interface BaseWatchlistItem {
  id: string | number;
  tmdb_id: number;
  title: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  genre_ids?: Record<string, any> | any[] | null;
  media_type: "movie" | "tv" | ("movie" | "tv")[];
  original_language?: string;

  origin_country?: string[];

  // User-specific fields (optional for TMDB data)
  watched_status?: boolean;
  personal_rating?: number;
  notes?: string;
  created?: string;
  updated?: string;
  user_id?: string | string[];
}

// PocketBase watchlist item (extends base with required user fields)
export type PocketBaseWatchlistItem = WatchlistItemsResponse;

// TMDB item enriched with user data
export interface EnrichedTMDBItem extends BaseWatchlistItem {
  id: number;
  media_type: "movie" | "tv";
  // These will be populated client-side based on user's watchlist
  isInWatchlist?: boolean;
  watchlistItemId?: string;
}

// Union type for components
export type UnifiedWatchlistItem = PocketBaseWatchlistItem | EnrichedTMDBItem;

// Type guards
export function isPocketBaseItem(item: UnifiedWatchlistItem): item is PocketBaseWatchlistItem {
  return typeof item.id === "string" && Array.isArray(item.media_type);
}

export function isTMDBItem(item: UnifiedWatchlistItem): item is EnrichedTMDBItem {
  return typeof item.id === "number" && typeof item.media_type === "string";
}
