# Next Steps - Enhanced Implementation Plan

## 🗄️ Database Schema & Data Structure
- **Standardize the pocketbase watchlist schema** to match TMDB API structure
  - Include: `tmdb_id`, `title`, `overview`, `poster_path`, `backdrop_path`, `release_date`, `vote_average`, `genre_ids`, `media_type` (movie/tv)
  - Add user fields: `user_id`, `added_date`, `watched_status`, `personal_rating`, `notes`
  - Create Zod schemas for validation and type safety
  - Set up PocketBase collection with proper field types and validation rules

## 🏠 Home Screen - Personal Watchlist
- **CRUD Operations** with React Query for caching and optimistic updates
  - Create: Add items from TMDB to personal watchlist
  - Read: Display user's watchlist with infinite scroll/pagination
  - Update: Mark as watched, edit notes/rating, reorder items
  - Delete: Remove from watchlist with confirmation dialog
- **Search & Filter functionality**
  - Real-time search through user's watchlist
  - Filter by: watched/unwatched, genre, rating, date added
  - Sort by: date added, alphabetical, rating, release date
- **UI Components**
  - Use React Native Paper cards with Material Design 3 theming
  - Implement pull-to-refresh and skeleton loading states
  - Add swipe actions for quick mark as watched/delete
  - Show progress indicators and statistics

## 🌍 Community Tab - Social Features
- **Community Watchlist Discovery**
  - Display public/shared watchlists from all users
  - Implement pagination and lazy loading
  - Add user profile previews and follow functionality
- **Import Options**
  - "Import entire list" - bulk add with confirmation
  - "Cherry-pick items" - select individual movies/shows
  - Handle duplicates gracefully with user choice
  - Show import progress and success/error states
- **Social Interactions**
  - Like/bookmark community lists
  - Comment system for recommendations
  - User profiles with watchlist stats

## 🔍 Explore Screen (formerly tabs)
- **TMDB Integration Enhanced**
  - Trending movies and TV shows with category tabs
  - Advanced search with filters (genre, year, rating)
  - Discover new content with personalized recommendations
- **Watchlist Status Indicators**
  - Visual badges/icons showing if item is already in user's watchlist
  - Different states: not added, in watchlist, watched
  - Quick add/remove buttons with haptic feedback
- **Performance Optimizations**
  - Image lazy loading with expo-image
  - Virtual lists for large datasets
  - Cache TMDB responses with React Query

## 📱 Details Screen - Rich Media Experience
- **Comprehensive Movie/TV Information**
  - Full TMDB details: cast, crew, trailers, reviews
  - User-generated content: personal notes, ratings, watch dates
  - Related content and recommendations
- **Watchlist Management**
  - Add/remove from watchlist with animation
  - Quick status updates (watched/unwatched)
  - Share functionality for social features
- **Interactive Elements**
  - Image galleries with zoom capabilities
  - Video player for trailers
  - Expandable sections for cast/crew details

## 🎯 Watchlist Limits & Gamification
- **50 Item Limit Implementation**
  - Soft limit with upgrade prompts
  - Visual progress indicator (45/50 items)
  - Smart suggestions to remove watched items
  - Premium tier consideration for unlimited items
- **User Experience Enhancements**
  - Motivational prompts to watch items
  - Streak tracking for consistent viewing
  - Achievement system for milestones

## 🛠️ Technical Implementation Plan

### Phase 1: Foundation (Week 1-2)
1. **Database Setup**
   - Create PocketBase watchlist collection
   - Set up Zod schemas and TypeScript types
   - Implement basic CRUD operations with React Query
2. **Core UI Components**
   - Watchlist item card component
   - Search and filter components
   - Loading states and error boundaries

### Phase 2: Core Features (Week 3-4)
1. **Home Screen Watchlist**
   - Implement full CRUD functionality
   - Add search and filtering
   - Create responsive grid/list layouts
