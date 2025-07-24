import { pb } from '../lib/pb/client';
import { useWatchlistLimit as useWatchlistLimitQuery, useWatchlistStats } from '../lib/tanstack/operations/watchlist/old/watchlist-hooks';
import { useWatchlistStatsStore } from '../store/watchlist-store';

/**
 * Hook to manage watchlist limit (50 items)
 * Provides limit checking, warnings, and suggestions
 */
export function useWatchlistLimit() {
  const userId = pb.authStore.model?.id;
  
  // Get limit data from server
  const {
    data: limitData,
    isLoading: limitLoading,
    error: limitError,
    refetch: refetchLimit
  } = useWatchlistLimitQuery(userId || '');
  
  // Get stats for additional context
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError
  } = useWatchlistStats(userId || '');
  
  // Get cached stats for immediate feedback
  const { stats: cachedStats, isStatsStale } = useWatchlistStatsStore();
  
  // Use cached stats if server data is loading and cache is fresh
  const currentStats = stats || (!statsLoading && !isStatsStale() ? cachedStats : null);
  
  const currentCount = limitData?.currentCount ?? currentStats?.total ?? 0;
  const limit = limitData?.limit ?? 50;
  const canAdd = limitData?.canAdd ?? currentCount < limit;
  
  // Calculate percentages and warnings
  const usagePercentage = (currentCount / limit) * 100;
  const remainingSlots = limit - currentCount;
  
  // Warning levels
  const isNearLimit = usagePercentage >= 80; // 40+ items
  const isAtLimit = usagePercentage >= 100; // 50 items
  const isApproachingLimit = usagePercentage >= 60; // 30+ items
  
  // Get warning message
  const getWarningMessage = () => {
    if (isAtLimit) {
      return 'Watchlist is full! Remove some items to add new ones.';
    }
    if (isNearLimit) {
      return `Watchlist is almost full (${currentCount}/${limit}). Consider removing watched items.`;
    }
    if (isApproachingLimit) {
      return `Watchlist is getting full (${currentCount}/${limit}). You have ${remainingSlots} slots remaining.`;
    }
    return null;
  };
  
  // Get warning color
  const getWarningColor = () => {
    if (isAtLimit) return '#F44336'; // Red
    if (isNearLimit) return '#FF9800'; // Orange
    if (isApproachingLimit) return '#FFC107'; // Amber
    return '#4CAF50'; // Green
  };
  
  // Get suggestions for cleanup
  const getCleanupSuggestions = () => {
    if (!currentStats) return [];
    
    const suggestions = [];
    
    if (currentStats.watched > 0) {
      suggestions.push({
        type: 'watched',
        count: currentStats.watched,
        message: `Remove ${currentStats.watched} watched items`,
        priority: 'high'
      });
    }
    
    // Could add more sophisticated suggestions based on:
    // - Items added long ago but never watched
    // - Items with low personal ratings
    // - Items with low TMDB ratings
    
    return suggestions;
  };
  
  return {
    // Basic limit info
    currentCount,
    limit,
    canAdd,
    remainingSlots,
    usagePercentage,
    
    // Warning states
    isNearLimit,
    isAtLimit,
    isApproachingLimit,
    warningMessage: getWarningMessage(),
    warningColor: getWarningColor(),
    
    // Loading states
    isLoading: limitLoading || statsLoading,
    error: limitError || statsError,
    
    // Actions
    refetch: refetchLimit,
    
    // Cleanup helpers
    cleanupSuggestions: getCleanupSuggestions(),
    hasCleanupSuggestions: getCleanupSuggestions().length > 0,
    
    // UI helpers
    progressBarProps: {
      progress: usagePercentage / 100,
      color: getWarningColor(),
    },
    
    // Validation helper
    validateAddition: (itemCount: number = 1) => {
      const wouldExceed = currentCount + itemCount > limit;
      return {
        canAdd: !wouldExceed,
        wouldExceed,
        slotsNeeded: wouldExceed ? (currentCount + itemCount) - limit : 0,
        message: wouldExceed 
          ? `Cannot add ${itemCount} item${itemCount > 1 ? 's' : ''}. Need to remove ${(currentCount + itemCount) - limit} item${(currentCount + itemCount) - limit > 1 ? 's' : ''} first.`
          : `Can add ${itemCount} item${itemCount > 1 ? 's' : ''}. ${remainingSlots - itemCount} slots will remain.`
      };
    }
  };
}

/**
 * Hook for bulk import limit checking
 * Specifically for community watchlist imports
 */
export function useBulkImportLimit() {
  const limitInfo = useWatchlistLimit();
  
  const validateBulkImport = (itemsToImport: number) => {
    const validation = limitInfo.validateAddition(itemsToImport);
    
    return {
      ...validation,
      
      // Bulk-specific helpers
      canImportAll: validation.canAdd,
      maxImportable: limitInfo.remainingSlots,
      suggestedBatchSize: Math.min(itemsToImport, limitInfo.remainingSlots),
      
      // Import strategies
      importStrategies: [
        {
          type: 'partial',
          count: Math.min(itemsToImport, limitInfo.remainingSlots),
          message: `Import ${Math.min(itemsToImport, limitInfo.remainingSlots)} items now`,
          available: limitInfo.remainingSlots > 0
        },
        {
          type: 'cleanup_first',
          count: itemsToImport,
          message: `Remove ${validation.slotsNeeded} items, then import all ${itemsToImport}`,
          available: limitInfo.hasCleanupSuggestions && validation.slotsNeeded <= limitInfo.cleanupSuggestions.reduce((sum, s) => sum + s.count, 0)
        },
        {
          type: 'selective',
          count: 0, // User chooses
          message: 'Choose specific items to import',
          available: true
        }
      ].filter(strategy => strategy.available)
    };
  };
  
  return {
    ...limitInfo,
    validateBulkImport,
    
    // Quick checks
    canImportAny: limitInfo.remainingSlots > 0,
    maxBulkImport: limitInfo.remainingSlots,
  };
}

/**
 * Hook for watchlist limit notifications
 * Manages when to show limit-related notifications
 */
export function useWatchlistLimitNotifications() {
  const limitInfo = useWatchlistLimit();
  
  // Determine if we should show notifications
  const shouldShowLimitWarning = limitInfo.isNearLimit && !limitInfo.isAtLimit;
  const shouldShowLimitReached = limitInfo.isAtLimit;
  const shouldShowCleanupSuggestion = limitInfo.isApproachingLimit && limitInfo.hasCleanupSuggestions;
  
  return {
    shouldShowLimitWarning,
    shouldShowLimitReached,
    shouldShowCleanupSuggestion,
    
    // Notification content
    notifications: [
      {
        id: 'limit-warning',
        show: shouldShowLimitWarning,
        type: 'warning' as const,
        title: 'Watchlist Almost Full',
        message: limitInfo.warningMessage,
        action: 'View Cleanup Suggestions'
      },
      {
        id: 'limit-reached',
        show: shouldShowLimitReached,
        type: 'error' as const,
        title: 'Watchlist Full',
        message: limitInfo.warningMessage,
        action: 'Manage Watchlist'
      },
      {
        id: 'cleanup-suggestion',
        show: shouldShowCleanupSuggestion,
        type: 'info' as const,
        title: 'Optimize Your Watchlist',
        message: `You have ${limitInfo.cleanupSuggestions[0]?.count || 0} watched items that could be removed.`,
        action: 'Clean Up Now'
      }
    ].filter(notification => notification.show)
  };
}
