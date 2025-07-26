import { WatchlistItemsCreate } from "@/lib/pb/types/pb-types";





/**
 * Utility functions for TMDB integration
 */
export class WatchlistUtils {
  
  /**
   * Convert TMDB movie/TV data to watchlist item format
   */
  static tmdbToWatchlistItem(
    tmdbData: any, 
    userId: string, 
    mediaType: 'movie' | 'tv'
  ): WatchlistItemsCreate {
    return {
      added_by: userId,
      tmdb_id: tmdbData.id,
      media_type: mediaType,
      title: mediaType === 'movie' ? tmdbData.title : tmdbData.name,
      overview: tmdbData.overview || '',
      poster_path: tmdbData.poster_path,
      backdrop_path: tmdbData.backdrop_path,
      release_date: mediaType === 'movie' ? tmdbData.release_date : tmdbData.first_air_date,
      vote_average: tmdbData.vote_average || 0,
      genre_ids: tmdbData.genre_ids || [],
    };
  }

  /**
   * Validate watchlist limit before adding
   */

}
