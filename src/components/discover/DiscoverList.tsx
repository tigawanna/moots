import { FlatList, StyleSheet, View } from "react-native";
import { WatchlistItemCard } from "../shared/watchlist/WatchlistItemCard";
import { TMDBDiscoverResponse } from "@/lib/tanstack/operations/discover/tmdb-hooks";
import { useResponsiveListView } from "@/hooks/useWebCompatibleListView";
import { Button,IconButton, useTheme } from "react-native-paper";

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
}

export function DiscoverList({ currentCategory, discoverResults }: DiscoverListProps) {
  const { colors } = useTheme();
  const { columns, orientation, setOrientation } = useResponsiveListView();
  return (
    <View style={styles.discoverContainer}>
      <IconButton
        style={[styles.toggleOrientationButton, { backgroundColor: colors.onPrimary }]}
        icon={orientation === "grid" ? "view-list" : "view-grid"}
        onPress={() => setOrientation((prev) => (prev === "grid" ? "list" : "grid"))}
      />
      {/* Category Selection */}
      <FlatList
        data={(discoverResults?.results as any[]) || []}
        key={columns}
        renderItem={({ item }) => (
          <WatchlistItemCard item={item} viewMode={orientation} showActions={true} />
        )}
        keyExtractor={(item) => `${item.id}-${currentCategory?.type}`}
        numColumns={columns}
        contentContainerStyle={styles.resultsGrid}
        showsVerticalScrollIndicator={false}
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
    top: -30,
    right: 8,
    zIndex: 10,
    padding: 8,
    borderRadius: 50,
  },
});
