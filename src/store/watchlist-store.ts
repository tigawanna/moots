import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { type WatchedStatus, type WatchlistItem } from '../lib/pb/types/watchlist-types';

/**
 * Watchlist UI State
 * Manages local UI state, filters, and preferences
 */
interface WatchlistUIState {
  // View preferences
  viewMode: 'grid' | 'list';
  sortBy: 'added_date' | 'title' | 'release_date' | 'vote_average' | 'personal_rating';
  sortOrder: 'asc' | 'desc';
  
  // Filters
  statusFilter: 'all' | WatchedStatus;
  genreFilter: number | null;
  ratingFilter: { min: number; max: number } | null;
  
  // Search
  searchQuery: string;
  
  // UI state
  isSearchActive: boolean;
  selectedItems: string[]; // For batch operations
  
  // Actions
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: WatchlistUIState['sortBy']) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setStatusFilter: (status: WatchlistUIState['statusFilter']) => void;
  setGenreFilter: (genreId: number | null) => void;
  setRatingFilter: (filter: { min: number; max: number } | null) => void;
  setSearchQuery: (query: string) => void;
  setSearchActive: (active: boolean) => void;
  toggleItemSelection: (itemId: string) => void;
  selectAllItems: (itemIds: string[]) => void;
  clearSelection: () => void;
  resetFilters: () => void;
}

/**
 * Watchlist Cache State
 * Manages optimistic updates and temporary state
 */
interface WatchlistCacheState {
  // Optimistic updates
  pendingAdds: Map<string, { tmdbId: number; mediaType: 'movie' | 'tv'; timestamp: number }>;
  pendingRemoves: Set<string>;
  pendingUpdates: Map<string, Partial<WatchlistItem>>;
  
  // Temporary data
  recentlyAdded: Array<{ tmdbId: number; mediaType: 'movie' | 'tv'; timestamp: number }>;
  recentlyRemoved: Array<{ tmdbId: number; mediaType: 'movie' | 'tv'; timestamp: number }>;
  
  // Actions
  addPendingAdd: (key: string, data: { tmdbId: number; mediaType: 'movie' | 'tv' }) => void;
  removePendingAdd: (key: string) => void;
  addPendingRemove: (itemId: string) => void;
  removePendingRemove: (itemId: string) => void;
  addPendingUpdate: (itemId: string, update: Partial<WatchlistItem>) => void;
  removePendingUpdate: (itemId: string) => void;
  addToRecentlyAdded: (tmdbId: number, mediaType: 'movie' | 'tv') => void;
  addToRecentlyRemoved: (tmdbId: number, mediaType: 'movie' | 'tv') => void;
  clearRecentActivity: () => void;
  clearAllPending: () => void;
}

/**
 * Watchlist Statistics State
 * Cached stats for quick access
 */
interface WatchlistStatsState {
  stats: {
    total: number;
    watched: number;
    watching: number;
    unwatched: number;
    movies: number;
    tvShows: number;
    averageRating: number;
    limitUsed: number;
  } | null;
  lastUpdated: number | null;
  
  // Actions
  updateStats: (stats: WatchlistStatsState['stats']) => void;
  clearStats: () => void;
  isStatsStale: () => boolean;
}

// Create the UI state store with persistence
export const useWatchlistUIStore = create<WatchlistUIState>()(
  persist(
    (set, get) => ({
      // Initial state
      viewMode: 'grid',
      sortBy: 'added_date',
      sortOrder: 'desc',
      statusFilter: 'all',
      genreFilter: null,
      ratingFilter: null,
      searchQuery: '',
      isSearchActive: false,
      selectedItems: [],

      // Actions
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setSortBy: (sortBy) => set({ sortBy }),
      
      setSortOrder: (order) => set({ sortOrder: order }),
      
      setStatusFilter: (status) => set({ statusFilter: status }),
      
      setGenreFilter: (genreId) => set({ genreFilter: genreId }),
      
      setRatingFilter: (filter) => set({ ratingFilter: filter }),
      
      setSearchQuery: (query) => set({ 
        searchQuery: query,
        isSearchActive: query.trim().length > 0
      }),
      
      setSearchActive: (active) => set({ isSearchActive: active }),
      
      toggleItemSelection: (itemId) => set((state) => ({
        selectedItems: state.selectedItems.includes(itemId)
          ? state.selectedItems.filter(id => id !== itemId)
          : [...state.selectedItems, itemId]
      })),
      
      selectAllItems: (itemIds) => set({ selectedItems: itemIds }),
      
      clearSelection: () => set({ selectedItems: [] }),
      
      resetFilters: () => set({
        statusFilter: 'all',
        genreFilter: null,
        ratingFilter: null,
        searchQuery: '',
        isSearchActive: false,
      }),
    }),
    {
      name: 'watchlist-ui-state',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        // Don't persist filters and search - reset on app restart
      }),
    }
  )
);

