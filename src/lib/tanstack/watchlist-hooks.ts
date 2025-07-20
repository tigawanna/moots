import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    userFollowsApi,
    watchlistCommentsApi,
    watchlistItemsApi,
    watchlistLikesApi,
    watchlistsApi,
    watchlistSharesApi,
} from '../pb/watchlist-api';

// Query key factories
export const watchlistKeys = {
  all: ['watchlist'] as const,
  lists: () => ['watchlist', 'list'] as const,
  list: (filters: Record<string, any>) => ['watchlist', 'list', { filters }] as const,
  details: () => ['watchlist', 'detail'] as const,
  detail: (id: string) => ['watchlist', 'detail', id] as const,
  items: (id: string) => ['watchlist', 'detail', id, 'items'] as const,
  likes: (id: string) => ['watchlist', 'detail', id, 'likes'] as const,
  comments: (id: string) => ['watchlist', 'detail', id, 'comments'] as const,
  shares: (id: string) => ['watchlist', 'detail', id, 'shares'] as const,
  userWatchlists: (userId: string) => ['watchlist', 'user', userId] as const,
  publicWatchlists: () => ['watchlist', 'public'] as const,
  searchWatchlists: (query: string) => ['watchlist', 'search', query] as const,
}

export const userKeys = {
  all: ['user'] as const,
  follows: () => ['user', 'follows'] as const,
  followers: (userId: string) => ['user', 'follows', 'followers', userId] as const,
  following: (userId: string) => ['user', 'follows', 'following', userId] as const,
  likedWatchlists: (userId: string) => ['user', 'liked', userId] as const,
  sharedWatchlists: (userId: string) => ['user', 'shared', userId] as const,
}

// Watchlist hooks
export const useWatchlists = (options?: { 
  filter?: string; 
  sort?: string; 
  expand?: string;
  page?: number;
  perPage?: number;
}) => {
  return useQuery({
    queryKey: watchlistKeys.list(options || {}) as any,
    queryFn: () => watchlistsApi.list(options),
  });
};

export const useWatchlist = (id: string, expand?: string) => {
  return useQuery({
    queryKey: watchlistKeys.detail(id) as any,
    queryFn: () => watchlistsApi.getById(id, expand),
    enabled: !!id,
  });
};

export const usePublicWatchlists = (options?: { sort?: string; expand?: string; page?: number; perPage?: number }) => {
  return useQuery({
    queryKey: watchlistKeys.publicWatchlists() as any,
    queryFn: () => watchlistsApi.getPublic(options),
  });
};

export const useUserWatchlists = (userId: string, options?: { expand?: string; page?: number; perPage?: number }) => {
  return useQuery({
    queryKey: watchlistKeys.userWatchlists(userId) as any,
    queryFn: () => watchlistsApi.getUserWatchlists(userId, options),
    enabled: !!userId,
  });
};

export const useSearchWatchlists = (query: string, options?: { expand?: string; page?: number; perPage?: number }) => {
  return useQuery({
    queryKey: watchlistKeys.searchWatchlists(query) as any,
    queryFn: () => watchlistsApi.search(query, options),
    enabled: !!query && query.length > 2,
  });
};

export const useCreateWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: watchlistsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all as any });
    },
  });
};

export const useUpdateWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => watchlistsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.detail(id) as any });
      queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() as any });
    },
  });
};

export const useDeleteWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: watchlistsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all as any });
    },
  });
};

// Watchlist items hooks
export const useWatchlistItems = (watchlistId: string, options?: { expand?: string; sort?: string }) => {
  return useQuery({
    queryKey: watchlistKeys.items(watchlistId) as any,
    queryFn: () => watchlistItemsApi.getByWatchlist(watchlistId, options),
    enabled: !!watchlistId,
  });
};

export const useAddWatchlistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: watchlistItemsApi.create,
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.items(data.watchlist) as any });
    },
  });
};

export const useUpdateWatchlistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => watchlistItemsApi.update(id, data),
    onSuccess: (result) => {
      if (result.watchlist) {
        queryClient.invalidateQueries({ queryKey: watchlistKeys.items(result.watchlist) as any });
      }
    },
  });
};

export const useDeleteWatchlistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: watchlistItemsApi.delete,
    onSuccess: () => {
      // Invalidate all watchlist items queries since we don't know which watchlist this belonged to
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all as any });
    },
  });
};

export const useImportWatchlistItems = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ sourceWatchlistId, targetWatchlistId, userId }: { 
      sourceWatchlistId: string; 
      targetWatchlistId: string; 
      userId: string; 
    }) => watchlistItemsApi.importFromWatchlist(sourceWatchlistId, targetWatchlistId, userId),
    onSuccess: (_, { targetWatchlistId }) => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.items(targetWatchlistId) as any });
    },
  });
};

// User follow hooks
export const useFollowers = (userId: string, options?: { expand?: string; page?: number; perPage?: number }) => {
  return useQuery({
    queryKey: userKeys.followers(userId),
    queryFn: () => userFollowsApi.getFollowers(userId, options),
    enabled: !!userId,
  });
};

export const useFollowing = (userId: string, options?: { expand?: string; page?: number; perPage?: number }) => {
  return useQuery({
    queryKey: userKeys.following(userId),
    queryFn: () => userFollowsApi.getFollowing(userId, options),
    enabled: !!userId,
  });
};

