/**
 * MOVIE SOCIAL APP - REACT QUERY HOOKS
 * 
 * Provides comprehensive hooks for all watchlist operations using typed PocketBase.
 * Includes proper cache invalidation and optimistic updates.
 */

import { pb } from '@/lib/pb/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { and, eq } from '@tigawanna/typed-pocketbase';
import {
    isFollowingQueryOptions,
    isWatchlistLikedQueryOptions,
    publicWatchlistsQueryOptions,
    searchWatchlistsQueryOptions,
    sharedWatchlistsQueryOptions,
    userFollowersQueryOptions,
    userFollowingQueryOptions,
    userKeys,
    userLikedWatchlistsQueryOptions,
    userWatchlistsQueryOptions,
    watchlistCommentsQueryOptions,
    watchlistDetailQueryOptions,
    watchlistItemsQueryOptions,
    // Query options
    watchlistKeys,
    watchlistLikesQueryOptions,
    watchlistsListQueryOptions,
} from './operations/watchlist';

// =============================================================================
// WATCHLIST CRUD HOOKS
// =============================================================================

/**
 * Get paginated list of watchlists with filtering
 */
export const useWatchlists = (options?: Parameters<typeof watchlistsListQueryOptions>[0]) => {
  return useQuery(watchlistsListQueryOptions(options));
};

/**
 * Get single watchlist with full details
 */
export const useWatchlist = (id: string, options?: Parameters<typeof watchlistDetailQueryOptions>[1]) => {
  return useQuery(watchlistDetailQueryOptions(id, options));
};

/**
 * Get public watchlists for discovery
 */
export const usePublicWatchlists = (options?: Parameters<typeof publicWatchlistsQueryOptions>[0]) => {
  return useQuery(publicWatchlistsQueryOptions(options));
};

/**
 * Get user's own watchlists
 */
export const useUserWatchlists = (userId: string, options?: Parameters<typeof userWatchlistsQueryOptions>[1]) => {
  return useQuery(userWatchlistsQueryOptions(userId, options));
};

/**
 * Search watchlists by query
 */
export const useSearchWatchlists = (query: string, options?: Parameters<typeof searchWatchlistsQueryOptions>[1]) => {
  return useQuery(searchWatchlistsQueryOptions(query, options));
};

/**
 * Create a new watchlist
 */
export const useCreateWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      owner: string;
      isPublic?: boolean;
      category?: string;
      coverImage?: File;
      tags?: any[];
    }) => pb.from('watchlists').create(data),
    onSuccess: (newWatchlist, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      
      // Add to user's watchlists cache if possible
      const userWatchlistsKey = watchlistKeys.userWatchlists(variables.owner);
      queryClient.invalidateQueries({ queryKey: userWatchlistsKey });
    },
  });
};

/**
 * Update an existing watchlist
 */
export const useUpdateWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: Partial<{
        title: string;
        description?: string;
        isPublic?: boolean;
        category?: string;
        coverImage?: File;
        tags?: any[];
      }>;
    }) => pb.from('watchlists').update(id, data),
    onSuccess: (updatedWatchlist, { id }) => {
      // Update specific watchlist cache
      queryClient.setQueryData(
        watchlistKeys.detail(id),
        updatedWatchlist
      );
      
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: watchlistKeys.publicWatchlists() });
    },
  });
};

/**
 * Delete a watchlist
 */
export const useDeleteWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => pb.from('watchlists').delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from all caches
      queryClient.removeQueries({ queryKey: watchlistKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// =============================================================================
// WATCHLIST ITEMS HOOKS
// =============================================================================

/**
 * Get items for a watchlist
 */
export const useWatchlistItems = (watchlistId: string, options?: Parameters<typeof watchlistItemsQueryOptions>[1]) => {
  return useQuery(watchlistItemsQueryOptions(watchlistId, options));
};

/**
 * Add item to watchlist
 */
export const useAddWatchlistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      watchlist: string;
      mediaType: 'movie' | 'tv_show';
      traktId: number;
      tmdbId?: number;
      imdbId?: string;
      title: string;
      year?: number;
      slug?: string;
      metadata?: any;
      personalNote?: string;
      status?: 'plan_to_watch' | 'watching' | 'completed' | 'dropped' | 'on_hold';
      rating?: number;
      order?: number;
    }) => pb.from('watchlistItems').create(data),
    onSuccess: (newItem) => {
      // Invalidate items for this watchlist
      queryClient.invalidateQueries({ 
        queryKey: watchlistKeys.items(newItem.watchlist) 
      });
      
      // Invalidate watchlist detail to update counts
      queryClient.invalidateQueries({ 
        queryKey: watchlistKeys.detail(newItem.watchlist) 
      });
    },
  });
};

/**
 * Update watchlist item
 */
