/**
 * Comprehensive LiveStore schema for a movie social app
 * 
 * This module provides a complete event-sourced data model for a social movie app
 * with the following features:
 * - User management and profiles
 * - Movie metadata and ratings
 * - User-created movie lists
 * - Social interactions (following, likes, comments)
 * - Real-time collaborative features
 * 
 * The schema follows LiveStore best practices with separate concerns:
 * - Tables: Define the database structure and columns
 * - Events: Define all possible data mutations
 * - Materializers: Map events to database state changes
 * - Queries: Provide both simple and complex data access patterns
 */

// Export the main schema (which re-exports tables, events, and materializers)
export * from "./schema";

// Export queries separately to avoid conflicts
export * from "./queries";

// Re-export the main components with prefixed names for convenience
export { events as watchlistEvents } from "./events";
export { materializers as watchlistMaterializers } from "./materializers";
export { queries as watchlistQueries } from "./queries";
export { schema as watchlistSchema } from "./schema";
export { tables as watchlistTables } from "./tables";

/**
 * Example usage:
 * 
 * ```typescript
 * import { watchlistSchema, watchlistEvents, watchlistQueries } from "@/lib/livestore/models/watchlist";
 * 
 * // Create a new store with the schema
 * const store = Store.create(watchlistSchema);
 * 
 * // Commit events
 * await store.commit(watchlistEvents.userRegistered({
 *   id: "user-123",
 *   username: "moviefan",
 *   email: "fan@example.com",
 *   createdAt: new Date(),
 * }));
 * 
 * // Query data
 * const popularLists = watchlistQueries.getPopularListsWithUserDetails();
 * const userFeed = watchlistQueries.getUserFeed("user-123");
 * ```
 */
