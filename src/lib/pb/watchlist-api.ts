import { pb } from './client';
import {
    createCommunityWatchlistSchema,
    createWatchlistItemSchema,
    updateCommunityWatchlistSchema,
    updateWatchlistItemSchema,
    type CreateWatchlistItemInput,
    type UpdateWatchlistItemInput
} from './schemas/watchlist-schemas';
import {
    COLLECTIONS,
    type CommunityWatchlist,
    type CreateCommunityWatchlist,
    type UpdateCommunityWatchlist,
    type WatchlistItem
} from './types/watchlist-types';

/**
 * Personal Watchlist API
 * Handles CRUD operations for user's personal watchlist
 */
export class WatchlistAPI {
  
  /**
   * Get user's watchlist items with optional filtering and sorting
   */
  static async getUserWatchlist(options: {
    userId: string;
    page?: number;
    perPage?: number;
    filter?: string;
    sort?: string;
  }) {
    const { userId, page = 1, perPage = 20, filter = '', sort = '-added_date' } = options;
    
    let filterQuery = `user_id = "${userId}"`;
    if (filter) {
      filterQuery += ` && ${filter}`;
    }
    
    return await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).getList<WatchlistItem>(
      page,
      perPage,
      {
        filter: filterQuery,
        sort,
      }
    );
  }

  /**
   * Get a single watchlist item by ID
   */
  static async getWatchlistItem(id: string) {
    return await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).getOne<WatchlistItem>(id);
  }

  /**
   * Check if a TMDB item is in user's watchlist
   */
  static async checkWatchlistStatus(userId: string, tmdbId: number, mediaType: 'movie' | 'tv') {
    try {
      const result = await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).getFirstListItem<WatchlistItem>(
        `user_id = "${userId}" && tmdb_id = ${tmdbId} && media_type = "${mediaType}"`
      );
      return result;
    } catch (error) {
      // Item not found in watchlist
      return null;
    }
  }

  /**
   * Add item to watchlist
   */
  static async addToWatchlist(data: CreateWatchlistItemInput) {
    // Validate input
    const validatedData = createWatchlistItemSchema.parse(data);
    
    // Check if item already exists
    const existing = await this.checkWatchlistStatus(
      validatedData.user_id, 
      validatedData.tmdb_id, 
      validatedData.media_type
    );
    
    if (existing) {
      throw new Error('Item already in watchlist');
    }

    // Check watchlist limit (50 items)
    const userItems = await this.getUserWatchlist({ 
      userId: validatedData.user_id, 
      perPage: 1 
    });
    
    if (userItems.totalItems >= 50) {
      throw new Error('Watchlist limit reached (50 items max)');
    }

    return await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).create<WatchlistItem>(validatedData);
  }

  /**
   * Update watchlist item (user fields only)
   */
  static async updateWatchlistItem(id: string, data: UpdateWatchlistItemInput) {
    const validatedData = updateWatchlistItemSchema.parse(data);
    return await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).update<WatchlistItem>(id, validatedData);
  }

  /**
   * Remove item from watchlist
   */
  static async removeFromWatchlist(id: string) {
    return await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).delete(id);
  }

  /**
   * Mark item as watched/unwatched
   */
  static async toggleWatchedStatus(id: string, watched: boolean) {
    const updateData: UpdateWatchlistItemInput = {
      watched_status: watched ? 'watched' : 'unwatched',
      watch_date: watched ? new Date().toISOString() : null
    };
    
    return await this.updateWatchlistItem(id, updateData);
  }

  /**
   * Bulk operations for community list imports
   */
  static async bulkAddToWatchlist(items: CreateWatchlistItemInput[]) {
    const results = [];
    const errors = [];

    for (const item of items) {
      try {
        const result = await this.addToWatchlist(item);
        results.push(result);
      } catch (error) {
        errors.push({ item, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return { results, errors };
  }

  /**
   * Search user's watchlist
   */
  static async searchWatchlist(userId: string, query: string, options: {
    page?: number;
    perPage?: number;
  } = {}) {
    const { page = 1, perPage = 20 } = options;
    
    const filter = `user_id = "${userId}" && (title ~ "${query}" || overview ~ "${query}")`;
    
    return await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).getList<WatchlistItem>(
      page,
      perPage,
      { filter, sort: '-added_date' }
    );
  }

  /**
   * Get watchlist statistics
   */
  static async getWatchlistStats(userId: string) {
    const allItems = await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).getFullList<WatchlistItem>({
      filter: `user_id = "${userId}"`
    });

    const stats = {
      total: allItems.length,
      watched: allItems.filter(item => item.watched_status === 'watched').length,
      watching: allItems.filter(item => item.watched_status === 'watching').length,
      unwatched: allItems.filter(item => item.watched_status === 'unwatched').length,
      movies: allItems.filter(item => item.media_type === 'movie').length,
      tvShows: allItems.filter(item => item.media_type === 'tv').length,
      averageRating: 0,
      limitUsed: (allItems.length / 50) * 100 // Percentage of 50-item limit used
    };

    // Calculate average personal rating
    const ratedItems = allItems.filter(item => item.personal_rating !== null);
    if (ratedItems.length > 0) {
      stats.averageRating = ratedItems.reduce((sum, item) => sum + (item.personal_rating || 0), 0) / ratedItems.length;
    }

    return stats;
  }
}

/**
 * Community Watchlist API
 * Handles public/shared watchlists for social features
 */
export class CommunityWatchlistAPI {
  
  /**
   * Get public community watchlists
   */
  static async getCommunityWatchlists(options: {
    page?: number;
    perPage?: number;
    filter?: string;
    sort?: string;
  } = {}) {
    const { page = 1, perPage = 20, filter = '', sort = '-created' } = options;
    
    let filterQuery = 'is_public = true';
    if (filter) {
      filterQuery += ` && ${filter}`;
    }
    
    return await pb.collection(COLLECTIONS.COMMUNITY_WATCHLISTS).getList<CommunityWatchlist>(
      page,
      perPage,
      {
        filter: filterQuery,
        sort,
        expand: 'user'
      }
    );
  }

  /**
   * Get user's community watchlists (both public and private)
   */
  static async getUserCommunityWatchlists(userId: string) {
    return await pb.collection(COLLECTIONS.COMMUNITY_WATCHLISTS).getFullList<CommunityWatchlist>({
      filter: `user_id = "${userId}"`,
      sort: '-created',
      expand: 'user'
    });
  }

  /**
   * Create a new community watchlist
   */
  static async createCommunityWatchlist(data: CreateCommunityWatchlist) {
    const validatedData = createCommunityWatchlistSchema.parse(data);
    return await pb.collection(COLLECTIONS.COMMUNITY_WATCHLISTS).create<CommunityWatchlist>(validatedData);
  }

  /**
   * Update community watchlist
   */
  static async updateCommunityWatchlist(id: string, data: UpdateCommunityWatchlist) {
    const validatedData = updateCommunityWatchlistSchema.parse(data);
    return await pb.collection(COLLECTIONS.COMMUNITY_WATCHLISTS).update<CommunityWatchlist>(id, validatedData);
  }

  /**
   * Delete community watchlist
   */
  static async deleteCommunityWatchlist(id: string) {
    return await pb.collection(COLLECTIONS.COMMUNITY_WATCHLISTS).delete(id);
  }

  /**
   * Search community watchlists
   */
  static async searchCommunityWatchlists(query: string, options: {
    page?: number;
    perPage?: number;
  } = {}) {
    const { page = 1, perPage = 20 } = options;
    
    const filter = `is_public = true && (title ~ "${query}" || description ~ "${query}")`;
    
    return await pb.collection(COLLECTIONS.COMMUNITY_WATCHLISTS).getList<CommunityWatchlist>(
      page,
      perPage,
      { 
        filter, 
        sort: '-like_count,-created',
        expand: 'user'
      }
    );
  }
}

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
  ): CreateWatchlistItemInput {
    return {
      user_id: userId,
      tmdb_id: tmdbData.id,
      media_type: mediaType,
      title: mediaType === 'movie' ? tmdbData.title : tmdbData.name,
      overview: tmdbData.overview || '',
      poster_path: tmdbData.poster_path,
      backdrop_path: tmdbData.backdrop_path,
      release_date: mediaType === 'movie' ? tmdbData.release_date : tmdbData.first_air_date,
      vote_average: tmdbData.vote_average || 0,
      genre_ids: tmdbData.genre_ids || [],
      added_date: new Date().toISOString(),
      watched_status: 'unwatched',
      personal_rating: null,
      notes: null,
      watch_date: null
    };
  }

  /**
   * Validate watchlist limit before adding
   */
  static async validateWatchlistLimit(userId: string): Promise<{ canAdd: boolean; currentCount: number; limit: number }> {
    const userItems = await WatchlistAPI.getUserWatchlist({ userId, perPage: 1 });
    const limit = 50; // Could be fetched from user settings in the future
    
    return {
      canAdd: userItems.totalItems < limit,
      currentCount: userItems.totalItems,
      limit
    };
  }
}