2. **Enhanced Explore Screen**
   - Integrate watchlist status indicators
   - Improve TMDB data fetching and caching
   - Add quick add/remove functionality

### Phase 3: Advanced Features (Week 5-6)
1. **Details Screen**
   - Rich media display with full TMDB integration
   - User interaction features (notes, ratings)
   - Social sharing capabilities
2. **Community Features**
   - Public watchlist discovery
   - Import/export functionality
   - Basic social interactions

### Phase 4: Polish & Optimization (Week 7-8)
1. **Performance Optimization**
   - Image loading optimization
   - List virtualization
   - Offline support improvements
2. **User Experience Enhancements**
   - Animation and micro-interactions
   - Accessibility improvements
   - Testing and bug fixes

## 📋 Technical Considerations & Best Practices
- **State Management**: Use Zustand for global app state, React Query for server state
- **React Query Patterns**: Prefer creating `queryOptions` and custom hooks to encapsulate logic
- **List Performance**: Do NOT nest a `FlatList` in a `ScrollView` - use proper virtualization
- **Navigation**: Implement deep linking for shared content
- **Performance**: Implement proper image caching and list virtualization
- **Offline Support**: Cache critical data with AsyncStorage
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Testing**: Unit tests for utilities, integration tests for key flows
- **Accessibility**: Proper screen reader support and keyboard navigation

## 📁 Existing Files That Need Attention

### 🗄️ Database & API Layer
- `src/lib/pb/types/watchlist-types.ts` - Update schema to match TMDB structure
- `src/lib/pb/watchlist-api.ts` - Enhance CRUD operations
- `src/lib/pb/client.ts` - Ensure proper authentication handling
- `src/lib/tanstack/watchlist-hooks.ts` - Create queryOptions patterns
- `src/lib/tanstack/operations/watchlist.ts` - Implement optimistic updates

### 🎬 TMDB Integration
- `src/lib/tmdb/tmdb-hooks.ts` - Add watchlist status indicators
- `src/lib/tmdb/sdk-via-pb.ts` - Optimize caching strategies
- `src/lib/images/tmdb-images.ts` - Implement lazy loading

### 🏠 Screen Components
- `src/app/(container)/(tabs)/index.tsx` - Home screen watchlist display
- `src/app/(container)/(tabs)/explore.tsx` - Enhanced TMDB browsing (rename from tmbd)
- `src/app/(container)/(tabs)/tmbd.tsx` - Merge into explore screen
- `src/app/(container)/[movie].tsx` - Movie details screen
- `src/app/(container)/[show].tsx` - TV show details screen

### 🎨 UI Components (Create New)
- `src/components/watchlist/WatchlistCard.tsx` - Material Design 3 card
- `src/components/watchlist/WatchlistFilters.tsx` - Search and filter UI
- `src/components/watchlist/AddToWatchlistButton.tsx` - Quick add functionality
- `src/components/shared/MediaItemWithWatchlistStatus.tsx` - Status indicators
- `src/components/community/CommunityWatchlistCard.tsx` - Social features

### 🔧 Utilities & Hooks
- `src/hooks/useWatchlistStatus.ts` - Check if item is in user's watchlist
- `src/hooks/useWatchlistLimit.ts` - Enforce 50 item limit
- `src/store/watchlist-store.ts` - Zustand store for watchlist state
- `src/lib/tanstack/operations/community.ts` - Community features API

### 🎯 Navigation Updates
- `src/app/(container)/(tabs)/_layout.tsx` - Add community tab, rename explore
- `src/app/(container)/(tabs)/community.tsx` - New community features screen

## 🔮 Future Enhancements
- AI-powered recommendations based on viewing history
- Integration with streaming services (availability checking)
- Calendar integration for release date tracking
- Social features: friends, shared lists, group watching
- Analytics dashboard for viewing habits
- Export to other platforms (Letterboxd, IMDb, etc.)
