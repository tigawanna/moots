import { MovieDetailScreen } from "@/components/tmdb/MovieDetailScreen";
import { TVDetailScreen } from "@/components/tmdb/TVDetailScreen";
import { useLocalSearchParams } from "expo-router";

export default function MediaDetails() {
  const { show, type } = useLocalSearchParams() as { show: string; type?: string };
  const mediaId = parseInt(show, 10);
  
  if (isNaN(mediaId)) {
    return null;
  }
  
  // Default to tv if no type specified
  const mediaType = type === "movie" ? "movie" : "tv";
  
  if (mediaType === "movie") {
    return <MovieDetailScreen movieId={mediaId} />;
  }
  
  return <TVDetailScreen tvId={mediaId} />;
}