export const useUpdateWatchlistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: Partial<{
        personalNote?: string;
        status?: 'plan_to_watch' | 'watching' | 'completed' | 'dropped' | 'on_hold';
        rating?: number;
        order?: number;
      }>;
    }) => pb.from('watchlistItems').update(id, data),
    onSuccess: (updatedItem) => {
      // Invalidate items for this watchlist
      queryClient.invalidateQueries({ 
        queryKey: watchlistKeys.items(updatedItem.watchlist) 
      });
    },
  });
};

/**
 * Remove item from watchlist
 */
export const useRemoveWatchlistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => pb.from('watchlistItems').delete(id),
    onSuccess: (_, deletedId) => {
      // Invalidate all watchlist items queries since we don't know which watchlist
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
    },
  });
};

// =============================================================================
// SOCIAL INTERACTION HOOKS
// =============================================================================

/**
 * Get user's followers
 */
export const useUserFollowers = (userId: string, options?: Parameters<typeof userFollowersQueryOptions>[1]) => {
  return useQuery(userFollowersQueryOptions(userId, options));
};

/**
 * Get users that a user is following
 */
export const useUserFollowing = (userId: string, options?: Parameters<typeof userFollowingQueryOptions>[1]) => {
  return useQuery(userFollowingQueryOptions(userId, options));
};

/**
 * Check if user is following another user
 */
export const useIsFollowing = (followerId: string, followingId: string) => {
  return useQuery(isFollowingQueryOptions(followerId, followingId));
};

/**
 * Follow a user
 */
export const useFollowUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) => 
      pb.from('userFollows').create({
        follower: followerId,
        following: followingId,
      }),
    onSuccess: (_, { followerId, followingId }) => {
      // Update follow status cache
      queryClient.setQueryData(
        [...userKeys.follows(), 'isFollowing', followerId, followingId],
        true
      );
      
      // Invalidate follow lists
      queryClient.invalidateQueries({ queryKey: userKeys.followers(followingId) });
      queryClient.invalidateQueries({ queryKey: userKeys.following(followerId) });
    },
  });
};

/**
 * Unfollow a user
 */
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ followerId, followingId }: { followerId: string; followingId: string }) => {
      const record = await pb.from('userFollows').getFirstListItem({
        filter: and(
          eq('follower', followerId),
          eq('following', followingId)
        )
      });
      return pb.from('userFollows').delete(record.id);
    },
    onSuccess: (_, { followerId, followingId }) => {
      // Update follow status cache
      queryClient.setQueryData(
        [...userKeys.follows(), 'isFollowing', followerId, followingId],
        false
      );
      
      // Invalidate follow lists
      queryClient.invalidateQueries({ queryKey: userKeys.followers(followingId) });
      queryClient.invalidateQueries({ queryKey: userKeys.following(followerId) });
    },
  });
};

// =============================================================================
// WATCHLIST LIKES HOOKS
// =============================================================================

/**
 * Get likes for a watchlist
 */
export const useWatchlistLikes = (watchlistId: string, options?: Parameters<typeof watchlistLikesQueryOptions>[1]) => {
  return useQuery(watchlistLikesQueryOptions(watchlistId, options));
};

/**
 * Check if user liked a watchlist
 */
export const useIsWatchlistLiked = (watchlistId: string, userId: string) => {
  return useQuery(isWatchlistLikedQueryOptions(watchlistId, userId));
};

/**
 * Get user's liked watchlists
 */
export const useUserLikedWatchlists = (userId: string, options?: Parameters<typeof userLikedWatchlistsQueryOptions>[1]) => {
  return useQuery(userLikedWatchlistsQueryOptions(userId, options));
};

/**
 * Like a watchlist
 */
export const useLikeWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ watchlistId, userId }: { watchlistId: string; userId: string }) => 
      pb.from('watchlistLikes').create({
        watchlist: watchlistId,
        user: userId,
      }),
    onSuccess: (_, { watchlistId, userId }) => {
      // Update like status cache
      queryClient.setQueryData(
        [...watchlistKeys.likes(watchlistId), 'isLiked', userId],
        true
      );
      
      // Invalidate like lists
      queryClient.invalidateQueries({ queryKey: watchlistKeys.likes(watchlistId) });
      queryClient.invalidateQueries({ queryKey: userKeys.likedWatchlists(userId) });
      
      // Update watchlist detail to reflect new like count
      queryClient.invalidateQueries({ queryKey: watchlistKeys.detail(watchlistId) });
    },
  });
};

/**
 * Unlike a watchlist
 */
