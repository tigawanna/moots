import { Events, Schema } from "@livestore/livestore";
import {
  MovieCastSchema,
  MovieDirectorsSchema,
  MovieGenresSchema,
  StreamingProvidersSchema,
  tables,
  UserInterestsSchema
} from "./tables";

// User management events
export const userEvents = {
  userRegistered: Events.synced({
    name: "v1.UserRegistered",
    schema: Schema.Struct({
      id: Schema.String,
      username: Schema.String,
      email: Schema.String,
      createdAt: Schema.Date,
    }),
  }),

  userProfileUpdated: Events.synced({
    name: "v1.UserProfileUpdated",
    schema: Schema.Struct({
      id: Schema.String,
      profilePicture: Schema.optional(Schema.String),
      bio: Schema.optional(Schema.String),
      interests: Schema.optional(UserInterestsSchema),
      isPublic: Schema.optional(Schema.Boolean),
      updatedAt: Schema.Date,
    }),
  }),

  userDeleted: Events.synced({
    name: "v1.UserDeleted",
    schema: Schema.Struct({
      id: Schema.String,
      deletedAt: Schema.Date,
    }),
  }),
};

// Movie data events
export const movieEvents = {
  movieAdded: Events.synced({
    name: "v1.MovieAdded",
    schema: Schema.Struct({
      id: Schema.String,
      title: Schema.String,
      year: Schema.Number,
      genres: MovieGenresSchema,
      directors: MovieDirectorsSchema,
      cast: MovieCastSchema,
      plot: Schema.String,
      poster: Schema.String,
      imdbRating: Schema.Number,
      tmdbRating: Schema.Number,
      runtime: Schema.Number,
      language: Schema.String,
      country: Schema.String,
      streamingAvailability: StreamingProvidersSchema,
      createdAt: Schema.Date,
    }),
  }),

  movieUpdated: Events.synced({
    name: "v1.MovieUpdated",
    schema: Schema.Struct({
      id: Schema.String,
      title: Schema.optional(Schema.String),
      year: Schema.optional(Schema.Number),
      genres: Schema.optional(MovieGenresSchema),
      directors: Schema.optional(MovieDirectorsSchema),
      cast: Schema.optional(MovieCastSchema),
      plot: Schema.optional(Schema.String),
      poster: Schema.optional(Schema.String),
      imdbRating: Schema.optional(Schema.Number),
      tmdbRating: Schema.optional(Schema.Number),
      runtime: Schema.optional(Schema.Number),
      language: Schema.optional(Schema.String),
      country: Schema.optional(Schema.String),
      streamingAvailability: Schema.optional(StreamingProvidersSchema),
      updatedAt: Schema.Date,
    }),
  }),
};

// Movie list events
export const movieListEvents = {
  listCreated: Events.synced({
    name: "v1.ListCreated",
    schema: Schema.Struct({
      id: Schema.String,
      userId: Schema.String,
      title: Schema.String,
      description: Schema.optional(Schema.String),
      isPublic: Schema.Boolean,
      category: Schema.optional(Schema.String),
      createdAt: Schema.Date,
    }),
  }),

  listUpdated: Events.synced({
    name: "v1.ListUpdated",
    schema: Schema.Struct({
      id: Schema.String,
      title: Schema.optional(Schema.String),
      description: Schema.optional(Schema.String),
      isPublic: Schema.optional(Schema.Boolean),
      category: Schema.optional(Schema.String),
      updatedAt: Schema.Date,
    }),
  }),

  listDeleted: Events.synced({
    name: "v1.ListDeleted",
    schema: Schema.Struct({
      id: Schema.String,
      deletedAt: Schema.Date,
    }),
  }),

  movieAddedToList: Events.synced({
    name: "v1.MovieAddedToList",
    schema: Schema.Struct({
      id: Schema.String, // listMovies.id
      listId: Schema.String,
      movieId: Schema.String,
      userId: Schema.String,
      rating: Schema.optional(Schema.Number),
      notes: Schema.optional(Schema.String),
      position: Schema.Number,
      createdAt: Schema.Date,
    }),
  }),

  movieRemovedFromList: Events.synced({
    name: "v1.MovieRemovedFromList",
    schema: Schema.Struct({
      id: Schema.String, // listMovies.id
      deletedAt: Schema.Date,
    }),
  }),

  movieRatingUpdated: Events.synced({
    name: "v1.MovieRatingUpdated",
    schema: Schema.Struct({
      id: Schema.String, // listMovies.id
      rating: Schema.optional(Schema.Number),
      notes: Schema.optional(Schema.String),
      updatedAt: Schema.Date,
    }),
  }),

  listReordered: Events.synced({
    name: "v1.ListReordered",
    schema: Schema.Struct({
      listId: Schema.String,
      moviePositions: Schema.Array(
        Schema.Struct({
          movieId: Schema.String,
          position: Schema.Number,
        })
      ),
      updatedAt: Schema.Date,
    }),
  }),
};

// Social interaction events
export const socialEvents = {
  userFollowed: Events.synced({
    name: "v1.UserFollowed",
    schema: Schema.Struct({
      id: Schema.String, // follows.id
      followerId: Schema.String,
      followingId: Schema.String,
      createdAt: Schema.Date,
    }),
  }),

  userUnfollowed: Events.synced({
    name: "v1.UserUnfollowed",
    schema: Schema.Struct({
      id: Schema.String, // follows.id
      deletedAt: Schema.Date,
    }),
  }),

  listLiked: Events.synced({
    name: "v1.ListLiked",
    schema: Schema.Struct({
      id: Schema.String, // listLikes.id
      userId: Schema.String,
      listId: Schema.String,
      createdAt: Schema.Date,
    }),
  }),

  listUnliked: Events.synced({
    name: "v1.ListUnliked",
    schema: Schema.Struct({
      id: Schema.String, // listLikes.id
      deletedAt: Schema.Date,
    }),
  }),

  commentAdded: Events.synced({
    name: "v1.CommentAdded",
    schema: Schema.Struct({
      id: Schema.String, // listComments.id
      userId: Schema.String,
      listId: Schema.String,
      content: Schema.String,
      createdAt: Schema.Date,
    }),
  }),

  commentUpdated: Events.synced({
    name: "v1.CommentUpdated",
    schema: Schema.Struct({
      id: Schema.String, // listComments.id
      content: Schema.String,
      updatedAt: Schema.Date,
    }),
  }),

  commentDeleted: Events.synced({
    name: "v1.CommentDeleted",
    schema: Schema.Struct({
      id: Schema.String, // listComments.id
      deletedAt: Schema.Date,
    }),
  }),
};

// Combine all events and include UI state setter
export const events = {
  ...userEvents,
  ...movieEvents,
  ...movieListEvents,
  ...socialEvents,
  
  // Auto-generated UI state setter
  uiStateSet: tables.uiState.set,
};
