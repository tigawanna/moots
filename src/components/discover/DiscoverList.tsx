import { TMDBDiscoverResponse } from "@/lib/tanstack/operations/discover/tmdb-hooks";
import { movieToUnified, tvToUnified, UnifiedMediaItem } from "@/types/unified-media";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { EmptyRoadSVG } from "../shared/svg/empty";
import { UnifiedWatchlistItemCard } from "../shared/watchlist/UnifiedWatchlistItemCard";

interface DiscoverListProps {
  discoverResults: TMDBDiscoverResponse | undefined;
  currentCategory:
    | {
        key: string;
        label: string;
        type: string;
        sort: string;
      }
    | undefined;
  columns: number;
  orientation: "grid" | "list";
  setOrientation: (newOrientation: "grid" | "list") => void;
}

export function DiscoverList({ currentCategory, discoverResults, columns, orientation, setOrientation  }: DiscoverListProps) {
  const mediaTypetab = (currentCategory?.type || "movie") as "movie" | "tv";
  const { colors } = useTheme();

  // Convert TMDB results to unified format
  const unifiedResults: UnifiedMediaItem[] = React.useMemo(() => {
    if (!discoverResults?.results) return [];
    
    return discoverResults.results.map((item: any) => {
      if (mediaTypetab === "movie") {
        return movieToUnified(item);
      } else {
        return tvToUnified(item);
      }
    });
  }, [discoverResults?.results, mediaTypetab]);

  return (
    <View style={styles.discoverContainer}>
      <IconButton
        style={[styles.toggleOrientationButton, { backgroundColor: colors.onPrimary }]}
        icon={orientation === "grid" ? "view-list" : "view-grid"}
        onPress={() => setOrientation(orientation === "grid" ? "list" : "grid")}
      />
      <FlatList
        data={unifiedResults}
        key={columns}
        renderItem={({ item }) => (
          <UnifiedWatchlistItemCard
            item={item}
            viewMode={orientation}
            showActions={true}
            showWatchlistDropdown={true}
            mediaTypeTab={mediaTypetab}
          />
        )}
        keyExtractor={(item) => `${item.id}-${item.media_type}`}
        numColumns={columns}
        contentContainerStyle={styles.resultsGrid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <EmptyRoadSVG />
            </View>
            <Text variant="headlineSmall" style={[styles.emptyTitle, { color: colors.onSurface }]}>
              No {currentCategory?.type === "movie" ? "movies" : "shows"} found
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
              Try adjusting your filters or search terms to discover more content
            </Text>
          </View>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  // Discover styles
  discoverContainer: {
    flex: 1,
  },

  // Results styles
  resultsGrid: {
    padding: 8,
  },
  toggleOrientationButton: {
    position: "absolute",
    top: 10,
    right: 8,
    zIndex: 10,
    padding: 8,
    borderRadius: 50,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  emptyIconContainer: {
    opacity: 0.6,
    marginBottom: 8,
  },
  emptyTitle: {
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },
  emptySubtitle: {
    textAlign: "center",
    opacity: 0.8,
    maxWidth: 280,
    lineHeight: 20,
  },
});
