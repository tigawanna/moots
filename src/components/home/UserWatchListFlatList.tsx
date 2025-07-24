import { WatchlistResponse } from "@/lib/pb/types/pb-types";
import React, { useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { WatchlistItemCard } from "./WatchlistItemCard";

interface UserWatchListFlatListProps {
  watchList: WatchlistResponse[];
  refetch?: () => void;
  isRefreshing?: boolean;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  viewMode?: "grid" | "list";
  emptyMessage?: string;
}

export function UserWatchListFlatList({
  watchList,
  refetch,
  isRefreshing = false,
  onEndReached,
  onEndReachedThreshold = 0.1,
  viewMode = "grid",
  emptyMessage = "Watchlist is empty. Start adding movies and TV shows!",
}: UserWatchListFlatListProps) {
  const { colors } = useTheme();

  const renderItem = useCallback(
    ({ item }: { item: WatchlistResponse }) => (
      <WatchlistItemCard item={item} viewMode={viewMode} />
    ),
    [viewMode]
  );

  const keyExtractor = useCallback((item: WatchlistResponse) => item.id, []);

  const getItemLayout = useCallback(
    (data: any, index: number) => {
      const itemHeight = viewMode === "grid" ? 280 : 120;
      return {
        length: itemHeight,
        offset: itemHeight * index,
        index,
      };
    },
    [viewMode]
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text
        variant="headlineSmall"
        style={[styles.emptyTitle, { color: colors.onSurfaceVariant }]}
      >
        No items found
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptyMessage, { color: colors.onSurfaceVariant }]}
      >
        {emptyMessage}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={watchList}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={viewMode === "grid" ? 2 : 1}
      key={viewMode} // Force re-render when view mode changes
      contentContainerStyle={[
        styles.container,
        watchList.length === 0 && styles.emptyContainer,
      ]}
      columnWrapperStyle={viewMode === "grid" ? styles.row : undefined}
      showsVerticalScrollIndicator={false}
      refreshControl={
        refetch ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={6}
      ListEmptyComponent={renderEmpty}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 8,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  emptyMessage: {
    textAlign: "center",
    lineHeight: 20,
  },
});
