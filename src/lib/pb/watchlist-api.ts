import { pb } from './client';
import {
    COLLECTIONS,
    CreateUserFollow,
    CreateWatchlist,
    CreateWatchlistComment,
    CreateWatchlistItem,
    CreateWatchlistLike,
    CreateWatchlistShare,
    UpdateWatchlist,
    UpdateWatchlistComment,
    UpdateWatchlistItem,
    UserFollow,
    Watchlist,
    WatchlistComment,
    WatchlistItem,
    WatchlistLike,
    WatchlistShare,
} from './types/watchlist-types';

// Watchlist operations
export const watchlistsApi = {
  // Get all watchlists (respects API rules for access control)
  async list(options?: { 
    filter?: string; 
    sort?: string; 
    expand?: string;
    page?: number;
    perPage?: number;
  }) {
    return await pb.collection(COLLECTIONS.WATCHLISTS).getList<Watchlist>(
      options?.page || 1,
      options?.perPage || 20,
      {
        filter: options?.filter,
        sort: options?.sort || '-created',
        expand: options?.expand,
      }
    );
  },

  // Get a single watchlist
  async getById(id: string, expand?: string) {
    return await pb.collection(COLLECTIONS.WATCHLISTS).getOne<Watchlist>(id, {
      expand,
    });
  },

  // Create a new watchlist
  async create(data: CreateWatchlist) {
    return await pb.collection(COLLECTIONS.WATCHLISTS).create<Watchlist>(data);
  },

  // Update a watchlist
  async update(id: string, data: UpdateWatchlist) {
    return await pb.collection(COLLECTIONS.WATCHLISTS).update<Watchlist>(id, data);
  },

  // Delete a watchlist
  async delete(id: string) {
    return await pb.collection(COLLECTIONS.WATCHLISTS).delete(id);
  },

  // Get public watchlists
  async getPublic(options?: { sort?: string; expand?: string; page?: number; perPage?: number }) {
    return await pb.collection(COLLECTIONS.WATCHLISTS).getList<Watchlist>(
      options?.page || 1,
      options?.perPage || 20,
      {
        filter: 'isPublic = true',
        sort: options?.sort || '-created',
        expand: options?.expand,
      }
    );
  },

  // Get user's own watchlists
  async getUserWatchlists(userId: string, options?: { expand?: string; page?: number; perPage?: number }) {
    return await pb.collection(COLLECTIONS.WATCHLISTS).getList<Watchlist>(
      options?.page || 1,
      options?.perPage || 20,
      {
        filter: `owner = "${userId}"`,
        sort: '-created',
        expand: options?.expand,
      }
    );
  },

  // Search watchlists
  async search(query: string, options?: { expand?: string; page?: number; perPage?: number }) {
    return await pb.collection(COLLECTIONS.WATCHLISTS).getList<Watchlist>(
      options?.page || 1,
      options?.perPage || 20,
      {
        filter: `(title ~ "${query}" || description ~ "${query}") && isPublic = true`,
        sort: '-created',
        expand: options?.expand,
      }
    );
  },
};

// Watchlist items operations
export const watchlistItemsApi = {
  // Get items for a watchlist
  async getByWatchlist(watchlistId: string, options?: { expand?: string; sort?: string }) {
    return await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).getFullList<WatchlistItem>({
      filter: `watchlist = "${watchlistId}"`,
      sort: options?.sort || 'order,created',
      expand: options?.expand,
    });
  },

  // Add item to watchlist
  async create(data: CreateWatchlistItem) {
    return await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).create<WatchlistItem>(data);
  },

  // Update watchlist item
  async update(id: string, data: UpdateWatchlistItem) {
    return await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).update<WatchlistItem>(id, data);
  },

  // Delete watchlist item
  async delete(id: string) {
    return await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).delete(id);
  },

  // Check if item exists in watchlist
  async exists(watchlistId: string, traktId: number, mediaType: string) {
    try {
      const result = await pb.collection(COLLECTIONS.WATCHLIST_ITEMS).getFirstListItem<WatchlistItem>(
        `watchlist = "${watchlistId}" && traktId = ${traktId} && mediaType = "${mediaType}"`
      );
      return result;
    } catch {
      return null;
    }
  },

  // Import items from another watchlist
  async importFromWatchlist(sourceWatchlistId: string, targetWatchlistId: string, userId: string) {
    // Get items from source watchlist
    const sourceItems = await this.getByWatchlist(sourceWatchlistId);
    
    // Create new items in target watchlist
    const promises = sourceItems.map((item: WatchlistItem) => {
      const newItem: CreateWatchlistItem = {
        watchlist: targetWatchlistId,
        mediaType: item.mediaType,
        traktId: item.traktId,
        tmdbId: item.tmdbId,
        imdbId: item.imdbId,
        title: item.title,
        year: item.year,
        slug: item.slug,
        posterUrl: item.posterUrl,
        overview: item.overview,
        addedBy: userId,
      };
      return this.create(newItem);
    });

    return await Promise.all(promises);
  },
};