export const useIsFollowing = (followingUserId: string, followerUserId: string) => {
  return useQuery({
    queryKey: [...userKeys.follows(), 'isFollowing', followerUserId, followingUserId],
    queryFn: () => userFollowsApi.isFollowing(followingUserId, followerUserId),
    enabled: !!followingUserId && !!followerUserId,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ followingUserId, followerUserId }: { followingUserId: string; followerUserId: string }) => 
      userFollowsApi.follow(followingUserId, followerUserId),
    onSuccess: (_, { followingUserId, followerUserId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.followers(followingUserId) });
      queryClient.invalidateQueries({ queryKey: userKeys.following(followerUserId) });
      queryClient.invalidateQueries({ queryKey: [...userKeys.follows(), 'isFollowing', followerUserId, followingUserId] });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ followingUserId, followerUserId }: { followingUserId: string; followerUserId: string }) => 
      userFollowsApi.unfollow(followingUserId, followerUserId),
    onSuccess: (_, { followingUserId, followerUserId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.followers(followingUserId) });
      queryClient.invalidateQueries({ queryKey: userKeys.following(followerUserId) });
      queryClient.invalidateQueries({ queryKey: [...userKeys.follows(), 'isFollowing', followerUserId, followingUserId] });
    },
  });
};

// Watchlist likes hooks
export const useWatchlistLikes = (watchlistId: string, options?: { expand?: string; page?: number; perPage?: number }) => {
  return useQuery({
    queryKey: watchlistKeys.likes(watchlistId),
    queryFn: () => watchlistLikesApi.getByWatchlist(watchlistId, options),
    enabled: !!watchlistId,
  });
};

export const useUserLikedWatchlists = (userId: string, options?: { expand?: string; page?: number; perPage?: number }) => {
  return useQuery({
    queryKey: userKeys.likedWatchlists(userId),
    queryFn: () => watchlistLikesApi.getUserLikes(userId, options),
    enabled: !!userId,
  });
};

export const useIsWatchlistLiked = (watchlistId: string, userId: string) => {
  return useQuery({
    queryKey: [...watchlistKeys.likes(watchlistId), 'isLiked', userId],
    queryFn: () => watchlistLikesApi.isLiked(watchlistId, userId),
    enabled: !!watchlistId && !!userId,
  });
};

export const useLikeWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ watchlistId, userId }: { watchlistId: string; userId: string }) => 
      watchlistLikesApi.like(watchlistId, userId),
    onSuccess: (_, { watchlistId, userId }) => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.likes(watchlistId) });
      queryClient.invalidateQueries({ queryKey: userKeys.likedWatchlists(userId) });
      queryClient.invalidateQueries({ queryKey: [...watchlistKeys.likes(watchlistId), 'isLiked', userId] });
    },
  });
};

export const useUnlikeWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ watchlistId, userId }: { watchlistId: string; userId: string }) => 
      watchlistLikesApi.unlike(watchlistId, userId),
    onSuccess: (_, { watchlistId, userId }) => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.likes(watchlistId) });
      queryClient.invalidateQueries({ queryKey: userKeys.likedWatchlists(userId) });
      queryClient.invalidateQueries({ queryKey: [...watchlistKeys.likes(watchlistId), 'isLiked', userId] });
    },
  });
};

// Watchlist sharing hooks
export const useWatchlistShares = (watchlistId: string, options?: { expand?: string }) => {
  return useQuery({
    queryKey: watchlistKeys.shares(watchlistId),
    queryFn: () => watchlistSharesApi.getByWatchlist(watchlistId, options),
    enabled: !!watchlistId,
  });
};

export const useSharedWatchlists = (userId: string, options?: { expand?: string; page?: number; perPage?: number }) => {
  return useQuery({
    queryKey: userKeys.sharedWatchlists(userId),
    queryFn: () => watchlistSharesApi.getSharedWithUser(userId, options),
    enabled: !!userId,
  });
};

export const useShareWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ watchlistId, userId, sharedByUserId, permissions }: { 
      watchlistId: string; 
      userId: string; 
      sharedByUserId: string; 
      permissions: { canView: boolean; canEdit: boolean };
    }) => watchlistSharesApi.share(watchlistId, userId, sharedByUserId, permissions),
    onSuccess: (_, { watchlistId, userId }) => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.shares(watchlistId) });
      queryClient.invalidateQueries({ queryKey: userKeys.sharedWatchlists(userId) });
    },
  });
};

export const useUnshareWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: watchlistSharesApi.unshare,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// Watchlist comments hooks
export const useWatchlistComments = (watchlistId: string, options?: { expand?: string; page?: number; perPage?: number }) => {
  return useQuery({
    queryKey: watchlistKeys.comments(watchlistId),
    queryFn: () => watchlistCommentsApi.getByWatchlist(watchlistId, options),
    enabled: !!watchlistId,
  });
};

export const useCommentReplies = (commentId: string, options?: { expand?: string }) => {
  return useQuery({
    queryKey: [...watchlistKeys.all, 'comment', commentId, 'replies'],
    queryFn: () => watchlistCommentsApi.getReplies(commentId, options),
    enabled: !!commentId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: watchlistCommentsApi.create,
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.comments(data.watchlist) });
      if (data.parentComment) {
        queryClient.invalidateQueries({ queryKey: [...watchlistKeys.all, 'comment', data.parentComment, 'replies'] });
      }
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => watchlistCommentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: watchlistCommentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
    },
  });
};
