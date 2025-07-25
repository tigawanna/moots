import { MaterialIcons } from '@expo/vector-icons';
import { pb } from '../lib/pb/client';
import { useWatchlistStatus as useWatchlistStatusQuery } from '../lib/tanstack/operations/watchlist/old/watchlist-hooks';
import { useWatchlistPendingState } from '../store/watchlist-store';

/**
 * Hook to check if a TMDB item is in the user's watchlist
 * Combines server state with optimistic updates
 */
export function useWatchlistStatus(tmdbId: number, mediaType: 'movie' | 'tv') {
  const userId = pb.authStore.model?.id;
  
  // Get server state
  const {
    data: serverStatus,
    isLoading,
    error,
    refetch
  } = useWatchlistStatusQuery(userId || '', tmdbId, mediaType);
  
  // Get pending state for optimistic updates
  const { isPendingAdd, pendingData } = useWatchlistPendingState(tmdbId, mediaType);
  
  // Determine final status
  const isInWatchlist = isPendingAdd || !!serverStatus;
  const watchlistItem = isPendingAdd ? pendingData : serverStatus;
  
  return {
    isInWatchlist,
    watchlistItem: serverStatus, // Always return server data for actual item
    isLoading: isLoading && !isPendingAdd, // Don't show loading if we have pending state
    error,
    isPending: isPendingAdd,
    refetch,
    
    // Convenience properties
    isWatched: serverStatus?.watched_status === 'watched',
    isWatching: serverStatus?.watched_status === 'watching',
    personalRating: serverStatus?.personal_rating,
    notes: serverStatus?.notes,
    addedDate: serverStatus?.added_date,
    watchDate: serverStatus?.watch_date,
  };
}

/**
 * Hook for batch checking multiple items' watchlist status
 * Useful for TMDB lists/grids
 */
export function useBatchWatchlistStatus(items: { id: number; media_type: 'movie' | 'tv' }[]) {
  const userId = pb.authStore.model?.id;
  
  // Create individual queries for each item
  const statusQueries = items.map(item => 
    useWatchlistStatusQuery(userId || '', item.id, item.media_type)
  );
  
  // Combine results
  const statusMap = new Map();
  const isLoading = statusQueries.some(query => query.isLoading);
  const hasError = statusQueries.some(query => query.error);
  
  statusQueries.forEach((query, index) => {
    const item = items[index];
    const key = `${item.id}-${item.media_type}`;
    statusMap.set(key, {
      isInWatchlist: !!query.data,
      watchlistItem: query.data,
      isLoading: query.isLoading,
      error: query.error,
    });
  });
  
  return {
    statusMap,
    isLoading,
    hasError,
    
    // Helper function to get status for specific item
    getStatus: (tmdbId: number, mediaType: 'movie' | 'tv') => {
      const key = `${tmdbId}-${mediaType}`;
      return statusMap.get(key) || {
        isInWatchlist: false,
        watchlistItem: null,
        isLoading: false,
        error: null,
      };
    },
  };
}

/**
 * Hook to get watchlist status with additional metadata
 * Includes genre names, formatted dates, etc.
 */
export function useEnhancedWatchlistStatus(tmdbId: number, mediaType: 'movie' | 'tv') {
  const baseStatus = useWatchlistStatus(tmdbId, mediaType);
  
  // Helper functions for formatting
  const formatAddedDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Added yesterday';
    if (diffDays < 7) return `Added ${diffDays} days ago`;
    if (diffDays < 30) return `Added ${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `Added ${Math.ceil(diffDays / 30)} months ago`;
    return `Added ${Math.ceil(diffDays / 365)} years ago`;
  };
  
  const formatWatchDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusColor = () => {
    if (!baseStatus.isInWatchlist) return 'transparent';
    
    switch (baseStatus.watchlistItem?.watched_status) {
      case 'watched': return '#4CAF50'; // Green
      case 'watching': return '#FF9800'; // Orange
      case 'unwatched': return '#2196F3'; // Blue
      default: return '#757575'; // Grey
    }
  };
  
  const getStatusIcon = (): keyof typeof MaterialIcons.glyphMap => {
    if (!baseStatus.isInWatchlist) return 'bookmark-outline';
    
    switch (baseStatus.watchlistItem?.watched_status) {
      case 'watched': return 'check-circle';
      case 'watching': return 'play-circle-outline';
      case 'unwatched': return 'bookmark';
      default: return 'bookmark';
    }
  };
  
  return {
    ...baseStatus,
    
    // Formatted data
    formattedAddedDate: formatAddedDate(baseStatus.addedDate),
    formattedWatchDate: formatWatchDate(baseStatus.watchDate),
    
    // UI helpers
    statusColor: getStatusColor(),
    statusIcon: getStatusIcon(),
    statusText: baseStatus.isInWatchlist 
      ? baseStatus.watchlistItem?.watched_status || 'In Watchlist'
      : 'Add to Watchlist',
    
    // Rating helpers
    hasPersonalRating: !!baseStatus.personalRating,
    personalRatingStars: baseStatus.personalRating ? Math.round(baseStatus.personalRating / 2) : 0, // Convert 1-10 to 1-5 stars
    
    // Notes helpers
    hasNotes: !!baseStatus.notes?.trim(),
    shortNotes: baseStatus.notes && baseStatus.notes.length > 100 
      ? `${baseStatus.notes.substring(0, 100)}...` 
      : baseStatus.notes,
  };
}