// User follow operations
export const userFollowsApi = {
  // Follow a user
  async follow(followingUserId: string, followerUserId: string) {
    const data: CreateUserFollow = {
      follower: followerUserId,
      following: followingUserId,
    };
    return await pb.collection(COLLECTIONS.USER_FOLLOWS).create<UserFollow>(data);
  },

  // Unfollow a user
  async unfollow(followingUserId: string, followerUserId: string) {
    const record = await pb.collection(COLLECTIONS.USER_FOLLOWS).getFirstListItem<UserFollow>(
      `follower = "${followerUserId}" && following = "${followingUserId}"`
    );
    return await pb.collection(COLLECTIONS.USER_FOLLOWS).delete(record.id);
  },

  // Check if user is following another user
  async isFollowing(followingUserId: string, followerUserId: string) {
    try {
      await pb.collection(COLLECTIONS.USER_FOLLOWS).getFirstListItem<UserFollow>(
        `follower = "${followerUserId}" && following = "${followingUserId}"`
      );
      return true;
    } catch {
      return false;
    }
  },

  // Get user's followers
  async getFollowers(userId: string, options?: { expand?: string; page?: number; perPage?: number }) {
    return await pb.collection(COLLECTIONS.USER_FOLLOWS).getList<UserFollow>(
      options?.page || 1,
      options?.perPage || 20,
      {
        filter: `following = "${userId}"`,
        sort: '-created',
        expand: options?.expand || 'follower',
      }
    );
  },

  // Get users that a user is following
  async getFollowing(userId: string, options?: { expand?: string; page?: number; perPage?: number }) {
    return await pb.collection(COLLECTIONS.USER_FOLLOWS).getList<UserFollow>(
      options?.page || 1,
      options?.perPage || 20,
      {
        filter: `follower = "${userId}"`,
        sort: '-created',
        expand: options?.expand || 'following',
      }
    );
  },
};

// Watchlist likes operations
export const watchlistLikesApi = {
  // Like a watchlist
  async like(watchlistId: string, userId: string) {
    const data: CreateWatchlistLike = {
      user: userId,
      watchlist: watchlistId,
    };
    return await pb.collection(COLLECTIONS.WATCHLIST_LIKES).create<WatchlistLike>(data);
  },

  // Unlike a watchlist
  async unlike(watchlistId: string, userId: string) {
    const record = await pb.collection(COLLECTIONS.WATCHLIST_LIKES).getFirstListItem<WatchlistLike>(
      `user = "${userId}" && watchlist = "${watchlistId}"`
    );
    return await pb.collection(COLLECTIONS.WATCHLIST_LIKES).delete(record.id);
  },

  // Check if user liked a watchlist
  async isLiked(watchlistId: string, userId: string) {
    try {
      await pb.collection(COLLECTIONS.WATCHLIST_LIKES).getFirstListItem<WatchlistLike>(
        `user = "${userId}" && watchlist = "${watchlistId}"`
      );
      return true;
    } catch {
      return false;
    }
  },

  // Get likes for a watchlist
  async getByWatchlist(watchlistId: string, options?: { expand?: string; page?: number; perPage?: number }) {
    return await pb.collection(COLLECTIONS.WATCHLIST_LIKES).getList<WatchlistLike>(
      options?.page || 1,
      options?.perPage || 20,
      {
        filter: `watchlist = "${watchlistId}"`,
        sort: '-created',
        expand: options?.expand || 'user',
      }
    );
  },

  // Get user's liked watchlists
  async getUserLikes(userId: string, options?: { expand?: string; page?: number; perPage?: number }) {
    return await pb.collection(COLLECTIONS.WATCHLIST_LIKES).getList<WatchlistLike>(
      options?.page || 1,
      options?.perPage || 20,
      {
        filter: `user = "${userId}"`,
        sort: '-created',
        expand: options?.expand || 'watchlist',
      }
    );
  },
};

