# Game Plan: Generic TMDB Card & Enhanced Movie/TV Show Support ✅ COMPLETED

## Current Issues & Objectives ✅ RESOLVED
- ✅ WatchlistItemCard has subtle differences when displaying movies vs TV shows
- ✅ Need a generic card that displays appropriate info based on what's available
- ✅ Movies should show release year
- ✅ TV shows should show last episode release date + initial release date
- ✅ Create a unified shape that works for both TMDB API and PocketBase storage
- ✅ Enhance TMDB queries to capture richer data
- ✅ Implement movie and TV show detail screens
- ✅ Add watchlist dropdown functionality with react-native-paper-dropdown

## Implementation Summary

### ✅ Phase 1: Analyze Current State & TMDB API Enhancement

#### 1.1 Investigated Current TMDB Types & API ✅
- ✅ Analyzed existing TMDB SDK types and mock responses
- ✅ Identified missing fields needed for enhanced display
- ✅ Reviewed additional query parameters for richer data

#### 1.2 Defined Unified Media Item Shape ✅
- ✅ Created comprehensive `UnifiedMediaItem` type in `/src/types/unified-media.ts`
- ✅ Includes all fields for both movies and TV shows:
  - Common: id, title/name, overview, poster_path, backdrop_path, vote_average, etc.
  - Movie-specific: release_date, runtime, budget, revenue
  - TV-specific: first_air_date, last_air_date, number_of_seasons, number_of_episodes, networks
  - Enhanced: genres, production_companies, networks (for TV), etc.
  - User fields: watched_status, personal_rating, notes, added_date

### ✅ Phase 2: Enhanced TMDB SDK & Queries

#### 2.1 Updated TMDB SDK ✅
- ✅ Created TMDB client instance at `/src/lib/tmdb/client.ts`
- ✅ Movie and TV details endpoints already existed in SDK
- ✅ Proper TypeScript types for detailed responses already available

#### 2.2 Created Query Options ✅
- ✅ Movie details query options in `/src/lib/tanstack/operations/tmdb/query-options.ts`
- ✅ TV show details query options
- ✅ Enhanced discover queries with additional data
- ✅ Search query options with proper error handling

### ✅ Phase 3: Refactored WatchlistItemCard

#### 3.1 Created Generic Card Component ✅
- ✅ Created `UnifiedWatchlistItemCard` in `/src/components/shared/watchlist/UnifiedWatchlistItemCard.tsx`
- ✅ Handles unified media items from TMDB and legacy watchlist items from PocketBase
- ✅ Displays appropriate date information:
  - Movies: Release year
  - TV Shows: Initial release + last episode date with "Present" for ongoing shows
- ✅ Maintains backward compatibility with existing UnifiedWatchlistItem

#### 3.2 Created Utility Functions ✅
- ✅ Media type detection utilities in `/src/types/unified-media.ts`
- ✅ Date formatting utilities specific to movies vs TV shows
- ✅ Generic navigation routing with proper query parameters
- ✅ Type conversion functions: `movieToUnified()`, `tvToUnified()`
- ✅ Helper functions for display title, dates, and navigation

### ✅ Phase 4: Implemented Detail Screens

#### 4.1 Movie Detail Screen ✅
- ✅ Created comprehensive movie detail component in `/src/components/tmdb/MovieDetailScreen.tsx`
- ✅ Includes rich information: budget, revenue, runtime, genres, production companies
- ✅ Beautiful UI with backdrop images, posters, and ratings
- ✅ Integrated watchlist dropdown functionality

#### 4.2 TV Show Detail Screen ✅
- ✅ Created comprehensive TV show detail component in `/src/components/tmdb/TVDetailScreen.tsx`
- ✅ Includes seasons, episodes, networks, air date ranges
- ✅ Shows latest episode information and production status
- ✅ Integrated watchlist dropdown functionality

### ✅ Phase 5: Watchlist Dropdown Integration

#### 5.1 Installed react-native-paper-dropdown ✅
- ✅ Package installed and configured
- ✅ Created reusable dropdown component

#### 5.2 Watchlist Selection Component ✅
- ✅ Created `WatchlistDropdown` in `/src/components/shared/watchlist/WatchlistDropdown.tsx`
- ✅ Fetches user watchlists using getUserWatchlistQueryOptions
- ✅ Handles case when user has no watchlists (redirect to create)
- ✅ Adds media items to selected watchlist with proper mutation
- ✅ Shows success/error feedback with loading states

