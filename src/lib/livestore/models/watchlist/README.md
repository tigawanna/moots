# Movie Social App - LiveStore Schema

This directory contains a comprehensive LiveStore schema for a movie social application. The schema is designed following event sourcing principles and LiveStore best practices.

## Architecture Overview

The schema is split into separate concerns for maintainability and clarity:

### 📊 Tables (`tables.ts`)
Defines the SQLite database structure with the following core entities:

- **Users** - User accounts, profiles, and social statistics
- **Movies** - Movie metadata from external APIs (IMDb/TMDb)
- **Movie Lists** - User-created collections of movies
- **List Movies** - Junction table linking movies to lists with ratings
- **Follows** - Social follow relationships between users
- **List Likes** - User likes on movie lists
- **List Comments** - Comments on movie lists
- **UI State** - Client-only state for forms and filters

### 🎯 Events (`events.ts`)
Defines all possible data mutations in the system:

#### User Events
- `userRegistered` - New user account creation
- `userProfileUpdated` - Profile information changes
- `userDeleted` - Account deletion (soft delete)

#### Movie Events
- `movieAdded` - New movie metadata added to database
- `movieUpdated` - Movie information updates

#### Movie List Events
- `listCreated` - New movie list creation
- `listUpdated` - List metadata changes
- `listDeleted` - List deletion (soft delete)
- `movieAddedToList` - Movie added to a list with rating
- `movieRemovedFromList` - Movie removed from list
- `movieRatingUpdated` - User rating/notes updated
- `listReordered` - Movie positions changed in list

#### Social Events
- `userFollowed` / `userUnfollowed` - Follow relationships
- `listLiked` / `listUnliked` - List likes
- `commentAdded` / `commentUpdated` / `commentDeleted` - List comments

### ⚙️ Materializers (`materializers.ts`)
Maps events to database state changes. Each event has a corresponding materializer that:
- Handles database writes in response to events
- Maintains data consistency and integrity
- Supports transactional operations
- Uses soft deletes for data preservation

### 🔍 Queries (`queries.ts`)
Provides both simple and complex data access patterns:

#### Basic Queries (using LiveStore query builder)
- User and list lookups
- Social relationship queries
- Simple filtering and sorting

#### Complex Queries (using raw SQL with joins)
- **Feed Generation** - Activity feed from followed users
- **Recommendations** - Movie recommendations based on liked lists
- **Similar Users** - User discovery based on movie preferences
- **Search** - Advanced movie search with filters
- **Analytics** - Social statistics and trending content

## Data Model Relationships

```
Users ──────┐
    │       │
    ├─── MovieLists ──── ListMovies ──── Movies
    │       │                │
    │       ├─── ListLikes   │
    │       └─── ListComments│
    │                        │
    └─── Follows             │
                             │
                        (Ratings & Notes)
```

## Key Features

### 🏗️ Event Sourcing
- All changes are captured as immutable events
- Complete audit trail of all data modifications
- Time-travel debugging and analytics
- Easy data replication and synchronization

### 🔄 Real-time Collaboration
- LiveStore automatically syncs changes across clients
- Optimistic updates with conflict resolution
- Offline support with event queuing

### 📱 Mobile-First Design
- Optimized for React Native and Expo
- Efficient SQLite storage
- Background sync capabilities

### 🎨 Rich Social Features
- User profiles and following
- Movie lists with ratings and notes
- Social feed with activity updates
- Like and comment system
- Content discovery and recommendations

## Usage Examples

### Creating a New Movie List

```typescript
import { watchlistEvents } from "./watchlist";

// Generate unique IDs
const listId = crypto.randomUUID();
const userId = "user-123";

// Commit the event
await store.commit(watchlistEvents.listCreated({
  id: listId,
  userId,
  title: "My Favorite Sci-Fi Movies",
  description: "A curated list of the best science fiction films",
  isPublic: true,
  category: "sci-fi",
  createdAt: new Date(),
}));
```

### Adding a Movie to a List

```typescript
const movieId = "tt0133093"; // The Matrix (IMDb ID)
const listMovieId = crypto.randomUUID();

await store.commit(watchlistEvents.movieAddedToList({
  id: listMovieId,
  listId,
  movieId,
  userId,
  rating: 5,
  notes: "Mind-bending classic that revolutionized cinema",
  position: 1,
  createdAt: new Date(),
}));
```

### Querying Data

```typescript
import { watchlistQueries } from "./watchlist";

// Get popular lists with user details
const popularLists$ = watchlistQueries.getPopularListsWithUserDetails();

// Get user's personalized feed
const userFeed$ = watchlistQueries.getUserFeed("user-123");

// Get movie recommendations
const recommendations$ = watchlistQueries.getMovieRecommendations("user-123");

// Search movies
const searchResults$ = watchlistQueries.searchMovies("matrix", ["sci-fi", "action"]);
```

### Social Interactions

```typescript
// Follow a user
await store.commit(watchlistEvents.userFollowed({
  id: crypto.randomUUID(),
  followerId: "user-123",
  followingId: "user-456",
  createdAt: new Date(),
}));

// Like a list
await store.commit(watchlistEvents.listLiked({
  id: crypto.randomUUID(),
  userId: "user-123",
  listId: "list-789",
  createdAt: new Date(),
}));

// Add a comment
await store.commit(watchlistEvents.commentAdded({
  id: crypto.randomUUID(),
  userId: "user-123",
  listId: "list-789",
  content: "Great list! I love these movies too.",
  createdAt: new Date(),
}));
```

## Best Practices

### 🔐 Data Integrity
- Always include all required data in events (be deterministic)
- Use UUIDs for all primary keys
- Implement soft deletes for data preservation
- Validate data at the event level

### 📈 Performance
- Use appropriate indexes on frequently queried columns
- Implement pagination for large result sets
- Cache computed values when necessary
- Use efficient SQL joins for complex queries

### 🔒 Security
- Validate user permissions at the application level
- Sanitize user input in events
- Implement rate limiting for social actions
- Use proper access controls for private data

### 🛠️ Evolution
- Use versioned event names (v1.EventName)
- Plan for schema migrations
- Keep backward compatibility in mind
- Document breaking changes

## Future Enhancements

- **Streaming Integration** - Real-time availability updates
- **AI Recommendations** - Machine learning-based suggestions
- **Rich Media** - Video trailers and image galleries
- **Advanced Analytics** - User behavior insights
- **Moderation Tools** - Content filtering and reporting
- **Export/Import** - Data portability features

## Contributing

When modifying the schema:

1. Add new events for any data changes
2. Update corresponding materializers
3. Add queries for new data access patterns
4. Update this documentation
5. Test all changes thoroughly
6. Consider migration strategies for existing data
