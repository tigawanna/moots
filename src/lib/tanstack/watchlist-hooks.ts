import {
    infiniteQueryOptions,
    queryOptions,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query';
import {
    type CreateWatchlistItemInput,
    type UpdateWatchlistItemInput,
    type WatchlistItem,
    type WatchlistStats
} from '../pb/types/watchlist-types';
import { CommunityWatchlistAPI, WatchlistAPI, WatchlistUtils } from '../pb/watchlist-api';

import { watchlistKeys } from './query-keys';

/**
 * Query Options for Personal Watchlist
 */

// Get user's watchlist with pagination
export const getUserWatchlistOptions = (options: {
  userId: string;
  page?: number;
  perPage?: number;
  filter?: string;
  sort?: string;
}) => queryOptions({
  queryKey: watchlistKeys.list(options.userId, options.filter),
  queryFn: () => WatchlistAPI.getUserWatchlist(options),
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: !!options.userId,
});

// Infinite query for scrollable watchlist
export const getUserWatchlistInfiniteOptions = (options: {
  userId: string;
  perPage?: number;
  filter?: string;
  sort?: string;
}) => infiniteQueryOptions({
  queryKey: [...watchlistKeys.list(options.userId, options.filter), 'infinite'],
  queryFn: ({ pageParam = 1 }) => WatchlistAPI.getUserWatchlist({
    ...options,
    page: pageParam as number,
  }),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    if (lastPage.page < lastPage.totalPages) {
      return lastPage.page + 1;
    }
    return undefined;
  },
  staleTime: 5 * 60 * 1000,
  enabled: !!options.userId,
});

// Check if item is in watchlist
export const getWatchlistStatusOptions = (userId: string, tmdbId: number, mediaType: 'movie' | 'tv') => 
  queryOptions<WatchlistItem | null>({
    queryKey: watchlistKeys.status(userId, tmdbId, mediaType),
    queryFn: () => WatchlistAPI.checkWatchlistStatus(userId, tmdbId, mediaType),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!userId && !!tmdbId,
  });

// Get watchlist statistics
export const getWatchlistStatsOptions = (userId: string) => queryOptions<WatchlistStats>({
  queryKey: watchlistKeys.stats(userId),
  queryFn: () => WatchlistAPI.getWatchlistStats(userId),
  staleTime: 10 * 60 * 1000, // 10 minutes
  enabled: !!userId,
});

// Search watchlist
export const searchWatchlistOptions = (userId: string, query: string, options?: {
  page?: number;
  perPage?: number;
}) => queryOptions({
  queryKey: watchlistKeys.search(userId, query),
  queryFn: () => WatchlistAPI.searchWatchlist(userId, query, options),
  staleTime: 2 * 60 * 1000,
  enabled: !!userId && !!query.trim(),
});

/**
 * Personal Watchlist Hooks
 */

// Get user's watchlist
export const useUserWatchlist = (options: {
  userId: string;
  page?: number;
  perPage?: number;
  filter?: string;
  sort?: string;
}) => {
  return useQuery(getUserWatchlistOptions(options));
};

// Infinite scrolling watchlist
export const useUserWatchlistInfinite = (options: {
  userId: string;
  perPage?: number;
  filter?: string;
  sort?: string;
}) => {
  return useInfiniteQuery(getUserWatchlistInfiniteOptions(options));
};

// Check watchlist status for TMDB item
export const useWatchlistStatus = (userId: string, tmdbId: number, mediaType: 'movie' | 'tv') => {
  return useQuery<WatchlistItem | null>(getWatchlistStatusOptions(userId, tmdbId, mediaType));
};

// Get watchlist statistics
export const useWatchlistStats = (userId: string) => {
  return useQuery(getWatchlistStatsOptions(userId));
};

// Search watchlist
export const useSearchWatchlist = (userId: string, query: string, options?: {
  page?: number;
  perPage?: number;
}) => {
  return useQuery(searchWatchlistOptions(userId, query, options));
};

/**
 * Watchlist Mutations with Optimistic Updates
 */

// Add to watchlist
export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateWatchlistItemInput) => WatchlistAPI.addToWatchlist(data),
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: watchlistKeys.lists() });
      await queryClient.cancelQueries({ 
        queryKey: watchlistKeys.status(newItem.user_id, newItem.tmdb_id, newItem.media_type) 
      });

      // Snapshot previous values
      const previousWatchlist = queryClient.getQueryData(
        watchlistKeys.list(newItem.user_id)
      );
      const previousStatus = queryClient.getQueryData(
        watchlistKeys.status(newItem.user_id, newItem.tmdb_id, newItem.media_type)
      );

      // Optimistically update status
      queryClient.setQueryData(
        watchlistKeys.status(newItem.user_id, newItem.tmdb_id, newItem.media_type),
        { ...newItem, id: 'temp-id', created: new Date().toISOString(), updated: new Date().toISOString() }
      );

      return { previousWatchlist, previousStatus };
    },
    onError: (err, newItem, context) => {
      // Revert optimistic updates
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          watchlistKeys.status(newItem.user_id, newItem.tmdb_id, newItem.media_type),
          context.previousStatus
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch related queries
      queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: watchlistKeys.stats(variables.user_id) });
      queryClient.invalidateQueries({ 
        queryKey: watchlistKeys.status(variables.user_id, variables.tmdb_id, variables.media_type) 
      });
    },
  });
};

