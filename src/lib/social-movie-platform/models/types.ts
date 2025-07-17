/**
 * Core data models for the Social Movie Platform
 * These interfaces define the structure of the main entities in the application
 */

/**
 * User model representing a platform user
 */
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  interests: string[];
  isPublic: boolean;
  followersCount: number;
  followingCount: number;
  listsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * MovieList model representing a curated list of movies created by a user
 */
export interface MovieList {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isPublic: boolean;
  category?: string;
  movieIds: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * StreamingProvider model for movie availability information
 */
export interface StreamingProvider {
  provider: string;
  url?: string;
  availableFrom?: Date;
  price?: number;
  quality?: string; // HD, SD, 4K, etc.
}

/**
 * Movie model representing movie metadata
 * Uses IMDb ID as primary identifier for deduplication
 */
export interface Movie {
  id: string; // IMDb ID for deduplication
  title: string;
  year: number;
  genre: string[];
  director: string[];
  cast: string[];
  plot: string;
  poster: string;
  imdbRating: number;
  tmdbRating: number;
  runtime: number;
  language: string;
  country: string;
  streamingAvailability?: StreamingProvider[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * UserMovieRating model for user ratings and notes on movies
 */
export interface UserMovieRating {
  id: string;
  userId: string;
  movieId: string;
  rating: number; // 1-5 stars
  notes?: string;
  listId: string; // Which list this rating belongs to
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Follow model representing user follow relationships
 */
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

/**
 * ListLike model representing user likes on movie lists
 */
export interface ListLike {
  id: string;
  userId: string;
  listId: string;
  createdAt: Date;
}

/**
 * ListComment model representing user comments on movie lists
 */
export interface ListComment {
  id: string;
  userId: string;
  listId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DailyPick model for trending movies
 */
export interface DailyPick {
  id: string;
  movieId: string;
  date: Date;
  addedCount: number; // Number of times added to public lists on this date
  createdAt: Date;
}