import { WatchlistItemsCreate } from "@/lib/pb/types/pb-types";
import { UnifiedMediaItem } from "@/types/unified-media";

/**
 * Convert UnifiedMediaItem to WatchlistItemsCreate payload
 */
export function unifiedMediaToWatchlistItem(
  mediaItem: UnifiedMediaItem,
  userId: string,
  watchlistId?: string
): WatchlistItemsCreate {
  return {
    tmdb_id: mediaItem.id,
    title: mediaItem.title || mediaItem.name || "Unknown Title",
    overview: mediaItem.overview,
    poster_path: mediaItem.poster_path || undefined,
    backdrop_path: mediaItem.backdrop_path || undefined,
    release_date: mediaItem.release_date || mediaItem.first_air_date || undefined,
    vote_average: mediaItem.vote_average || 0,
    genre_ids: mediaItem.genre_ids || mediaItem.genres || [],
    media_type: [mediaItem.media_type],
    added_by: [userId],
    watched_status: mediaItem.watched_status || false,
    personal_rating: mediaItem.personal_rating || undefined,
    notes: mediaItem.notes || undefined,
  };
}
