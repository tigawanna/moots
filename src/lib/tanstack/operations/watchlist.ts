/**
 * MOVIE SOCIAL APP - QUERY OPTIONS
 * 
 * This file contains query options for the movie social app using typed PocketBase.
 * 
 * COLLECTIONS OVERVIEW:
 * 
 * 1. WATCHLISTS - User-created lists of movies/TV shows
 *    - Public/private visibility, categories, cover images, tags
 *    - Owned by users, contains items, can be liked/shared/commented
 * 
 * 2. WATCHLIST_ITEMS - Individual movies/TV shows within watchlists
 *    - Trakt/TMDB/IMDB integration, personal notes, ratings, status tracking
 *    - Belongs to watchlists
 * 
 * 3. USER_FOLLOWS - Social following system between users
 *    - Follow/unfollow functionality, prevents self-following
 * 
 * 4. WATCHLIST_LIKES - Users can like/favorite watchlists
 *    - Prevents liking own watchlists, analytics for watchlist owners
 * 
 * 5. WATCHLIST_SHARES - Share watchlists with specific users
 *    - View/edit permissions, granular access control
 * 
 * 6. WATCHLIST_COMMENTS - Comments and discussions on watchlists
 *    - Threaded comments (replies), respects watchlist visibility
 */

import { pb } from "@/lib/pb/client";
import { queryOptions } from "@tanstack/react-query";
import { and, eq, or } from "@tigawanna/typed-pocketbase";

// =============================================================================
// QUERY KEY FACTORIES
// =============================================================================

export const watchlistKeys = {
  all: ['watchlists'],
  lists: () => [...watchlistKeys.all, 'list'],
  list: (filters: Record<string, any>) => [...watchlistKeys.lists(), { filters }],
  details: () => [...watchlistKeys.all, 'detail'],
  detail: (id: string) => [...watchlistKeys.details(), id],
  items: (id: string) => [...watchlistKeys.detail(id), 'items'],
  likes: (id: string) => [...watchlistKeys.detail(id), 'likes'],
  comments: (id: string) => [...watchlistKeys.detail(id), 'comments'],
  shares: (id: string) => [...watchlistKeys.detail(id), 'shares'],
  userWatchlists: (userId: string) => [...watchlistKeys.all, 'user', userId],
  publicWatchlists: () => [...watchlistKeys.all, 'public'],
  searchWatchlists: (query: string) => [...watchlistKeys.all, 'search', query],
};

export const userKeys = {
  all: ['users'],
  follows: () => [...userKeys.all, 'follows'],
  followers: (userId: string) => [...userKeys.follows(), 'followers', userId],
  following: (userId: string) => [...userKeys.follows(), 'following', userId],
  likedWatchlists: (userId: string) => [...userKeys.all, 'liked', userId],
  sharedWatchlists: (userId: string) => [...userKeys.all, 'shared', userId],
};

// =============================================================================
// WATCHLIST OPERATIONS
// =============================================================================

/**
 * Get paginated list of watchlists with advanced filtering
 * Respects API access rules for public/private visibility and sharing
 */
export function watchlistsListQueryOptions(options: {
  page?: number;
  perPage?: number;
  filter?: ReturnType<typeof eq | typeof and | typeof or>;
  sort?: string[];
  expand?: {
    owner?: boolean;
    watchlistItems_via_watchlist?: boolean;
    watchlistLikes_via_watchlist?: boolean;
    watchlistShares_via_watchlist?: boolean;
  };
} = {}) {
  const { page = 1, perPage = 20, filter, sort = ['-created'], expand } = options;
  
  return queryOptions({
    queryKey: watchlistKeys.list(options),
    queryFn: () => pb.from("watchlists").getList({
      page,
      perPage,
      filter,
      sort,
      select: {
        id: true,
        title: true,
        description: true,
        isPublic: true,
        category: true,
        coverImage: true,
        tags: true,
        created: true,
        updated: true,
        expand: expand ? {
          owner: expand.owner ? {
            id: true,
            name: true,
            avatar: true,
          } : undefined,
          watchlistItems_via_watchlist: expand.watchlistItems_via_watchlist ? {
            id: true,
            title: true,
            mediaType: true,
          } : undefined,
          watchlistLikes_via_watchlist: expand.watchlistLikes_via_watchlist ? {
            id: true,
          } : undefined,
          watchlistShares_via_watchlist: expand.watchlistShares_via_watchlist ? {
            id: true,
            permission: true,
          } : undefined,
        } : undefined,
      }
    })
  });
}

/**
 * Get single watchlist with full details
 * Automatically expands related data for UI display
 */
