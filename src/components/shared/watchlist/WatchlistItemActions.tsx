import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { UnifiedWatchlistItem } from "./types";
import { WatchlistItemUtils } from "./WatchlistItemUtils";
import {
  addToWatchListMutationOptions,
  removeFromWatchListMutationOptions,
  toggleWatchedListItemMutationOptions,
} from "@/lib/tanstack/operations/watchlist/user-watchlist";
import { useMutation } from "@tanstack/react-query";
import { pb } from "@/lib/pb/client";

interface WatchlistItemActionsProps {
  item: UnifiedWatchlistItem;
  onToggleWatched?: (item: UnifiedWatchlistItem) => void;
  onRemove?: (item: UnifiedWatchlistItem) => void;
  onAdd?: (item: UnifiedWatchlistItem) => void;
  size?: "small" | "medium";
  layout?: "horizontal" | "vertical";
}

export function WatchlistItemActions({
  item,
  onToggleWatched,
  onRemove,
  onAdd,
  size = "medium",
  layout = "horizontal",
}: WatchlistItemActionsProps) {
  const { colors } = useTheme();
  
  const user = pb.authStore.record
  const quickAddMutation = useMutation(addToWatchListMutationOptions());
  const removeFromWatchlist = useMutation(removeFromWatchListMutationOptions());
  const toggleWatchedStatus = useMutation(toggleWatchedListItemMutationOptions());

  const isWatched = WatchlistItemUtils.getWatchedStatus(item);
  const isInWatchlist = WatchlistItemUtils.isInWatchlist(item);

  const iconSize = size === "small" ? 18 : 20;

  const handleToggleWatched = (event: any) => {
    event.stopPropagation();
    if (onToggleWatched) {
      onToggleWatched(item);
    } else {
      console.log("Toggle watched:", item.tmdb_id, !isWatched);
    }
  };

  const handleRemove = (event: any) => {
    event.stopPropagation();
    if (!onRemove) {
      console.log("Remove item:", item.tmdb_id);
      return;
    }

    Alert.alert("Remove from Watchlist", `Remove "${item.title}" from your watchlist?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => onRemove(item),
      },
    ]);
  };

  const handleAdd = (event: any) => {
    event.stopPropagation();
    if (onAdd) {
      onAdd(item);
    } else {
      console.log("Add to watchlist:", item.tmdb_id);
    }
  };

  const containerStyle =
    layout === "vertical" ? styles.verticalContainer : styles.horizontalContainer;

  if (!isInWatchlist) {
    // Show add button for TMDB items not in watchlist
    return (
      <View style={containerStyle}>
        <IconButton
          icon="bookmark-plus-outline"
          size={iconSize}
          iconColor={colors.primary}
          onPress={handleAdd}
          style={styles.actionButton}
        />
      </View>
    );
  }

  // Show toggle watched and remove buttons for watchlist items
  return (
    <View style={containerStyle}>
      <IconButton
        icon={isWatched ? "check-circle" : "check-circle-outline"}
        size={iconSize}
        iconColor={isWatched ? colors.primary : colors.outline}
        onPress={handleToggleWatched}
        style={styles.actionButton}
      />
      <IconButton
        icon="delete-outline"
        size={iconSize}
        iconColor={colors.error}
        onPress={handleRemove}
        style={styles.actionButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  verticalContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  actionButton: {
    margin: 0,
  },
});
