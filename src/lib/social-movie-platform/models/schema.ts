import { LiveStoreSchema } from '../../livestore/schema';

/**
 * LiveStore schema configuration for the Social Movie Platform
 * Defines tables, relationships, and indexing strategy for efficient querying
 */
export const socialMoviePlatformSchema: LiveStoreSchema = {
  tables: {
    users: {
      primaryKey: 'id',
      columns: {
        id: { type: 'string', nullable: false },
        username: { type: 'string', nullable: false },
        email: { type: 'string', nullable: false },
        profilePicture: { type: 'string', nullable: true },
        bio: { type: 'string', nullable: true },
        interests: { type: 'json', nullable: false, default: '[]' },
        isPublic: { type: 'boolean', nullable: false, default: true },
        followersCount: { type: 'number', nullable: false, default: 0 },
        followingCount: { type: 'number', nullable: false, default: 0 },
        listsCount: { type: 'number', nullable: false, default: 0 },
        createdAt: { type: 'date', nullable: false },
        updatedAt: { type: 'date', nullable: false }
      },
      indexes: [
        { name: 'users_username_idx', columns: ['username'] },
        { name: 'users_isPublic_idx', columns: ['isPublic'] }
      ]
    },
    
    movie_lists: {
      primaryKey: 'id',
      columns: {
        id: { type: 'string', nullable: false },
        userId: { type: 'string', nullable: false },
        title: { type: 'string', nullable: false },
        description: { type: 'string', nullable: true },
        isPublic: { type: 'boolean', nullable: false, default: false },
        category: { type: 'string', nullable: true },
        movieIds: { type: 'json', nullable: false, default: '[]' },
        likesCount: { type: 'number', nullable: false, default: 0 },
        commentsCount: { type: 'number', nullable: false, default: 0 },
        createdAt: { type: 'date', nullable: false },
        updatedAt: { type: 'date', nullable: false }
      },
      indexes: [
        { name: 'movie_lists_userId_idx', columns: ['userId'] },
        { name: 'movie_lists_userId_isPublic_idx', columns: ['userId', 'isPublic'] },
        { name: 'movie_lists_createdAt_isPublic_idx', columns: ['createdAt', 'isPublic'] }
      ]
    },
    
    movies: {
      primaryKey: 'id', // IMDb ID for deduplication
      columns: {
        id: { type: 'string', nullable: false },
        title: { type: 'string', nullable: false },
        year: { type: 'number', nullable: false },
        genre: { type: 'json', nullable: false, default: '[]' },
        director: { type: 'json', nullable: false, default: '[]' },
        cast: { type: 'json', nullable: false, default: '[]' },
        plot: { type: 'string', nullable: false },
        poster: { type: 'string', nullable: false },
        imdbRating: { type: 'number', nullable: false, default: 0 },
        tmdbRating: { type: 'number', nullable: false, default: 0 },
        runtime: { type: 'number', nullable: false, default: 0 },
        language: { type: 'string', nullable: false },
        country: { type: 'string', nullable: false },
        streamingAvailability: { type: 'json', nullable: true },
        createdAt: { type: 'date', nullable: false },
        updatedAt: { type: 'date', nullable: false }
      },
      indexes: [
        { name: 'movies_title_idx', columns: ['title'] },
        { name: 'movies_year_idx', columns: ['year'] },
        { name: 'movies_imdbRating_idx', columns: ['imdbRating'] }
      ]
    },
    
    list_movies: {
      primaryKey: 'id',
      columns: {
        id: { type: 'string', nullable: false },
        listId: { type: 'string', nullable: false },
        movieId: { type: 'string', nullable: false },
        addedAt: { type: 'date', nullable: false }
      },
      indexes: [
        { name: 'list_movies_listId_idx', columns: ['listId'] },
        { name: 'list_movies_movieId_idx', columns: ['movieId'] },
        { name: 'list_movies_listId_movieId_idx', columns: ['listId', 'movieId'] }
      ]
    },
    
    user_movie_ratings: {
      primaryKey: 'id',
      columns: {
        id: { type: 'string', nullable: false },
        userId: { type: 'string', nullable: false },
        movieId: { type: 'string', nullable: false },
        rating: { type: 'number', nullable: false },
        notes: { type: 'string', nullable: true },
        listId: { type: 'string', nullable: false },
        createdAt: { type: 'date', nullable: false },
        updatedAt: { type: 'date', nullable: false }
      },
      indexes: [
        { name: 'user_movie_ratings_userId_idx', columns: ['userId'] },
        { name: 'user_movie_ratings_movieId_idx', columns: ['movieId'] },
        { name: 'user_movie_ratings_listId_idx', columns: ['listId'] },
        { name: 'user_movie_ratings_movieId_userId_idx', columns: ['movieId', 'userId'] }
      ]
    },
    
    follows: {
      primaryKey: 'id',
      columns: {
        id: { type: 'string', nullable: false },
        followerId: { type: 'string', nullable: false },
        followingId: { type: 'string', nullable: false },
        createdAt: { type: 'date', nullable: false }
      },
      indexes: [
        { name: 'follows_followerId_idx', columns: ['followerId'] },
        { name: 'follows_followingId_idx', columns: ['followingId'] },
        { name: 'follows_followerId_followingId_idx', columns: ['followerId', 'followingId'] }
      ]
    },
    
    list_likes: {
      primaryKey: 'id',
      columns: {
        id: { type: 'string', nullable: false },
        userId: { type: 'string', nullable: false },
        listId: { type: 'string', nullable: false },
        createdAt: { type: 'date', nullable: false }
      },
      indexes: [
        { name: 'list_likes_userId_idx', columns: ['userId'] },
        { name: 'list_likes_listId_idx', columns: ['listId'] },
        { name: 'list_likes_userId_listId_idx', columns: ['userId', 'listId'] }
      ]
    },
    
    list_comments: {
      primaryKey: 'id',
      columns: {
        id: { type: 'string', nullable: false },
        userId: { type: 'string', nullable: false },
        listId: { type: 'string', nullable: false },
        content: { type: 'string', nullable: false },
        createdAt: { type: 'date', nullable: false },
        updatedAt: { type: 'date', nullable: false }
      },
      indexes: [
        { name: 'list_comments_userId_idx', columns: ['userId'] },
        { name: 'list_comments_listId_idx', columns: ['listId'] },
        { name: 'list_comments_createdAt_idx', columns: ['createdAt'] }
      ]
    },
    
    daily_picks: {
      primaryKey: 'id',
      columns: {
        id: { type: 'string', nullable: false },
        movieId: { type: 'string', nullable: false },
        date: { type: 'date', nullable: false },
        addedCount: { type: 'number', nullable: false, default: 0 },
        createdAt: { type: 'date', nullable: false }
      },
      indexes: [
        { name: 'daily_picks_date_idx', columns: ['date'] },
        { name: 'daily_picks_movieId_date_idx', columns: ['movieId', 'date'] },
        { name: 'daily_picks_addedCount_idx', columns: ['addedCount'] }
      ]
    }
  },
  
  // Define relationships between tables
  relationships: [
    {
      name: 'user_lists',
      from: { table: 'users', column: 'id' },
      to: { table: 'movie_lists', column: 'userId' }
    },
    {
      name: 'list_owner',
      from: { table: 'movie_lists', column: 'userId' },
      to: { table: 'users', column: 'id' }
    },
    {
      name: 'list_movies_rel',
      from: { table: 'movie_lists', column: 'id' },
      to: { table: 'list_movies', column: 'listId' }
    },
    {
      name: 'movie_lists_rel',
      from: { table: 'movies', column: 'id' },
      to: { table: 'list_movies', column: 'movieId' }
    },
    {
      name: 'user_ratings',
      from: { table: 'users', column: 'id' },
      to: { table: 'user_movie_ratings', column: 'userId' }
    },
    {
      name: 'movie_ratings',
      from: { table: 'movies', column: 'id' },
      to: { table: 'user_movie_ratings', column: 'movieId' }
    },
    {
      name: 'list_ratings',
      from: { table: 'movie_lists', column: 'id' },
      to: { table: 'user_movie_ratings', column: 'listId' }
    },
    {
      name: 'user_followers',
      from: { table: 'users', column: 'id' },
      to: { table: 'follows', column: 'followingId' }
    },
    {
      name: 'user_following',
      from: { table: 'users', column: 'id' },
      to: { table: 'follows', column: 'followerId' }
    },
    {
      name: 'list_likes_rel',
      from: { table: 'movie_lists', column: 'id' },
      to: { table: 'list_likes', column: 'listId' }
    },
    {
      name: 'user_likes',
      from: { table: 'users', column: 'id' },
      to: { table: 'list_likes', column: 'userId' }
    },
    {
      name: 'list_comments_rel',
      from: { table: 'movie_lists', column: 'id' },
      to: { table: 'list_comments', column: 'listId' }
    },
    {
      name: 'user_comments',
      from: { table: 'users', column: 'id' },
      to: { table: 'list_comments', column: 'userId' }
    },
    {
      name: 'movie_daily_picks',
      from: { table: 'movies', column: 'id' },
      to: { table: 'daily_picks', column: 'movieId' }
    }
  ]
};