export function watchlistDetailQueryOptions(id: string, options: {
  expandItems?: boolean;
  expandLikes?: boolean;
  expandComments?: boolean;
  expandShares?: boolean;
} = {}) {
  const { expandItems = true, expandLikes = true, expandComments = true, expandShares = false } = options;
  
  return queryOptions({
    queryKey: watchlistKeys.detail(id),
    queryFn: () => pb.from("watchlists").getOne(id, {
      select: {
        id: true,
        title: true,
        description: true,
        isPublic: true,
        category: true,
        coverImage: true,
        tags: true,
        created: true,
        updated: true,
        expand: {
          owner: {
            id: true,
            name: true,
            avatar: true,
          },
          watchlistItems_via_watchlist: expandItems ? {
            id: true,
            title: true,
            mediaType: true,
            year: true,
            status: true,
            rating: true,
            personalNote: true,
            order: true,
          } : undefined,
          watchlistLikes_via_watchlist: expandLikes ? {
            id: true,
            expand: {
              user: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          } : undefined,
          watchlistComments_via_watchlist: expandComments ? {
            id: true,
            content: true,
            created: true,
            expand: {
              author: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          } : undefined,
          watchlistShares_via_watchlist: expandShares ? {
            id: true,
            permission: true,
            expand: {
              user: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          } : undefined,
        }
      }
    }),
    enabled: !!id,
  });
}

/**
 * Get public watchlists for discovery feed
 */
export function publicWatchlistsQueryOptions(options: {
  page?: number;
  perPage?: number;
  sort?: string[];
  category?: string;
} = {}) {
  const { page = 1, perPage = 20, sort = ['-created'], category } = options;
  
  const filter = category 
    ? and(eq('isPublic', true), eq('category', category))
    : eq('isPublic', true);
  
  return queryOptions({
    queryKey: watchlistKeys.publicWatchlists(),
    queryFn: () => pb.from("watchlists").getList({
      page,
      perPage,
      filter,
      sort,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        coverImage: true,
        created: true,
        expand: {
          owner: {
            id: true,
            name: true,
            avatar: true,
          },
          watchlistItems_via_watchlist: {
            id: true, // For count
          },
          watchlistLikes_via_watchlist: {
            id: true, // For count
          }
        }
      }
    })
  });
}

/**
 * Get user's own watchlists
 */
export function userWatchlistsQueryOptions(userId: string, options: {
  page?: number;
  perPage?: number;
  includePrivate?: boolean;
} = {}) {
  const { page = 1, perPage = 20, includePrivate = true } = options;
  
  const filter = includePrivate 
    ? eq('owner', userId)
    : and(eq('owner', userId), eq('isPublic', true));
  
  return queryOptions({
    queryKey: watchlistKeys.userWatchlists(userId),
    queryFn: () => pb.from("watchlists").getList({
      page,
      perPage,
      filter,
      sort: ['-created'],
      select: {
        id: true,
        title: true,
        description: true,
        isPublic: true,
        category: true,
        coverImage: true,
        created: true,
        expand: {
          watchlistItems_via_watchlist: {
            id: true, // For count
          }
        }
      }
    }),
    enabled: !!userId,
  });
}

/**
 * Search watchlists by title/description
 */
export function searchWatchlistsQueryOptions(query: string, options: {
  page?: number;
  perPage?: number;
  publicOnly?: boolean;
} = {}) {
  const { page = 1, perPage = 20, publicOnly = true } = options;
  
  const searchFilter = or(
    ['title', '~', query],
    ['description', '~', query]
  );
  
  const filter = publicOnly 
    ? and(searchFilter, eq('isPublic', true))
    : searchFilter;
  
  return queryOptions({
    queryKey: watchlistKeys.searchWatchlists(query),
    queryFn: () => pb.from("watchlists").getList({
      page,
      perPage,
      filter,
      sort: ['-created'],
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        coverImage: true,
        created: true,
        expand: {
          owner: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    }),
    enabled: !!query && query.length > 2,
  });
}

// =============================================================================
// WATCHLIST ITEMS OPERATIONS
// =============================================================================

/**
 * Get items for a specific watchlist
 */
export function watchlistItemsQueryOptions(watchlistId: string, options: {
  sort?: string[];
  status?: string;
} = {}) {
  const { sort = ['order', 'created'], status } = options;
  
  const filter = status 
    ? and(eq('watchlist', watchlistId), eq('status', status))
    : eq('watchlist', watchlistId);
  
  return queryOptions({
    queryKey: watchlistKeys.items(watchlistId),
    queryFn: () => pb.from("watchlistItems").getFullList({
      filter,
      sort,
      select: {
        id: true,
        mediaType: true,
        traktId: true,
        tmdbId: true,
        imdbId: true,
        title: true,
        year: true,
        slug: true,
        metadata: true,
        personalNote: true,
        status: true,
        rating: true,
        order: true,
        created: true,
        updated: true,
      }
    }),
    enabled: !!watchlistId,
  });
}

// =============================================================================
// SOCIAL OPERATIONS
// =============================================================================

/**
 * Get user's followers
 */
export function userFollowersQueryOptions(userId: string, options: {
  page?: number;
  perPage?: number;
} = {}) {
  const { page = 1, perPage = 20 } = options;
  
  return queryOptions({
    queryKey: userKeys.followers(userId),
    queryFn: () => pb.from("userFollows").getList({
      page,
      perPage,
      filter: eq('following', userId),
      sort: ['-created'],
      select: {
        id: true,
        created: true,
        expand: {
          follower: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    }),
    enabled: !!userId,
  });
}

/**
 * Get users that a user is following
 */
export function userFollowingQueryOptions(userId: string, options: {
  page?: number;
  perPage?: number;
} = {}) {
  const { page = 1, perPage = 20 } = options;
  
  return queryOptions({
    queryKey: userKeys.following(userId),
    queryFn: () => pb.from("userFollows").getList({
      page,
      perPage,
      filter: eq('follower', userId),
      sort: ['-created'],
      select: {
        id: true,
        created: true,
        expand: {
          following: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    }),
    enabled: !!userId,
  });
}

/**
 * Check if user is following another user
 */
export function isFollowingQueryOptions(followerId: string, followingId: string) {
  return queryOptions({
    queryKey: [...userKeys.follows(), 'isFollowing', followerId, followingId],
    queryFn: async () => {
      try {
        await pb.from("userFollows").getFirstListItem({
          filter: and(
            eq('follower', followerId),
            eq('following', followingId)
          )
        });
        return true;
      } catch {
        return false;
      }
    },
    enabled: !!followerId && !!followingId && followerId !== followingId,
  });
}

/**
 * Get likes for a watchlist
 */
export function watchlistLikesQueryOptions(watchlistId: string, options: {
  page?: number;
  perPage?: number;
} = {}) {
  const { page = 1, perPage = 20 } = options;
  
  return queryOptions({
    queryKey: watchlistKeys.likes(watchlistId),
    queryFn: () => pb.from("watchlistLikes").getList({
      page,
      perPage,
      filter: eq('watchlist', watchlistId),
      sort: ['-created'],
      select: {
        id: true,
        created: true,
        expand: {
          user: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    }),
    enabled: !!watchlistId,
  });
}

/**
 * Check if user liked a watchlist
 */
export function isWatchlistLikedQueryOptions(watchlistId: string, userId: string) {
  return queryOptions({
    queryKey: [...watchlistKeys.likes(watchlistId), 'isLiked', userId],
    queryFn: async () => {
      try {
        await pb.from("watchlistLikes").getFirstListItem({
          filter: and(
            eq('watchlist', watchlistId),
            eq('user', userId)
          )
        });
        return true;
      } catch {
        return false;
      }
    },
    enabled: !!watchlistId && !!userId,
  });
}

/**
 * Get user's liked watchlists
 */
export function userLikedWatchlistsQueryOptions(userId: string, options: {
  page?: number;
  perPage?: number;
} = {}) {
  const { page = 1, perPage = 20 } = options;
  
  return queryOptions({
    queryKey: userKeys.likedWatchlists(userId),
    queryFn: () => pb.from("watchlistLikes").getList({
      page,
      perPage,
      filter: eq('user', userId),
      sort: ['-created'],
      select: {
        id: true,
        created: true,
        expand: {
          watchlist: {
            id: true,
            title: true,
            description: true,
            category: true,
            coverImage: true,
            expand: {
              owner: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          }
        }
      }
    }),
    enabled: !!userId,
  });
}

/**
 * Get comments for a watchlist
 */
export function watchlistCommentsQueryOptions(watchlistId: string, options: {
  page?: number;
  perPage?: number;
  parentOnly?: boolean;
} = {}) {
  const { page = 1, perPage = 20, parentOnly = true } = options;
  
  const filter = parentOnly 
    ? and(eq('watchlist', watchlistId), eq('parentComment', ''))
    : eq('watchlist', watchlistId);
  
  return queryOptions({
    queryKey: watchlistKeys.comments(watchlistId),
    queryFn: () => pb.from("watchlistComments").getList({
      page,
      perPage,
      filter,
      sort: ['-created'],
      select: {
        id: true,
        content: true,
        created: true,
        updated: true,
        expand: {
          author: {
            id: true,
            name: true,
            avatar: true,
          },
          watchlistComments_via_parentComment: {
            id: true,
            content: true,
            created: true,
            expand: {
              author: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          }
        }
      }
    }),
    enabled: !!watchlistId,
  });
}

/**
 * Get shared watchlists for a user
 */
export function sharedWatchlistsQueryOptions(userId: string, options: {
  page?: number;
  perPage?: number;
  permission?: 'view' | 'edit';
} = {}) {
  const { page = 1, perPage = 20, permission } = options;
  
  const filter = permission 
    ? and(eq('user', userId), eq('permission', permission))
    : eq('user', userId);
  
  return queryOptions({
    queryKey: userKeys.sharedWatchlists(userId),
    queryFn: () => pb.from("watchlistShares").getList({
      page,
      perPage,
      filter,
      sort: ['-created'],
      select: {
        id: true,
        permission: true,
        created: true,
        expand: {
          watchlist: {
            id: true,
            title: true,
            description: true,
            category: true,
            coverImage: true,
            expand: {
              owner: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          }
        }
      }
    }),
    enabled: !!userId,
  });
}
