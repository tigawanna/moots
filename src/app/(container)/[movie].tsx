import { MovieDetailScreen } from "@/components/tmdb/MovieDetailScreen";
import { TVDetailScreen } from "@/components/tmdb/TVDetailScreen";
import { useLocalSearchParams } from "expo-router";

export default function MediaDetails() {
  const { movie, type } = useLocalSearchParams() as { movie: string; type?: string };
  const mediaId = parseInt(movie, 10);
  
  if (isNaN(mediaId)) {
    return null;
  }
  
  // Default to movie if no type specified
  const mediaType = type === "tv" ? "tv" : "movie";
  
  if (mediaType === "tv") {
    return <TVDetailScreen tvId={mediaId} />;
  }
  
  return <MovieDetailScreen movieId={mediaId} />;
}
