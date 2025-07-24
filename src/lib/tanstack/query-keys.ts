/**
 * Query key factory with proper TypeScript typing for TanStack Query
 */

// Define the base query key types
export type QueryKeyBase = 
  | 'auth'
  | 'user' 
  | 'watchlist'
  | 'viewer'
  | 'trakt_tokens_state'
  | 'trakt'
  | 'tmdb'
  | 'testId';

// Query key factory with proper typing
export const createQueryKeys = <T extends QueryKeyBase>(base: T) => ({
  all: () => [base],
  lists: () => [base, 'list'],
  list: (userId?: string, filters?: string) => [base, 'list', userId, filters],
  details: () => [base, 'detail'],
  detail: (id: string) => [base, 'detail', id],
  status: (userId: string, tmdbId: number, mediaType: 'movie' | 'tv') => 
    [base, 'status', userId, tmdbId, mediaType],
  stats: (userId: string) => [base, 'stats', userId],
  search: (userId: string, query: string) => [base, 'search', userId, query],
});

// Watchlist query keys
export const watchlistKeys = {
  ...createQueryKeys('watchlist'),
  
  // Community watchlists
  community: {
    all: () => ['watchlist', 'community'],
    lists: () => ['watchlist', 'community', 'list'],
    list: (filters?: string) => ['watchlist', 'community', 'list', filters],
    user: (userId: string) => ['watchlist', 'community', 'user', userId],
    search: (query: string) => ['watchlist', 'community', 'search', query],
  }
};

// Other query key factories
export const traktKeys = createQueryKeys('trakt');
export const tmdbKeys = createQueryKeys('tmdb');
export const userKeys = createQueryKeys('user');
export const authKeys = createQueryKeys('auth');