export const useUnlikeWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ watchlistId, userId }: { watchlistId: string; userId: string }) => {
      const record = await pb.from('watchlistLikes').getFirstListItem({
        filter: and(
          eq('watchlist', watchlistId),
          eq('user', userId)
        )
      });
      return pb.from('watchlistLikes').delete(record.id);
    },
    onSuccess: (_, { watchlistId, userId }) => {
      // Update like status cache
      queryClient.setQueryData(
        [...watchlistKeys.likes(watchlistId), 'isLiked', userId],
        false
      );
      
      // Invalidate like lists
      queryClient.invalidateQueries({ queryKey: watchlistKeys.likes(watchlistId) });
      queryClient.invalidateQueries({ queryKey: userKeys.likedWatchlists(userId) });
      
      // Update watchlist detail to reflect new like count
      queryClient.invalidateQueries({ queryKey: watchlistKeys.detail(watchlistId) });
    },
  });
};

// =============================================================================
// WATCHLIST COMMENTS HOOKS
// =============================================================================

/**
 * Get comments for a watchlist
 */
export const useWatchlistComments = (watchlistId: string, options?: Parameters<typeof watchlistCommentsQueryOptions>[1]) => {
  return useQuery(watchlistCommentsQueryOptions(watchlistId, options));
};

/**
 * Add a comment to a watchlist
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      watchlist: string;
      author: string;
      content: string;
      parentComment?: string;
    }) => pb.from('watchlistComments').create(data),
    onSuccess: (newComment) => {
      // Invalidate comments for this watchlist
      queryClient.invalidateQueries({ 
        queryKey: watchlistKeys.comments(newComment.watchlist) 
      });
      
      // If it's a reply, also invalidate parent comment queries
      if (newComment.parentComment) {
        queryClient.invalidateQueries({ 
          queryKey: [...watchlistKeys.all, 'comment', newComment.parentComment, 'replies'] 
        });
      }
    },
  });
};

/**
 * Update a comment
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: { content: string };
    }) => pb.from('watchlistComments').update(id, data),
    onSuccess: () => {
      // Invalidate all comment queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
    },
  });
};

/**
 * Delete a comment
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => pb.from('watchlistComments').delete(id),
    onSuccess: () => {
      // Invalidate all comment queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
    },
  });
};

// =============================================================================
// WATCHLIST SHARING HOOKS
// =============================================================================

/**
 * Get watchlists shared with a user
 */
export const useSharedWatchlists = (userId: string, options?: Parameters<typeof sharedWatchlistsQueryOptions>[1]) => {
  return useQuery(sharedWatchlistsQueryOptions(userId, options));
};

/**
 * Share a watchlist with a user
 */
export const useShareWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ watchlistId, userId, permission }: { 
      watchlistId: string; 
      userId: string; 
      permission: 'view' | 'edit';
    }) => pb.from('watchlistShares').create({
      watchlist: watchlistId,
      user: userId,
      permission,
    }),
    onSuccess: (_, { watchlistId, userId }) => {
      // Invalidate share queries
      queryClient.invalidateQueries({ queryKey: watchlistKeys.shares(watchlistId) });
      queryClient.invalidateQueries({ queryKey: userKeys.sharedWatchlists(userId) });
      
      // Invalidate watchlist detail to show new share
      queryClient.invalidateQueries({ queryKey: watchlistKeys.detail(watchlistId) });
    },
  });
};

/**
 * Update share permissions
 */
export const useUpdateWatchlistShare = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, permission }: { 
      id: string; 
      permission: 'view' | 'edit';
    }) => pb.from('watchlistShares').update(id, { permission }),
    onSuccess: () => {
      // Invalidate all share queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

/**
 * Remove watchlist share
 */
export const useUnshareWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (shareId: string) => pb.from('watchlistShares').delete(shareId),
    onSuccess: () => {
      // Invalidate all share queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * Batch operations for importing items from one watchlist to another
 */
export const useImportWatchlistItems = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      sourceWatchlistId, 
      targetWatchlistId 
    }: { 
      sourceWatchlistId: string; 
      targetWatchlistId: string; 
    }) => {
      // Get source items
      const sourceItems = await pb.from('watchlistItems').getFullList({
        filter: eq('watchlist', sourceWatchlistId)
      });
      
      // Create batch operations
      const batch = pb.fromBatch();
      sourceItems.forEach((item) => {
        const { id, created, updated, watchlist, ...itemData } = item;
        batch.from('watchlistItems').create({
          ...itemData,
          watchlist: targetWatchlistId,
        });
      });
      
      return batch.send();
    },
    onSuccess: (_, { targetWatchlistId }) => {
      // Invalidate target watchlist items
      queryClient.invalidateQueries({ 
        queryKey: watchlistKeys.items(targetWatchlistId) 
      });
      
      // Invalidate target watchlist detail
      queryClient.invalidateQueries({ 
        queryKey: watchlistKeys.detail(targetWatchlistId) 
      });
    },
  });
};
