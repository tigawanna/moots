import { WatchlistResponse } from "@/lib/pb/types/pb-types";
import { ListResult } from "pocketbase";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Card, Chip, IconButton, Text, useTheme } from "react-native-paper";

import { EmptyRoadSVG } from "@/components/shared/svg/empty";


interface WatchlistGridProps {
  watchListResult: ListResult<WatchlistResponse>;
  refetch: () => Promise<any>;
  isRefetching: boolean;
  columns: number;
  orientation: "grid" | "list";
  setOrientation: (newOrientation: "grid" | "list") => void;
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

  const renderWatchlistItem = ({ item }: { item: WatchlistResponse }) => {
    if (orientation === "list") {
      return (
        <Card style={[styles.listCard, { backgroundColor: colors.surface }]} mode="outlined">
          <Card.Content style={styles.listContent}>
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <Text variant="titleMedium" style={[styles.title, { color: colors.onSurface }]}>
                  {item.title}
                </Text>
                <View style={styles.chipContainer}>
                  <Chip mode="outlined">{item.visibility || "private"}</Chip>
                  {item.is_collaborative && <Chip mode="outlined">Collaborative</Chip>}
                </View>
              </View>
              <IconButton
                icon="dots-vertical"
                size={20}
                iconColor={colors.onSurfaceVariant}
                onPress={() => {
                  // TODO: Add menu actions (edit, delete, share, etc.)
                }}
              />
            </View>

            {item.overview ? (
              <Text
                variant="bodyMedium"
                style={[styles.overview, { color: colors.onSurfaceVariant }]}
                numberOfLines={2}>
                {item.overview}
              </Text>
            ) : null}

            <View style={styles.footer}>
              <Text
                variant="bodySmall"
                style={[styles.itemCount, { color: colors.onSurfaceVariant }]}>
                {item.items?.length || 0} items
              </Text>
              <Text
                variant="bodySmall"
                style={[styles.updatedDate, { color: colors.onSurfaceVariant }]}>
                Updated {new Date(item.updated).toLocaleDateString()}
              </Text>
            </View>
          </Card.Content>
        </Card>
      );
    }

    // Grid view
    return (
      <Card style={[styles.gridCard, { backgroundColor: colors.surface }]} mode="outlined">
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text
                variant="titleMedium"
                style={[styles.title, { color: colors.onSurface }]}
                numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.chipContainer}>
                <Chip mode="outlined">{item.visibility[0] || "private"}</Chip>
                {item.is_collaborative && <Chip mode="outlined">Collaborative</Chip>}
              </View>
            </View>
            <IconButton
              icon="dots-vertical"
              size={18}
              iconColor={colors.onSurfaceVariant}
              onPress={() => {
                // TODO: Add menu actions (edit, delete, share, etc.)
              }}
            />
          </View>

          {item.overview ? (
            <Text
              variant="bodySmall"
              style={[styles.overview, { color: colors.onSurfaceVariant }]}
              numberOfLines={3}>
              {item.overview}
            </Text>
          ) : null}

          <View style={styles.footer}>
            <Text
              variant="bodySmall"
              style={[styles.itemCount, { color: colors.onSurfaceVariant }]}>
              {item.items?.length || 0} items
            </Text>
            <Text
              variant="bodySmall"
              style={[styles.updatedDate, { color: colors.onSurfaceVariant }]}>
              {new Date(item.updated).toLocaleDateString()}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

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

  // Grid card styles
  gridCard: {
    flex: 1,
    margin: 4,
    elevation: 1,
    minHeight: 160,
  },

  // List card styles
  listCard: {
    marginVertical: 4,
    marginHorizontal: 4,
    elevation: 1,
  },
  listContent: {
    paddingVertical: 12,
  },

  // Shared card styles
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontWeight: "600",
    marginBottom: 6,
  },
  chipContainer: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
  },
  visibilityChip: {
    height: 22,
  },
  collaborativeChip: {
    height: 22,
  },
  overview: {
    marginBottom: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  itemCount: {
    fontWeight: "500",
  },
  updatedDate: {
    opacity: 0.8,
    fontSize: 11,
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
