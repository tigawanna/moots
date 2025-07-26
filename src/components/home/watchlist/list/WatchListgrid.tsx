import { WatchlistResponse } from "@/lib/pb/types/pb-types";
import { ListResult } from "pocketbase";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Card, Chip, IconButton, Text, useTheme } from "react-native-paper";
import { usewatchlistSettingsStore } from "./hooks";
import { useResponsiveListView } from "@/hooks/useWebCompatibleListView";
import { EmptyRoadSVG } from "@/components/shared/svg/empty";

interface WatchlistGridProps {
  watchListResult: ListResult<WatchlistResponse>;
  refetch: () => Promise<any>;
  isRefetching: boolean;
}

export function WatchlistGrid({ watchListResult, isRefetching, refetch }: WatchlistGridProps) {
  const { colors } = useTheme();
  const { columns, orientation, setOrientation } = useResponsiveListView();
  const watchList = watchListResult.items;

  const renderWatchlistItem = ({ item }: { item: WatchlistResponse }) => (
    <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="outlined">
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={[styles.title, { color: colors.onSurface }]}>
              {item.title}
            </Text>
            <View style={styles.chipContainer}>
              <Chip
                mode="outlined"
                compact
                style={[styles.visibilityChip, { borderColor: colors.outline }]}
                textStyle={{ color: colors.onSurfaceVariant }}>
                {item.visibility[0] || "private"}
              </Chip>
              {item.is_collaborative && (
                <Chip
                  mode="outlined"
                  compact
                  style={[styles.collaborativeChip, { borderColor: colors.primary }]}
                  textStyle={{ color: colors.primary }}>
                  Collaborative
                </Chip>
              )}
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

        {item.overview && (
          <Text
            variant="bodyMedium"
            style={[styles.overview, { color: colors.onSurfaceVariant }]}
            numberOfLines={2}>
            {item.overview}
          </Text>
        )}

        <View style={styles.footer}>
          <Text variant="bodySmall" style={[styles.itemCount, { color: colors.onSurfaceVariant }]}>
            {item.iiitems?.length || 0} items
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

  return (
    <View>
      <IconButton
        style={[styles.toggleOrientationButton, { backgroundColor: colors.onPrimary }]}
        icon={orientation === "grid" ? "view-list" : "view-grid"}
        onPress={() => setOrientation((prev) => (prev === "grid" ? "list" : "grid"))}
      />
      <FlatList
        key={columns}
        numColumns={columns}
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
    padding: 16,
    paddingTop: 8,
  },
  toggleOrientationButton: {
    position: "absolute",
    top: -30,
    right: 8,
    zIndex: 10,
    padding: 8,
    borderRadius: 50,
  },
  card: {
    marginBottom: 12,
    elevation: 1,
  },
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
    gap: 6,
  },
  visibilityChip: {
    height: 24,
  },
  collaborativeChip: {
    height: 24,
  },
  overview: {
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemCount: {
    fontWeight: "500",
  },
  updatedDate: {
    opacity: 0.8,
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
