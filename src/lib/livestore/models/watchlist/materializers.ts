import { State } from "@livestore/livestore";
import { events } from "./events";
import { tables } from "./tables";

// Materializers map events to database state changes
export const materializers = State.SQLite.materializers(events, {
  // User management materializers
  "v1.UserRegistered": ({ id, username, email, createdAt }) =>
    tables.users.insert({
      id,
      username,
      email,
      followersCount: 0,
      followingCount: 0,
      listsCount: 0,
      isPublic: true,
      interests: [],
      createdAt,
      updatedAt: createdAt,
    }),

  "v1.UserProfileUpdated": ({ id, profilePicture, bio, interests, isPublic, updatedAt }) => {
    const updateData: any = { updatedAt };
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (bio !== undefined) updateData.bio = bio;
    if (interests !== undefined) updateData.interests = interests;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    
    return tables.users.update(updateData).where({ id });
  },

  "v1.UserDeleted": ({ id, deletedAt }) =>
    tables.users.update({ deletedAt }).where({ id }),

  // Movie data materializers
  "v1.MovieAdded": ({ 
    id, title, year, genres, directors, cast, plot, poster, 
    imdbRating, tmdbRating, runtime, language, country, 
    streamingAvailability, createdAt 
  }) =>
    tables.movies.insert({
      id, title, year, genres, directors, cast, plot, poster,
      imdbRating, tmdbRating, runtime, language, country,
      streamingAvailability, createdAt, updatedAt: createdAt,
    }),

  "v1.MovieUpdated": ({ id, updatedAt, ...updateFields }) => {
    const updateData: any = { updatedAt };
    Object.entries(updateFields).forEach(([key, value]) => {
      if (value !== undefined) updateData[key] = value;
    });
    
    return tables.movies.update(updateData).where({ id });
  },

  // Movie list materializers - simplified for reliability
  "v1.ListCreated": ({ id, userId, title, description, isPublic, category, createdAt }) =>
    tables.movieLists.insert({
      id, userId, title, description, isPublic, category,
      likesCount: 0, commentsCount: 0, movieCount: 0,
      createdAt, updatedAt: createdAt,
    }),

  "v1.ListUpdated": ({ id, updatedAt, ...updateFields }) => {
    const updateData: any = { updatedAt };
    Object.entries(updateFields).forEach(([key, value]) => {
      if (value !== undefined) updateData[key] = value;
    });
    
    return tables.movieLists.update(updateData).where({ id });
  },

  "v1.ListDeleted": ({ id, deletedAt }) => [
    // Soft delete the list
    tables.movieLists.update({ deletedAt }).where({ id }),
    // Soft delete all movies in the list
    tables.listMovies.update({ deletedAt }).where({ listId: id }),
    // Soft delete all likes on the list
    tables.listLikes.update({ deletedAt }).where({ listId: id }),
    // Soft delete all comments on the list
    tables.listComments.update({ deletedAt }).where({ listId: id }),
  ],

  "v1.MovieAddedToList": ({ id, listId, movieId, userId, rating, notes, position, createdAt }) =>
    tables.listMovies.insert({
      id, listId, movieId, userId, rating, notes, position,
      createdAt, updatedAt: createdAt,
    }),

  "v1.MovieRemovedFromList": ({ id, deletedAt }) =>
    tables.listMovies.update({ deletedAt }).where({ id }),

  "v1.MovieRatingUpdated": ({ id, rating, notes, updatedAt }) =>
    tables.listMovies.update({ rating, notes, updatedAt }).where({ id }),

  "v1.ListReordered": ({ listId, moviePositions, updatedAt }) => [
    // Update the list's updatedAt timestamp
    tables.movieLists.update({ updatedAt }).where({ id: listId }),
    // Update each movie's position
    ...moviePositions.map(({ movieId, position }) =>
      tables.listMovies.update({ position, updatedAt }).where({ 
        listId, 
        movieId,
        deletedAt: null 
      })
    ),
  ],

  // Social interaction materializers
  "v1.UserFollowed": ({ id, followerId, followingId, createdAt }) =>
    tables.follows.insert({ id, followerId, followingId, createdAt }),

  "v1.UserUnfollowed": ({ id, deletedAt }) =>
    tables.follows.update({ deletedAt }).where({ id }),

  "v1.ListLiked": ({ id, userId, listId, createdAt }) =>
    tables.listLikes.insert({ id, userId, listId, createdAt }),

  "v1.ListUnliked": ({ id, deletedAt }) =>
    tables.listLikes.update({ deletedAt }).where({ id }),

  "v1.CommentAdded": ({ id, userId, listId, content, createdAt }) =>
    tables.listComments.insert({ id, userId, listId, content, createdAt, updatedAt: createdAt }),

  "v1.CommentUpdated": ({ id, content, updatedAt }) =>
    tables.listComments.update({ content, updatedAt }).where({ id }),

  "v1.CommentDeleted": ({ id, deletedAt }) =>
    tables.listComments.update({ deletedAt }).where({ id }),
});