// Remove from watchlist
export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => WatchlistAPI.removeFromWatchlist(id),
    onMutate: async (id) => {
      // Find the item to get user info for cache invalidation
      const watchlistQueries = queryClient.getQueriesData({ queryKey: watchlistKeys.lists() });
      let userId = '';
      let tmdbId = 0;
      let mediaType: 'movie' | 'tv' = 'movie';

      // Find the item in cache
      for (const [, data] of watchlistQueries) {
        if (data && typeof data === 'object' && 'items' in data) {
          const items = (data as any).items as WatchlistItem[];
          const item = items.find((item: WatchlistItem) => item.id === id);
          if (item) {
            userId = item.user_id;
            tmdbId = item.tmdb_id;
            mediaType = item.media_type;
            break;
          }
        }
      }

      if (userId) {
        await queryClient.cancelQueries({ 
          queryKey: watchlistKeys.status(userId, tmdbId, mediaType) 
        });
        
        // Optimistically remove status
        queryClient.setQueryData(
          watchlistKeys.status(userId, tmdbId, mediaType),
          null
        );
      }

      return { userId, tmdbId, mediaType };
    },
    onSettled: (data, error, id, context) => {
      if (context?.userId) {
        queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
        queryClient.invalidateQueries({ queryKey: watchlistKeys.stats(context.userId) });
        queryClient.invalidateQueries({ 
          queryKey: watchlistKeys.status(context.userId, context.tmdbId, context.mediaType) 
        });
      }
    },
  });
};

// Update watchlist item
export const useUpdateWatchlistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWatchlistItemInput }) => 
      WatchlistAPI.updateWatchlistItem(id, data),
    onSettled: (data, error, variables) => {
      if (data) {
        // Update specific item in cache
        queryClient.setQueryData(watchlistKeys.detail(variables.id), data);
        
        // Invalidate lists and stats
        queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
        queryClient.invalidateQueries({ queryKey: watchlistKeys.stats(data.user_id) });
      }
    },
  });
};

// Toggle watched status
export const useToggleWatchedStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, watched }: { id: string; watched: boolean }) => 
      WatchlistAPI.toggleWatchedStatus(id, watched),
    onMutate: async ({ id, watched }) => {
      // Optimistically update the item
      const previousItem = queryClient.getQueryData(watchlistKeys.detail(id));
      
      if (previousItem) {
        queryClient.setQueryData(watchlistKeys.detail(id), {
          ...previousItem,
          watched_status: watched ? 'watched' : 'unwatched',
          watch_date: watched ? new Date().toISOString() : null,
        });
      }

      return { previousItem };
    },
    onError: (err, variables, context) => {
      if (context?.previousItem) {
        queryClient.setQueryData(watchlistKeys.detail(variables.id), context.previousItem);
      }
    },
    onSettled: (data, error, variables) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
        queryClient.invalidateQueries({ queryKey: watchlistKeys.stats(data.user_id) });
      }
    },
  });
};

// Bulk add to watchlist (for community imports)
export const useBulkAddToWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (items: CreateWatchlistItemInput[]) => WatchlistAPI.bulkAddToWatchlist(items),
    onSettled: (data, error, variables) => {
      if (data && variables.length > 0) {
        const userId = variables[0].user_id;
        queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
        queryClient.invalidateQueries({ queryKey: watchlistKeys.stats(userId) });
        
        // Invalidate status for all added items
        variables.forEach(item => {
          queryClient.invalidateQueries({ 
            queryKey: watchlistKeys.status(item.user_id, item.tmdb_id, item.media_type) 
          });
        });
      }
    },
  });
};

/**
 * Community Watchlist Query Options
 */

export const getCommunityWatchlistsOptions = (options: {
  page?: number;
  perPage?: number;
  filter?: string;
  sort?: string;
} = {}) => queryOptions({
  queryKey: watchlistKeys.community.list(options.filter),
  queryFn: () => CommunityWatchlistAPI.getCommunityWatchlists(options),
  staleTime: 5 * 60 * 1000,
});

export const getUserCommunityWatchlistsOptions = (userId: string) => queryOptions({
  queryKey: watchlistKeys.community.user(userId),
  queryFn: () => CommunityWatchlistAPI.getUserCommunityWatchlists(userId),
  staleTime: 5 * 60 * 1000,
  enabled: !!userId,
});

/**
 * Community Watchlist Hooks
 */

export const useCommunityWatchlists = (options: {
  page?: number;
  perPage?: number;
  filter?: string;
  sort?: string;
} = {}) => {
  return useQuery(getCommunityWatchlistsOptions(options));
};

export const useUserCommunityWatchlists = (userId: string) => {
  return useQuery(getUserCommunityWatchlistsOptions(userId));
};

/**
 * Utility Hooks
 */

// Hook to check watchlist limit before adding
export const useWatchlistLimit = (userId: string) => {
  return useQuery({
    queryKey: [...watchlistKeys.all(), 'limit', userId],
    queryFn: () => WatchlistUtils.validateWatchlistLimit(userId),
    staleTime: 2 * 60 * 1000,
    enabled: !!userId,
  });
};