import { UnifiedWatchlistItem } from "@/components/shared/watchlist/types";
import {
  WatchlistItemCard as SharedWatchlistItemCard,
} from "@/components/shared/watchlist/WatchlistItemCard";
import { WatchlistResponse } from "@/lib/pb/types/pb-types";
import React from "react";

interface WatchlistItemCardProps {
  item: WatchlistResponse;
  viewMode?: "grid" | "list";
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  showActions?: boolean;
  onToggleWatched?: (item: UnifiedWatchlistItem) => void;
  onRemove?: (item: UnifiedWatchlistItem) => void;
}

export function WatchlistItemCard(props: WatchlistItemCardProps) {
  // Convert WatchlistResponse to UnifiedWatchlistItem format
  const unifiedItem: UnifiedWatchlistItem = {
    ...props.item,
    media_type: props.item.media_type, // Already in correct format
    user_id: props.item.user_id, // Already in correct format
  };

  return (
    <SharedWatchlistItemCard
      item={unifiedItem}
      viewMode={props.viewMode}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      isSelected={props.isSelected}
      showActions={props.showActions}
      onToggleWatched={props.onToggleWatched}
      onRemove={props.onRemove}
    />
  );
}
