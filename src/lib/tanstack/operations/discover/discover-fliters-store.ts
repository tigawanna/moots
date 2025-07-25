import { DiscoverMoviesParams, DiscoverTVParams } from "@/lib/tmdb/sdk-via-pb";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Combined filter interface with the 6 most important overlapping filters
export interface DiscoverFilters {
  // Content type selection
  mediaType: "movie" | "tv" | "both";

  // Sorting options
  sort_by: string;

  // Genre filtering (most important for discovery)
  with_genres?: string;

  // Quality filtering
  "vote_average.gte"?: number;
  "vote_count.gte"?: number;

  // Year/Date filtering (using generic year for both movies and TV)
  year?: string;

  // Language filtering
  language?: string;

  // Runtime filtering
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
}

// Sort options that work for both movies and TV
export const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular", mediaType: undefined },
  { value: "popularity.asc", label: "Least Popular", mediaType: undefined },
  { value: "vote_average.desc", label: "Highest Rated", mediaType: undefined },
  { value: "vote_average.asc", label: "Lowest Rated", mediaType: undefined },
  { value: "vote_count.desc", label: "Most Voted", mediaType: undefined },
  { value: "vote_count.asc", label: "Least Voted", mediaType: undefined },
  // Movie specific
  { value: "release_date.desc", label: "Newest Movies", mediaType: "movie" },
  { value: "release_date.asc", label: "Oldest Movies", mediaType: "movie" },
  // TV specific
  { value: "first_air_date.desc", label: "Newest TV Shows", mediaType: "tv" },
  { value: "first_air_date.asc", label: "Oldest TV Shows", mediaType: "tv" },
] as const;

// Common genres that exist for both movies and TV
export const COMMON_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
] as const;

interface DiscoverFiltersState {
  filters: DiscoverFilters;
  setFilters: (filters: Partial<DiscoverFilters>) => void;
  resetFilters: () => void;

  // Helper methods
  getMovieParams: () => DiscoverMoviesParams;
  getTVParams: () => DiscoverTVParams;

  // Genre helpers
  selectedGenres: number[];
  toggleGenre: (genreId: number) => void;
  clearGenres: () => void;
}

const DEFAULT_FILTERS: DiscoverFilters = {
  mediaType: "both",
  sort_by: "popularity.desc",
  language: "en-US",
};

export const useDiscoverFiltersStore = create<DiscoverFiltersState>()(
  devtools(
    persist(
      (set, get) => ({
        filters: DEFAULT_FILTERS,
        selectedGenres: [],

        setFilters: (newFilters) =>
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
          })),

        resetFilters: () =>
          set({
            filters: DEFAULT_FILTERS,
            selectedGenres: [],
          }),

        // Convert combined filters to movie-specific parameters
        getMovieParams: (): DiscoverMoviesParams => {
          const { filters } = get();
          const params: DiscoverMoviesParams = {
            sort_by: filters.sort_by,
            language: filters.language,
          };

          // Map generic filters to movie-specific ones
          if (filters.with_genres) params.with_genres = filters.with_genres;
          if (filters["vote_average.gte"])
            params["vote_average.gte"] = filters["vote_average.gte"];
          if (filters["vote_count.gte"])
            params["vote_count.gte"] = filters["vote_count.gte"];
          if (filters["with_runtime.gte"])
            params["with_runtime.gte"] = filters["with_runtime.gte"];
          if (filters["with_runtime.lte"])
            params["with_runtime.lte"] = filters["with_runtime.lte"];

          // Use year for both year and primary_release_year for movies
          if (filters.year) {
            params.year = filters.year;
            params.primary_release_year = filters.year;
          }

          return params;
        },

        // Convert combined filters to TV-specific parameters
        getTVParams: (): DiscoverTVParams => {
          const { filters } = get();
          const params: DiscoverTVParams = {
            sort_by: filters.sort_by,
            language: filters.language,
          };

          // Map generic filters to TV-specific ones
          if (filters.with_genres) params.with_genres = filters.with_genres;
          if (filters["vote_average.gte"])
            params["vote_average.gte"] = filters["vote_average.gte"];
          if (filters["vote_count.gte"])
            params["vote_count.gte"] = filters["vote_count.gte"];
          if (filters["with_runtime.gte"])
            params["with_runtime.gte"] = filters["with_runtime.gte"];
          if (filters["with_runtime.lte"])
            params["with_runtime.lte"] = filters["with_runtime.lte"];

          // Use year for first_air_date_year for TV shows
          if (filters.year) {
            params.first_air_date_year = filters.year;
          }

          return params;
        },

        // Genre management helpers
        toggleGenre: (genreId) =>
          set((state) => {
            const isSelected = state.selectedGenres.includes(genreId);
            const newSelectedGenres = isSelected
              ? state.selectedGenres.filter((id) => id !== genreId)
              : [...state.selectedGenres, genreId];

            const genreString =
              newSelectedGenres.length > 0
                ? newSelectedGenres.join(",")
                : undefined;

            return {
              selectedGenres: newSelectedGenres,
              filters: {
                ...state.filters,
                with_genres: genreString,
              },
            };
          }),

        clearGenres: () =>
          set((state) => ({
            selectedGenres: [],
            filters: {
              ...state.filters,
              with_genres: undefined,
            },
          })),
      }),
      {
        name: "discover-filters-storage",
        partialize: (state) => ({
          filters: state.filters,
          selectedGenres: state.selectedGenres,
        }),
      }
    ),
    {
      name: "discover-filters-store",
    }
  )
);

// Helper function to get available sort options based on media type
export function getAvailableSortOptions(mediaType: "movie" | "tv" | "both") {
  if (mediaType === "both") {
    return SORT_OPTIONS.filter((option) => !option.mediaType);
  }
  return SORT_OPTIONS.filter(
    (option) => !option.mediaType || option.mediaType === mediaType
  );
}

// Helper function to format genre names from IDs
export function getGenreNames(genreIds: number[]): string[] {
  return genreIds
    .map((id) => COMMON_GENRES.find((genre) => genre.id === id)?.name)
    .filter(Boolean) as string[];
}

// Helper function to get current year for year filtering
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

// Helper function to get year range for filtering
export function getYearRange(startYear: number = 1900): number[] {
  const currentYear = getCurrentYear();
  const years: number[] = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  return years;
}
