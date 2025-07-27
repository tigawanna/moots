import { EmptyRoadSVG } from "@/components/shared/svg/empty";
import { WatchlistResponse } from "@/lib/pb/types/pb-types";
import { ListResult } from "pocketbase";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { WatchlistCard } from "./WatchlistCard";
import { WatchlistMenu } from "./WatchlistMenu";

interface WatchlistGridProps {
  watchListResult: ListResult<WatchlistResponse>;
  refetch: () => Promise<any>;
  isRefetching: boolean;
  columns: number;
  orientation: "grid" | "list";
  setOrientation: (orientation: "grid" | "list") => void;

}

export function WatchlistGrid({
  watchListResult,
  isRefetching,
  refetch,
  columns,
  orientation,
  setOrientation,
}: WatchlistGridProps) {
  const { colors } = useTheme();

  const watchList = watchListResult.items;

  const renderWatchlistItem = ({ item }: { item: WatchlistResponse }) => (
    <View style={{ position: 'relative' }}>
      <WatchlistCard
        item={item}
        viewMode={orientation}
        onPress={(watchlist) => {
          // TODO: Navigate to watchlist detail
          console.log("Navigate to watchlist:", watchlist.id);
        }}
      />
      <View style={styles.menuContainer}>
        <WatchlistMenu watchlist={item} />
      </View>
    </View>
  );

  return (
    <View>
      <IconButton
        style={[styles.toggleOrientationButton, { backgroundColor: colors.onPrimary }]}
        icon={orientation === "grid" ? "view-list" : "view-grid"}
        onPress={() => setOrientation(orientation === "grid" ? "list" : "grid")}
      />
      <FlatList
        key={orientation === "grid" ? columns : 1}
        numColumns={orientation === "grid" ? columns : 1}
        data={watchList}
        renderItem={renderWatchlistItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <EmptyRoadSVG />
            </View>
            <Text variant="headlineSmall" style={[styles.emptyTitle, { color: colors.onSurface }]}>
              No content found
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
  listContainer: {
    padding: 8,
    paddingTop: 16,
  },
  toggleOrientationButton: {
    position: "absolute",
    top: -10,
    right: 8,
    zIndex: 10,
    padding: 8,
    borderRadius: 50,
  },
  menuContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 5,
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
    minHeight: 300,
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
