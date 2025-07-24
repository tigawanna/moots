// import { z } from 'zod';
// import {
//   MEDIA_TYPES,
//   WATCHED_STATUSES,
//   WATCHLIST_CATEGORIES
// } from '../../tanstack/operations/watchlist/watchlist-types';

// // Base schemas for validation
// export const watchedStatusSchema = z.enum(WATCHED_STATUSES);
// export const watchlistCategorySchema = z.enum(WATCHLIST_CATEGORIES);
// export const mediaTypeSchema = z.enum(MEDIA_TYPES);

// /**
//  * Schema for creating a new watchlist item
//  * Validates TMDB data + user preferences
//  */
// export const createWatchlistItemSchema = z.object({
//   user_id: z.string().min(1, 'User ID is required'),
  
//   // TMDB Core Data
//   tmdb_id: z.number().int().positive('TMDB ID must be a positive integer'),
//   media_type: mediaTypeSchema,
//   title: z.string().min(1, 'Title is required').max(500, 'Title too long'),
//   overview: z.string().max(2000, 'Overview too long'),
//   poster_path: z.string().nullable(),
//   backdrop_path: z.string().nullable(),
//   release_date: z.string().nullable().refine(
//     (date) => !date || /^\d{4}-\d{2}-\d{2}$/.test(date),
//     'Release date must be in YYYY-MM-DD format'
//   ),
//   vote_average: z.number().min(0).max(10),
//   genre_ids: z.array(z.number().int()),
  
//   // User Personal Data
//   added_date: z.iso.datetime('Invalid added date format'),
//   watched_status: watchedStatusSchema.default('unwatched'),
//   personal_rating: z.number().int().min(1).max(10).nullable().default(null),
//   notes: z.string().max(1000, 'Notes too long').nullable().default(null),
//   watch_date: z.iso.datetime('Invalid watch date format').nullable().default(null),
// });

// /**
//  * Schema for updating a watchlist item
//  * Only allows updating user-specific fields
//  */
// export const updateWatchlistItemSchema = z.object({
//   watched_status: watchedStatusSchema.optional(),
//   personal_rating: z.number().int().min(1).max(10).nullable().optional(),
//   notes: z.string().max(1000, 'Notes too long').nullable().optional(),
//   watch_date: z.iso.datetime('Invalid watch date format').nullable().optional(),
// }).strict();

// /**
//  * Schema for creating a community watchlist
//  */
// export const createCommunityWatchlistSchema = z.object({
//   user_id: z.string().min(1, 'User ID is required'),
//   title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
//   description: z.string().max(1000, 'Description too long').nullable().default(null),
//   is_public: z.boolean().default(true),
//   category: watchlistCategorySchema.nullable().default(null),
//   cover_image: z.string().nullable().default(null),
//   tags: z.array(z.string().max(50, 'Tag too long')).max(10, 'Too many tags').default([]),
// });

// /**
//  * Schema for updating a community watchlist
//  */
// export const updateCommunityWatchlistSchema = z.object({
//   title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
//   description: z.string().max(1000, 'Description too long').nullable().optional(),
//   is_public: z.boolean().optional(),
//   category: watchlistCategorySchema.nullable().optional(),
//   cover_image: z.string().nullable().optional(),
//   tags: z.array(z.string().max(50, 'Tag too long')).max(10, 'Too many tags').optional(),
// }).strict();

// /**
//  * Schema for creating a community watchlist item
//  */
// export const createCommunityWatchlistItemSchema = z.object({
//   watchlist_id: z.string().min(1, 'Watchlist ID is required'),
//   tmdb_id: z.number().int().positive('TMDB ID must be a positive integer'),
//   media_type: mediaTypeSchema,
//   title: z.string().min(1, 'Title is required').max(500, 'Title too long'),
//   poster_path: z.string().nullable(),
//   release_date: z.string().nullable().refine(
//     (date) => !date || /^\d{4}-\d{2}-\d{2}$/.test(date),
//     'Release date must be in YYYY-MM-DD format'
//   ),
//   vote_average: z.number().min(0).max(10),
//   order: z.number().int().min(0).default(0),
//   creator_note: z.string().max(500, 'Creator note too long').nullable().default(null),
// });

// /**
//  * Schema for creating a comment
//  */
// export const createCommunityWatchlistCommentSchema = z.object({
//   watchlist_id: z.string().min(1, 'Watchlist ID is required'),
//   author_id: z.string().min(1, 'Author ID is required'),
//   content: z.string().min(1, 'Content is required').max(1000, 'Comment too long'),
//   parent_comment_id: z.string().nullable().default(null),
// });

// /**
//  * Schema for updating a comment
//  */
// export const updateCommunityWatchlistCommentSchema = z.object({
//   content: z.string().min(1, 'Content is required').max(1000, 'Comment too long'),
// }).strict();

// /**
//  * Schema for creating a user follow
//  */
// export const createUserFollowSchema = z.object({
//   follower_id: z.string().min(1, 'Follower ID is required'),
//   following_id: z.string().min(1, 'Following ID is required'),
// }).refine(
//   (data) => data.follower_id !== data.following_id,
//   'Cannot follow yourself'
// );

// /**
//  * Schema for creating a watchlist like
//  */
// export const createCommunityWatchlistLikeSchema = z.object({
//   user_id: z.string().min(1, 'User ID is required'),
//   watchlist_id: z.string().min(1, 'Watchlist ID is required'),
// });

// // Export inferred types for use in components
// export type CreateWatchlistItemInput = z.infer<typeof createWatchlistItemSchema>;
// export type UpdateWatchlistItemInput = z.infer<typeof updateWatchlistItemSchema>;
// export type CreateCommunityWatchlistInput = z.infer<typeof createCommunityWatchlistSchema>;
// export type UpdateCommunityWatchlistInput = z.infer<typeof updateCommunityWatchlistSchema>;
// export type CreateCommunityWatchlistItemInput = z.infer<typeof createCommunityWatchlistItemSchema>;
// export type CreateCommunityWatchlistCommentInput = z.infer<typeof createCommunityWatchlistCommentSchema>;
// export type UpdateCommunityWatchlistCommentInput = z.infer<typeof updateCommunityWatchlistCommentSchema>;
// export type CreateUserFollowInput = z.infer<typeof createUserFollowSchema>;
// export type CreateCommunityWatchlistLikeInput = z.infer<typeof createCommunityWatchlistLikeSchema>;
