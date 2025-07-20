// TMDB Image utility for getting images from TMDB using Trakt's TMDB IDs
// Trakt doesn't provide images, so we use TMDB for artwork

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

export interface TMDBImageSizes {
  poster: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";
  backdrop: "w300" | "w780" | "w1280" | "original";
}

export function getTMDBImageUrl(
  path: string | null,
  type: keyof TMDBImageSizes,
  size: TMDBImageSizes[keyof TMDBImageSizes] = type === "poster" ? "w342" : "w780"
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
}

// Helper to get images for a movie/show using TMDB ID
export async function getTMDBImages(tmdbId: number, type: "movie" | "tv") {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`
    );
    
    if (!response.ok) {
      return { poster: null, backdrop: null };
    }
    
    const data = await response.json();
    
    return {
      poster: getTMDBImageUrl(data.poster_path, "poster"),
      backdrop: getTMDBImageUrl(data.backdrop_path, "backdrop"),
    };
  } catch (error) {
    console.warn("Failed to fetch TMDB images:", error);
    return { poster: null, backdrop: null };
  }
}

// Cache images for better performance
const imageCache = new Map<string, { poster: string | null; backdrop: string | null }>();

export async function getCachedTMDBImages(tmdbId: number, type: "movie" | "tv") {
  const cacheKey = `${type}-${tmdbId}`;
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }
  
  const images = await getTMDBImages(tmdbId, type);
  imageCache.set(cacheKey, images);
  
  return images;
}
