// import { QueryClient } from '@tanstack/react-query';
// import { watchlistKeys } from '../query-keys';
// // import { WatchlistAPI, WatchlistUtils } from './watchlist/old/watchlist-api';
// import {
//   type CreateWatchlistItemInput,
//   type UpdateWatchlistItemInput,
//   type WatchlistItem
// } from './watchlist/watchlist-types';

// /**
//  * Advanced watchlist operations with optimistic updates
//  * These functions handle complex state management scenarios
//  */

// /**
//  * Add TMDB item to watchlist with full optimistic updates
//  */
// export async function addTMDBItemToWatchlist(
//   queryClient: QueryClient,
//   tmdbData: any,
//   userId: string,
//   mediaType: 'movie' | 'tv'
// ) {
//   // Convert TMDB data to watchlist format
//   const watchlistItem = WatchlistUtils.tmdbToWatchlistItem(tmdbData, userId, mediaType);
  
//   // Check limit first
//   const limitCheck = await WatchlistUtils.validateWatchlistLimit(userId);
//   if (!limitCheck.canAdd) {
//     throw new Error(`Watchlist limit reached (${limitCheck.currentCount}/${limitCheck.limit} items)`);
//   }

//   // Optimistically update the status cache
//   const statusKey = watchlistKeys.status(userId, tmdbData.id, mediaType);
//   const tempItem: WatchlistItem = {
//     ...watchlistItem,
//     id: `temp-${Date.now()}`,
//     created: new Date().toISOString(),
//     updated: new Date().toISOString(),
//   };

//   queryClient.setQueryData(statusKey, tempItem);

//   try {
//     // Add to database
//     const result = await WatchlistAPI.addToWatchlist(watchlistItem);
    
//     // Update cache with real data
//     queryClient.setQueryData(statusKey, result);
    
//     // Invalidate related queries
//     queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
//     queryClient.invalidateQueries({ queryKey: watchlistKeys.stats(userId) });
    
//     return result;
//   } catch (error) {
//     // Revert optimistic update on error
//     queryClient.setQueryData(statusKey, null);
//     throw error;
//   }
// }

// /**
//  * Remove item from watchlist with optimistic updates
//  */
// export async function removeFromWatchlistOptimistic(
//   queryClient: QueryClient,
//   item: WatchlistItem
// ) {
//   const statusKey = watchlistKeys.status(item.user_id, item.tmdb_id, item.media_type);
  
//   // Store previous state
//   const previousStatus = queryClient.getQueryData(statusKey);
  
//   // Optimistically remove
//   queryClient.setQueryData(statusKey, null);
  
//   try {
//     await WatchlistAPI.removeFromWatchlist(item.id);
    
//     // Invalidate related queries
//     queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
//     queryClient.invalidateQueries({ queryKey: watchlistKeys.stats(item.user_id) });
    
//   } catch (error) {
//     // Revert on error
//     queryClient.setQueryData(statusKey, previousStatus);
//     throw error;
//   }
// }

// /**
//  * Batch update multiple watchlist items
//  */
// export async function batchUpdateWatchlistItems(
//   queryClient: QueryClient,
//   updates: { id: string; data: UpdateWatchlistItemInput }[]
// ) {
//   const results = [];
//   const errors = [];

//   for (const update of updates) {
//     try {
//       const result = await WatchlistAPI.updateWatchlistItem(update.id, update.data);
//       results.push(result);
      
//       // Update individual item cache
//       queryClient.setQueryData(watchlistKeys.detail(update.id), result);
//     } catch (error) {
//       errors.push({ 
//         id: update.id, 
//         error: error instanceof Error ? error.message : 'Unknown error' 
//       });
//     }
//   }

//   // Invalidate list queries if any updates succeeded
//   if (results.length > 0) {
//     queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
    
//     // Invalidate stats for affected users
//     const userIds = [...new Set(results.map(item => item.user_id))];
//     userIds.forEach(userId => {
//       queryClient.invalidateQueries({ queryKey: watchlistKeys.stats(userId) });
//     });
//   }

//   return { results, errors };
// }

// /**
//  * Mark multiple items as watched
//  */
// export async function markMultipleAsWatched(
//   queryClient: QueryClient,
//   itemIds: string[],
//   watched: boolean = true
// ) {
//   const updates = itemIds.map(id => ({
//     id,
//     data: {
//       watched_status: watched ? 'watched' as const : 'unwatched' as const,
//       watch_date: watched ? new Date().toISOString() : null,
//     }
//   }));

//   return batchUpdateWatchlistItems(queryClient, updates);
// }

// /**
//  * Import community watchlist with user selection
//  */
// export async function importCommunityWatchlist(
//   queryClient: QueryClient,
//   communityItems: any[],
//   userId: string,
//   selectedItemIds: string[] = []
// ) {
//   // Filter items if specific selection provided
//   const itemsToImport = selectedItemIds.length > 0 
//     ? communityItems.filter(item => selectedItemIds.includes(item.id))
//     : communityItems;

