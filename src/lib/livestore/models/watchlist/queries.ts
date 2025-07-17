import { queryDb, Schema, sql } from "@livestore/livestore";
import { tables } from "./tables";

// Define result schemas for complex queries
export const UserWithStatsSchema = Schema.Struct({
  id: Schema.String,
  username: Schema.String,
  email: Schema.String,
  profilePicture: Schema.optional(Schema.String),
  bio: Schema.optional(Schema.String),
  followersCount: Schema.Number,
  followingCount: Schema.Number,
  listsCount: Schema.Number,
  isPublic: Schema.Boolean,
  createdAt: Schema.Number,
});

export const MovieListWithDetailsSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  description: Schema.optional(Schema.String),
  isPublic: Schema.Boolean,
  category: Schema.optional(Schema.String),
  likesCount: Schema.Number,
  commentsCount: Schema.Number,
  movieCount: Schema.Number,
  createdAt: Schema.Number,
  updatedAt: Schema.Number,
  userId: Schema.String,
  username: Schema.String,
  userProfilePicture: Schema.optional(Schema.String),
});

export const MovieWithRatingSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  year: Schema.Number,
  poster: Schema.String,
  genres: Schema.Array(Schema.String),
  imdbRating: Schema.Number,
  userRating: Schema.optional(Schema.Number),
  userNotes: Schema.optional(Schema.String),
  position: Schema.Number,
});

export const FeedItemSchema = Schema.Struct({
  type: Schema.Literal("list_created", "list_liked", "user_followed"),
  id: Schema.String,
  userId: Schema.String,
  username: Schema.String,
  userProfilePicture: Schema.optional(Schema.String),
  createdAt: Schema.Number,
  listId: Schema.optional(Schema.String),
  listTitle: Schema.optional(Schema.String),
  targetUserId: Schema.optional(Schema.String),
  targetUsername: Schema.optional(Schema.String),
});

// Basic table queries using the query builder
export const basicQueries = {
  // Get all public users
  getPublicUsers: () => 
    tables.users
      .select("id", "username", "profilePicture", "bio", "followersCount", "listsCount")
      .where({ isPublic: true, deletedAt: null })
      .orderBy("username", "asc"),

  // Get user's public lists
  getUserLists: (userId: string) =>
    tables.movieLists
      .select("id", "title", "description", "likesCount", "movieCount", "createdAt")
      .where({ userId, isPublic: true, deletedAt: null })
      .orderBy("updatedAt", "desc"),

  // Get movies in a list
  getListMovies: (listId: string) =>
    tables.listMovies
      .select("movieId", "rating", "notes", "position")
      .where({ listId, deletedAt: null })
      .orderBy("position", "asc"),

  // Get list likes
  getListLikes: (listId: string) =>
    tables.listLikes
      .select("userId", "createdAt")
      .where({ listId, deletedAt: null })
      .orderBy("createdAt", "desc"),

  // Get list comments
  getListComments: (listId: string) =>
    tables.listComments
      .select("id", "userId", "content", "createdAt", "updatedAt")
      .where({ listId, deletedAt: null })
      .orderBy("createdAt", "asc"),

  // Get user followers
  getUserFollowers: (userId: string) =>
    tables.follows
      .select("followerId", "createdAt")
      .where({ followingId: userId, deletedAt: null })
      .orderBy("createdAt", "desc"),

  // Get user following
  getUserFollowing: (userId: string) =>
    tables.follows
      .select("followingId", "createdAt")
      .where({ followerId: userId, deletedAt: null })
      .orderBy("createdAt", "desc"),
};