// Watchlist sharing operations
export const watchlistSharesApi = {
  // Share a watchlist with a user
  async share(watchlistId: string, userId: string, sharedByUserId: string, permissions: { canView: boolean; canEdit: boolean }) {
    const data: CreateWatchlistShare = {
      watchlist: watchlistId,
      user: userId,
      canView: permissions.canView,
      canEdit: permissions.canEdit,
      sharedBy: sharedByUserId,
    };
    return await pb.collection(COLLECTIONS.WATCHLIST_SHARES).create<WatchlistShare>(data);
  },

  // Update share permissions
  async updatePermissions(shareId: string, permissions: { canView?: boolean; canEdit?: boolean }) {
    return await pb.collection(COLLECTIONS.WATCHLIST_SHARES).update<WatchlistShare>(shareId, permissions);
  },

  // Remove share
  async unshare(shareId: string) {
    return await pb.collection(COLLECTIONS.WATCHLIST_SHARES).delete(shareId);
  },

  // Get shares for a watchlist
  async getByWatchlist(watchlistId: string, options?: { expand?: string }) {
    return await pb.collection(COLLECTIONS.WATCHLIST_SHARES).getFullList<WatchlistShare>({
      filter: `watchlist = "${watchlistId}"`,
      sort: '-created',
      expand: options?.expand || 'user,sharedBy',
    });
  },

  // Get watchlists shared with a user
  async getSharedWithUser(userId: string, options?: { expand?: string; page?: number; perPage?: number }) {
    return await pb.collection(COLLECTIONS.WATCHLIST_SHARES).getList<WatchlistShare>(
      options?.page || 1,
      options?.perPage || 20,
      {
        filter: `user = "${userId}"`,
        sort: '-created',
        expand: options?.expand || 'watchlist,sharedBy',
      }
    );
  },
};

// Watchlist comments operations
export const watchlistCommentsApi = {
  // Add a comment
  async create(data: CreateWatchlistComment) {
    return await pb.collection(COLLECTIONS.WATCHLIST_COMMENTS).create<WatchlistComment>(data);
  },

  // Update a comment
  async update(id: string, data: UpdateWatchlistComment) {
    return await pb.collection(COLLECTIONS.WATCHLIST_COMMENTS).update<WatchlistComment>(id, data);
  },

  // Delete a comment
  async delete(id: string) {
    return await pb.collection(COLLECTIONS.WATCHLIST_COMMENTS).delete(id);
  },

  // Get comments for a watchlist
  async getByWatchlist(watchlistId: string, options?: { expand?: string; page?: number; perPage?: number }) {
    return await pb.collection(COLLECTIONS.WATCHLIST_COMMENTS).getList<WatchlistComment>(
      options?.page || 1,
      options?.perPage || 20,
      {
        filter: `watchlist = "${watchlistId}" && parentComment = ""`,
        sort: '-created',
        expand: options?.expand || 'author,watchlistComments_via_parentComment.author',
      }
    );
  },

  // Get replies to a comment
  async getReplies(commentId: string, options?: { expand?: string }) {
    return await pb.collection(COLLECTIONS.WATCHLIST_COMMENTS).getFullList<WatchlistComment>({
      filter: `parentComment = "${commentId}"`,
      sort: 'created',
      expand: options?.expand || 'author',
    });
  },

  // Reply to a comment
  async reply(parentCommentId: string, data: Omit<CreateWatchlistComment, 'parentComment'>) {
    const replyData: CreateWatchlistComment = {
      ...data,
      parentComment: parentCommentId,
    };
    return await this.create(replyData);
  },
};