//   // Convert to watchlist format
//   const watchlistItems: CreateWatchlistItemInput[] = itemsToImport.map(item => 
//     WatchlistUtils.tmdbToWatchlistItem(item, userId, item.media_type)
//   );

//   // Check limit
//   const limitCheck = await WatchlistUtils.validateWatchlistLimit(userId);
//   const availableSlots = limitCheck.limit - limitCheck.currentCount;
  
//   if (watchlistItems.length > availableSlots) {
//     throw new Error(
//       `Cannot import ${watchlistItems.length} items. Only ${availableSlots} slots available (${limitCheck.currentCount}/${limitCheck.limit})`
//     );
//   }

//   // Bulk import
//   const result = await WatchlistAPI.bulkAddToWatchlist(watchlistItems);
  
//   // Invalidate caches
//   queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
//   queryClient.invalidateQueries({ queryKey: watchlistKeys.stats(userId) });
  
//   // Update status for successfully imported items
//   result.results.forEach(item => {
//     queryClient.setQueryData(
//       watchlistKeys.status(item.user_id, item.tmdb_id, item.media_type),
//       item
//     );
//   });

//   return result;
// }

// /**
//  * Reorder watchlist items (if order field is added later)
//  */
// export async function reorderWatchlistItems(
//   queryClient: QueryClient,
//   userId: string,
//   reorderedItems: { id: string; order: number }[]
// ) {
//   const updates = reorderedItems.map(item => ({
//     id: item.id,
//     data: { order: item.order } as UpdateWatchlistItemInput
//   }));

//   const result = await batchUpdateWatchlistItems(queryClient, updates);
  
//   // Force refresh of the list to show new order
//   queryClient.invalidateQueries({ queryKey: watchlistKeys.list(userId) });
  
//   return result;
// }

// /**
//  * Smart cleanup - suggest items to remove when approaching limit
//  */
// export async function suggestItemsForCleanup(userId: string) {
//   const stats = await WatchlistAPI.getWatchlistStats(userId);
  
//   if (stats.limitUsed < 80) {
//     return { suggestions: [], reason: 'Limit not approaching' };
//   }

//   // Get all user items
//   const allItems = await WatchlistAPI.getUserWatchlist({ 
//     userId, 
//     perPage: 50,
//     sort: 'added_date' 
//   });

//   const suggestions = [];

//   // Suggest watched items added more than 30 days ago
//   const thirtyDaysAgo = new Date();
//   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//   for (const item of allItems.items) {
//     if (item.watched_status === 'watched' && 
//         new Date(item.added_date) < thirtyDaysAgo) {
//       suggestions.push({
//         item,
//         reason: 'Watched more than 30 days ago'
//       });
//     }
//   }

//   // If not enough watched items, suggest oldest unwatched items with low ratings
//   if (suggestions.length < 5) {
//     const oldUnwatched = allItems.items
//       .filter(item => 
//         item.watched_status === 'unwatched' && 
//         item.vote_average < 6.0 &&
//         new Date(item.added_date) < thirtyDaysAgo
//       )
//       .sort((a, b) => new Date(a.added_date).getTime() - new Date(b.added_date).getTime())
//       .slice(0, 5 - suggestions.length);

//     oldUnwatched.forEach(item => {
//       suggestions.push({
//         item,
//         reason: 'Old unwatched item with low rating'
//       });
//     });
//   }

//   return { 
//     suggestions: suggestions.slice(0, 10), // Max 10 suggestions
//     reason: `Watchlist is ${Math.round(stats.limitUsed)}% full`
//   };
// }

// /**
//  * Prefetch related data for better UX
//  */
// export function prefetchWatchlistData(queryClient: QueryClient, userId: string) {
//   // Prefetch stats
//   queryClient.prefetchQuery({
//     queryKey: watchlistKeys.stats(userId),
//     queryFn: () => WatchlistAPI.getWatchlistStats(userId)
//   });

//   // Prefetch first page of watchlist
//   queryClient.prefetchQuery({
//     queryKey: watchlistKeys.list(userId),
//     queryFn: () => WatchlistAPI.getUserWatchlist({ userId, page: 1, perPage: 20 })
//   });
// }

// /**
//  * Cache warming for TMDB status checks
//  */
// export function warmWatchlistStatusCache(
//   queryClient: QueryClient,
//   userId: string,
//   tmdbItems: { id: number; media_type: 'movie' | 'tv' }[]
// ) {
//   // Batch check status for multiple items
//   tmdbItems.forEach(item => {
//     queryClient.prefetchQuery({
//       queryKey: watchlistKeys.status(userId, item.id, item.media_type),
//       queryFn: () => WatchlistAPI.checkWatchlistStatus(userId, item.id, item.media_type)
//     });
//   });
// }