// Complex queries using raw SQL with joins
export const complexQueries = {
  // Get movie lists with user details for feed
  getPopularListsWithUserDetails: () => 
    queryDb({
      query: sql`
        SELECT 
          ml.id,
          ml.title,
          ml.description,
          ml.isPublic,
          ml.category,
          ml.likesCount,
          ml.commentsCount,
          ml.movieCount,
          ml.createdAt,
          ml.updatedAt,
          ml.userId,
          u.username,
          u.profilePicture as userProfilePicture
        FROM movieLists ml
        JOIN users u ON ml.userId = u.id
        WHERE ml.deletedAt IS NULL 
          AND ml.isPublic = 1
          AND u.deletedAt IS NULL
        ORDER BY ml.likesCount DESC, ml.updatedAt DESC
        LIMIT 50
      `,
      schema: Schema.Array(MovieListWithDetailsSchema),
    }),

  // Get movies in a list with full movie details and user ratings
  getListMoviesWithDetails: (listId: string) => 
    queryDb({
      query: sql`
        SELECT 
          m.id,
          m.title,
          m.year,
          m.poster,
          m.genres,
          m.imdbRating,
          lm.rating as userRating,
          lm.notes as userNotes,
          lm.position
        FROM listMovies lm
        JOIN movies m ON lm.movieId = m.id
        WHERE lm.listId = ${listId}
          AND lm.deletedAt IS NULL
        ORDER BY lm.position ASC
      `,
      schema: Schema.Array(MovieWithRatingSchema),
    }),

  // Get user feed - recent activity from followed users
  getUserFeed: (userId: string) => 
    queryDb({
      query: sql`
        SELECT 
          'list_created' as type,
          ml.id,
          ml.userId,
          u.username,
          u.profilePicture as userProfilePicture,
          ml.createdAt,
          ml.id as listId,
          ml.title as listTitle,
          NULL as targetUserId,
          NULL as targetUsername
        FROM movieLists ml
        JOIN users u ON ml.userId = u.id
        JOIN follows f ON f.followingId = ml.userId
        WHERE f.followerId = ${userId}
          AND f.deletedAt IS NULL
          AND ml.deletedAt IS NULL
          AND ml.isPublic = 1
          AND u.deletedAt IS NULL

        UNION ALL

        SELECT 
          'list_liked' as type,
          ll.id,
          ll.userId,
          u.username,
          u.profilePicture as userProfilePicture,
          ll.createdAt,
          ll.listId,
          ml.title as listTitle,
          NULL as targetUserId,
          NULL as targetUsername
        FROM listLikes ll
        JOIN users u ON ll.userId = u.id
        JOIN movieLists ml ON ll.listId = ml.id
        JOIN follows f ON f.followingId = ll.userId
        WHERE f.followerId = ${userId}
          AND f.deletedAt IS NULL
          AND ll.deletedAt IS NULL
          AND ml.deletedAt IS NULL
          AND ml.isPublic = 1
          AND u.deletedAt IS NULL

        UNION ALL

        SELECT 
          'user_followed' as type,
          f2.id,
          f2.followerId as userId,
          u.username,
          u.profilePicture as userProfilePicture,
          f2.createdAt,
          NULL as listId,
          NULL as listTitle,
          f2.followingId as targetUserId,
          u2.username as targetUsername
        FROM follows f2
        JOIN users u ON f2.followerId = u.id
        JOIN users u2 ON f2.followingId = u2.id
        JOIN follows f ON f.followingId = f2.followerId
        WHERE f.followerId = ${userId}
          AND f.deletedAt IS NULL
          AND f2.deletedAt IS NULL
          AND u.deletedAt IS NULL
          AND u2.deletedAt IS NULL

        ORDER BY createdAt DESC
        LIMIT 100
      `,
      schema: Schema.Array(FeedItemSchema),
    }),

  // Get movie recommendations based on user's liked lists
  getMovieRecommendations: (userId: string) => 
    queryDb({
      query: sql`
        SELECT 
          m.id,
          m.title,
          m.year,
          m.poster,
          m.genres,
          m.imdbRating,
          COUNT(*) as occurrences,
          AVG(lm.rating) as avgUserRating
        FROM movies m
        JOIN listMovies lm ON m.id = lm.movieId
        JOIN movieLists ml ON lm.listId = ml.id
        JOIN listLikes ll ON ml.id = ll.listId
        WHERE ll.userId = ${userId}
          AND ll.deletedAt IS NULL
          AND ml.deletedAt IS NULL
          AND lm.deletedAt IS NULL
          AND lm.rating IS NOT NULL
          -- Exclude movies the user already has in their lists
          AND m.id NOT IN (
            SELECT DISTINCT lm2.movieId 
            FROM listMovies lm2 
            JOIN movieLists ml2 ON lm2.listId = ml2.id
            WHERE ml2.userId = ${userId} 
              AND ml2.deletedAt IS NULL 
              AND lm2.deletedAt IS NULL
          )
        GROUP BY m.id, m.title, m.year, m.poster, m.genres, m.imdbRating
        HAVING occurrences >= 2 AND avgUserRating >= 4.0
        ORDER BY occurrences DESC, avgUserRating DESC, m.imdbRating DESC
        LIMIT 20
      `,
      schema: Schema.Array(Schema.Struct({
        id: Schema.String,
        title: Schema.String,
        year: Schema.Number,
        poster: Schema.String,
        genres: Schema.Array(Schema.String),
        imdbRating: Schema.Number,
        occurrences: Schema.Number,
        avgUserRating: Schema.Number,
      })),
    }),

  // Get similar users based on movie preferences
  getSimilarUsers: (userId: string) => 
    queryDb({
      query: sql`
        SELECT 
          u.id,
          u.username,
          u.profilePicture,
          u.bio,
          u.followersCount,
          u.listsCount,
          COUNT(DISTINCT lm1.movieId) as sharedMovies,
          AVG(ABS(lm1.rating - lm2.rating)) as ratingDifference
        FROM users u
        JOIN movieLists ml1 ON u.id = ml1.userId
        JOIN listMovies lm1 ON ml1.id = lm1.listId
        JOIN listMovies lm2 ON lm1.movieId = lm2.movieId
        JOIN movieLists ml2 ON lm2.listId = ml2.id
        WHERE ml2.userId = ${userId}
          AND u.id != ${userId}
          AND u.deletedAt IS NULL
          AND u.isPublic = 1
          AND ml1.deletedAt IS NULL
          AND ml2.deletedAt IS NULL
          AND lm1.deletedAt IS NULL
          AND lm2.deletedAt IS NULL
          AND lm1.rating IS NOT NULL
          AND lm2.rating IS NOT NULL
          -- Exclude users already followed
          AND u.id NOT IN (
            SELECT followingId 
            FROM follows 
            WHERE followerId = ${userId} AND deletedAt IS NULL
          )
        GROUP BY u.id, u.username, u.profilePicture, u.bio, u.followersCount, u.listsCount
        HAVING sharedMovies >= 5 AND ratingDifference <= 1.0
        ORDER BY sharedMovies DESC, ratingDifference ASC
        LIMIT 10
      `,
      schema: Schema.Array(Schema.Struct({
        id: Schema.String,
        username: Schema.String,
        profilePicture: Schema.optional(Schema.String),
        bio: Schema.optional(Schema.String),
        followersCount: Schema.Number,
        listsCount: Schema.Number,
        sharedMovies: Schema.Number,
        ratingDifference: Schema.Number,
      })),
    }),

  // Search movies by title and genre
  searchMovies: (query: string, genres: string[] = []) => {
    const genreFilter = genres.length > 0 
      ? sql` AND ${genres.map(g => sql`m.genres LIKE '%${g}%'`).join(" AND ")}`
      : sql``;
    
    return queryDb({
      query: sql`
        SELECT 
          m.id,
          m.title,
          m.year,
          m.poster,
          m.genres,
          m.imdbRating,
          m.tmdbRating,
          m.runtime
        FROM movies m
        WHERE m.title LIKE '%${query}%'
          ${genreFilter}
        ORDER BY m.imdbRating DESC, m.title ASC
        LIMIT 50
      `,
      schema: Schema.Array(Schema.Struct({
        id: Schema.String,
        title: Schema.String,
        year: Schema.Number,
        poster: Schema.String,
        genres: Schema.Array(Schema.String),
        imdbRating: Schema.Number,
        tmdbRating: Schema.Number,
        runtime: Schema.Number,
      })),
    });
  },
};

// Export all queries
export const queries = {
  ...basicQueries,
  ...complexQueries,
};
