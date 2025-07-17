import { Schema, SessionIdSymbol, State } from "@livestore/livestore";

// Custom schemas for complex data types
export const StreamingProviderSchema = Schema.Struct({
  name: Schema.String,
  url: Schema.String,
  logoUrl: Schema.optional(Schema.String),
});

export const UserInterestsSchema = Schema.Array(Schema.String);
export const MovieGenresSchema = Schema.Array(Schema.String);
export const MovieDirectorsSchema = Schema.Array(Schema.String);
export const MovieCastSchema = Schema.Array(Schema.String);
export const StreamingProvidersSchema = Schema.Array(StreamingProviderSchema);

// Core data tables for the movie social app
export const tables = {
  // User accounts and profiles
  users: State.SQLite.table({
    name: "users",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      username: State.SQLite.text(),
      email: State.SQLite.text(),
      profilePicture: State.SQLite.text({ nullable: true }),
      bio: State.SQLite.text({ nullable: true }),
      interests: State.SQLite.json({ schema: UserInterestsSchema, default: [] }),
      isPublic: State.SQLite.boolean({ default: true }),
      followersCount: State.SQLite.integer({ default: 0 }),
      followingCount: State.SQLite.integer({ default: 0 }),
      listsCount: State.SQLite.integer({ default: 0 }),
      createdAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      updatedAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      deletedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
    },
  }),

  // Movie metadata (from external APIs like IMDb/TMDb)
  movies: State.SQLite.table({
    name: "movies",
    columns: {
      id: State.SQLite.text({ primaryKey: true }), // IMDb ID for deduplication
      title: State.SQLite.text(),
      year: State.SQLite.integer(),
      genres: State.SQLite.json({ schema: MovieGenresSchema, default: [] }),
      directors: State.SQLite.json({ schema: MovieDirectorsSchema, default: [] }),
      cast: State.SQLite.json({ schema: MovieCastSchema, default: [] }),
      plot: State.SQLite.text({ default: "" }),
      poster: State.SQLite.text({ default: "" }),
      imdbRating: State.SQLite.real({ default: 0 }),
      tmdbRating: State.SQLite.real({ default: 0 }),
      runtime: State.SQLite.integer({ default: 0 }),
      language: State.SQLite.text({ default: "" }),
      country: State.SQLite.text({ default: "" }),
      streamingAvailability: State.SQLite.json({ 
        schema: StreamingProvidersSchema, 
        default: [] 
      }),
      createdAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      updatedAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
    },
  }),

  // User-created movie lists
  movieLists: State.SQLite.table({
    name: "movieLists",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      userId: State.SQLite.text(), // Foreign key to users.id
      title: State.SQLite.text(),
      description: State.SQLite.text({ nullable: true }),
      isPublic: State.SQLite.boolean({ default: true }),
      category: State.SQLite.text({ nullable: true }),
      likesCount: State.SQLite.integer({ default: 0 }),
      commentsCount: State.SQLite.integer({ default: 0 }),
      movieCount: State.SQLite.integer({ default: 0 }),
      createdAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      updatedAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      deletedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
    },
  }),

  // Junction table for movies in lists with user ratings
  listMovies: State.SQLite.table({
    name: "listMovies",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      listId: State.SQLite.text(), // Foreign key to movieLists.id
      movieId: State.SQLite.text(), // Foreign key to movies.id
      userId: State.SQLite.text(), // Foreign key to users.id (for rating attribution)
      rating: State.SQLite.real({ nullable: true }), // 1-5 stars
      notes: State.SQLite.text({ nullable: true }),
      position: State.SQLite.integer({ default: 0 }), // For ordered lists
      createdAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      updatedAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      deletedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
    },
  }),

  // Social follow relationships
  follows: State.SQLite.table({
    name: "follows",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      followerId: State.SQLite.text(), // Foreign key to users.id
      followingId: State.SQLite.text(), // Foreign key to users.id
      createdAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      deletedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
    },
  }),

  // Likes on movie lists
  listLikes: State.SQLite.table({
    name: "listLikes",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      userId: State.SQLite.text(), // Foreign key to users.id
      listId: State.SQLite.text(), // Foreign key to movieLists.id
      createdAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      deletedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
    },
  }),

  // Comments on movie lists
  listComments: State.SQLite.table({
    name: "listComments",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      userId: State.SQLite.text(), // Foreign key to users.id
      listId: State.SQLite.text(), // Foreign key to movieLists.id
      content: State.SQLite.text(),
      createdAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      updatedAt: State.SQLite.integer({ schema: Schema.DateFromNumber }),
      deletedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
    },
  }),

  // Client-only UI state for form inputs and filters
  uiState: State.SQLite.clientDocument({
    name: "uiState",
    schema: Schema.Struct({
      // Movie list creation form
      newListTitle: Schema.String,
      newListDescription: Schema.String,
      newListCategory: Schema.String,
      newListIsPublic: Schema.Boolean,
      
      // Search and filtering
      searchQuery: Schema.String,
      selectedGenres: Schema.Array(Schema.String),
      selectedYearRange: Schema.Struct({
        min: Schema.Number,
        max: Schema.Number,
      }),
      
      // Social filters
      feedFilter: Schema.Literal("following", "popular", "recent"),
      listSortBy: Schema.Literal("recent", "popular", "alphabetical"),
      
      // Current viewing states
      currentListId: Schema.optional(Schema.String),
      currentMovieId: Schema.optional(Schema.String),
      currentUserId: Schema.optional(Schema.String),
    }),
    default: {
      id: SessionIdSymbol,
      value: {
        newListTitle: "",
        newListDescription: "",
        newListCategory: "",
        newListIsPublic: true,
        searchQuery: "",
        selectedGenres: [],
        selectedYearRange: { min: 1900, max: 2025 },
        feedFilter: "recent",
        listSortBy: "recent",
      },
    },
  }),
};