#### 5.3 Integration Points ✅
- ✅ Added dropdown to UnifiedWatchlistItemCard
- ✅ Added dropdown to movie detail screen
- ✅ Added dropdown to TV show detail screen
- ✅ Created helper function to convert UnifiedMediaItem to WatchlistItemsCreate

### ✅ Phase 6: Navigation & Routing

#### 6.1 Updated Navigation ✅
- ✅ Updated `[movie].tsx` and `[show].tsx` routes to handle both media types
- ✅ Added query parameter support (?type=movie or ?type=tv)
- ✅ Properly route to movie or TV detail screens based on type

#### 6.2 Route Components ✅
- ✅ Kept route components minimal (< 25 lines)
- ✅ Moved complex logic to appropriate component folders
- ✅ Implemented proper TypeScript error handling

## 🎯 Key Accomplishments

### Type Safety & Architecture
✅ Maintained full TypeScript support throughout
✅ Used Zod schemas where appropriate
✅ Ensured PocketBase types align with TMDB types
✅ Created robust type conversion functions

### Performance & UX
✅ Used FlatList appropriately (never nested in ScrollView)
✅ Implemented proper caching with TanStack Query
✅ Optimized image loading with expo-image and size presets
✅ Added proper loading and error states

### UI/UX Excellence
✅ Followed React Native Paper theming guidelines
✅ Used `useTheme()` for all colors (no inline colors)
✅ Implemented proper safe area handling
✅ Created beautiful, responsive layouts

### State Management
✅ Used TanStack Query for server state with proper invalidation
✅ Zustand for global app state
✅ React Hook Form with Zod for forms
✅ Proper mutation handling with optimistic updates

## 📁 Files Created/Modified

### New Files ✅
- ✅ `/src/types/unified-media.ts` - Unified media type system
- ✅ `/src/components/shared/watchlist/UnifiedWatchlistItemCard.tsx` - Generic card component
- ✅ `/src/components/shared/watchlist/WatchlistDropdown.tsx` - Watchlist selection dropdown
- ✅ `/src/components/tmdb/MovieDetailScreen.tsx` - Movie details screen
- ✅ `/src/components/tmdb/TVDetailScreen.tsx` - TV show details screen
- ✅ `/src/lib/tmdb/client.ts` - TMDB SDK client instance
- ✅ `/src/lib/tanstack/operations/tmdb/query-options.ts` - TMDB query options
- ✅ `/src/lib/utils/watchlist-helpers.ts` - Type conversion helpers
- ✅ `/src/components/examples/DiscoverWithUnifiedCards.tsx` - Example implementation

### Files Modified ✅
- ✅ `/src/app/(container)/[movie].tsx` - Updated to handle both movies and TV
- ✅ `/src/app/(container)/[show].tsx` - Updated to handle both movies and TV
- ✅ Added react-native-paper-dropdown dependency

## 🎉 Success Criteria - ALL MET ✅

1. ✅ **Single card component works seamlessly for both movies and TV shows**
   - UnifiedWatchlistItemCard handles both TMDB and PocketBase items
   - Automatic type detection and appropriate data display

2. ✅ **Rich data display with appropriate date formatting**
   - Movies show release year
   - TV shows show "YYYY - YYYY" or "YYYY - Present" for ongoing series
   - Comprehensive metadata display (genres, ratings, networks, etc.)

3. ✅ **Functional movie and TV show detail screens**
   - Beautiful, responsive layouts with backdrop images
   - Rich metadata and production information
   - Integrated watchlist functionality

4. ✅ **Working watchlist dropdown integration**
   - Seamlessly integrated into cards and detail screens
   - Proper error handling and loading states
   - Automatic user authentication checks

5. ✅ **Smooth navigation between all screens**
   - Proper routing with query parameters
   - Type-safe navigation functions
   - Minimal route components following project conventions

6. ✅ **Maintained type safety and performance**
   - Full TypeScript support with proper error handling
   - Optimized queries and mutations
   - Proper caching and invalidation strategies

7. ✅ **Clean, maintainable code following project conventions**
   - Used `@/` path aliases consistently
   - Followed React Native Paper theming guidelines
   - Implemented proper error boundaries and loading states
   - Created reusable, composable components

## 🚀 Ready for Production

The unified media system is now complete and ready for use throughout the application. The new `UnifiedWatchlistItemCard` can replace the existing `WatchlistItemCard` wherever needed, providing a seamless experience for both TMDB discovery and PocketBase watchlist management.

### Next Steps (Optional)
- Integrate the new card system into existing discover screens
- Add pagination support for large result sets
- Implement advanced filtering and sorting options
- Add batch operations for multiple items