// Create the cache state store (no persistence - runtime only)
export const useWatchlistCacheStore = create<WatchlistCacheState>((set, get) => ({
  // Initial state
  pendingAdds: new Map(),
  pendingRemoves: new Set(),
  pendingUpdates: new Map(),
  recentlyAdded: [],
  recentlyRemoved: [],

  // Actions
  addPendingAdd: (key, data) => set((state) => {
    const newPendingAdds = new Map(state.pendingAdds);
    newPendingAdds.set(key, { ...data, timestamp: Date.now() });
    return { pendingAdds: newPendingAdds };
  }),

  removePendingAdd: (key) => set((state) => {
    const newPendingAdds = new Map(state.pendingAdds);
    newPendingAdds.delete(key);
    return { pendingAdds: newPendingAdds };
  }),

  addPendingRemove: (itemId) => set((state) => ({
    pendingRemoves: new Set([...state.pendingRemoves, itemId])
  })),

  removePendingRemove: (itemId) => set((state) => {
    const newPendingRemoves = new Set(state.pendingRemoves);
    newPendingRemoves.delete(itemId);
    return { pendingRemoves: newPendingRemoves };
  }),

  addPendingUpdate: (itemId, update) => set((state) => {
    const newPendingUpdates = new Map(state.pendingUpdates);
    newPendingUpdates.set(itemId, { ...state.pendingUpdates.get(itemId), ...update });
    return { pendingUpdates: newPendingUpdates };
  }),

  removePendingUpdate: (itemId) => set((state) => {
    const newPendingUpdates = new Map(state.pendingUpdates);
    newPendingUpdates.delete(itemId);
    return { pendingUpdates: newPendingUpdates };
  }),

  addToRecentlyAdded: (tmdbId, mediaType) => set((state) => ({
    recentlyAdded: [
      { tmdbId, mediaType, timestamp: Date.now() },
      ...state.recentlyAdded.slice(0, 9) // Keep last 10
    ]
  })),

  addToRecentlyRemoved: (tmdbId, mediaType) => set((state) => ({
    recentlyRemoved: [
      { tmdbId, mediaType, timestamp: Date.now() },
      ...state.recentlyRemoved.slice(0, 9) // Keep last 10
    ]
  })),

  clearRecentActivity: () => set({
    recentlyAdded: [],
    recentlyRemoved: []
  }),

  clearAllPending: () => set({
    pendingAdds: new Map(),
    pendingRemoves: new Set(),
    pendingUpdates: new Map(),
  }),
}));

// Create the stats state store with light persistence
export const useWatchlistStatsStore = create<WatchlistStatsState>()(
  persist(
    (set, get) => ({
      // Initial state
      stats: null,
      lastUpdated: null,

      // Actions
      updateStats: (stats) => set({
        stats,
        lastUpdated: Date.now()
      }),

      clearStats: () => set({
        stats: null,
        lastUpdated: null
      }),

      isStatsStale: () => {
        const { lastUpdated } = get();
        if (!lastUpdated) return true;
        
        // Stats are stale after 5 minutes
        return Date.now() - lastUpdated > 5 * 60 * 1000;
      },
    }),
    {
      name: 'watchlist-stats',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/**
 * Utility hooks for common operations
 */

// Get current filter configuration
export const useWatchlistFilters = () => {
  const {
    statusFilter,
    genreFilter,
    ratingFilter,
    searchQuery,
    sortBy,
    sortOrder,
    setStatusFilter,
    setGenreFilter,
    setRatingFilter,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    resetFilters
  } = useWatchlistUIStore();

  // Build filter string for API
  const buildFilterString = () => {
    const filters = [];

    if (statusFilter !== 'all') {
      filters.push(`watched_status = "${statusFilter}"`);
    }

    if (genreFilter) {
      filters.push(`genre_ids ~ "${genreFilter}"`);
    }

    if (ratingFilter) {
      filters.push(`vote_average >= ${ratingFilter.min} && vote_average <= ${ratingFilter.max}`);
    }

    return filters.join(' && ');
  };

  // Build sort string for API
  const buildSortString = () => {
    const prefix = sortOrder === 'desc' ? '-' : '';
    return `${prefix}${sortBy}`;
  };

  return {
    statusFilter,
    genreFilter,
    ratingFilter,
    searchQuery,
    sortBy,
    sortOrder,
    setStatusFilter,
    setGenreFilter,
    setRatingFilter,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    resetFilters,
    filterString: buildFilterString(),
    sortString: buildSortString(),
    hasActiveFilters: statusFilter !== 'all' || genreFilter !== null || ratingFilter !== null,
  };
};

// Check if item is in pending state
export const useWatchlistPendingState = (tmdbId: number, mediaType: 'movie' | 'tv') => {
  const { pendingAdds, pendingRemoves } = useWatchlistCacheStore();
  
  const key = `${tmdbId}-${mediaType}`;
  const isPendingAdd = pendingAdds.has(key);
  
  return {
    isPendingAdd,
    isPendingRemove: false, // Would need item ID for this
    pendingData: pendingAdds.get(key),
  };
};

// Get recent activity for notifications/feedback
export const useRecentWatchlistActivity = () => {
  const { recentlyAdded, recentlyRemoved } = useWatchlistCacheStore();
  
  return {
    recentlyAdded,
    recentlyRemoved,
    hasRecentActivity: recentlyAdded.length > 0 || recentlyRemoved.length > 0,
  };
};