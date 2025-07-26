import { useWatchlistStatus } from "@/hooks/useWatchlistStatus";
import { pb } from "@/lib/pb/client";

import { addToWatchListMutationOptions, removeFromWatchListMutationOptions } from "@/lib/tanstack/operations/watchlist/user-watchlist";
import { type WatchedStatus } from "@/lib/tanstack/operations/watchlist/watchlist-types";
import { WatchlistUtils } from "@/lib/tanstack/operations/watchlist/watchlist-utils";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  IconButton,
  Modal,
  Portal,
  SegmentedButtons,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
// import { useAddToWatchlist, useRemoveFromWatchlist } from '@/lib/tanstack/watchlist-hooks';

interface AddToWatchlistButtonProps {
  tmdbData: any; // TMDB movie/TV data
  mediaType: "movie" | "tv";
  variant?: "button" | "icon" | "chip";
  size?: "small" | "medium" | "large";
  showStatus?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function AddToWatchlistButton({
  tmdbData,
  mediaType,
  variant = "button",
  size = "medium",
  showStatus = true,
  onSuccess,
  onError,
}: AddToWatchlistButtonProps) {
  const userId = pb.authStore.record?.id;
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Form state for detailed add
  const [watchedStatus, setWatchedStatus] = useState<WatchedStatus>("unwatched");
  const [personalRating, setPersonalRating] = useState("");
  const [notes, setNotes] = useState("");

  // Hooks
  const { isInWatchlist, watchlistItem, isLoading, isPending } = useWatchlistStatus(
    tmdbData.id,
    mediaType
  );
  // const { canAdd, currentCount, limit, warningMessage } = useWatchlistLimit();
  // const addToWatchlist = useAddToWatchlist();
  // const removeFromWatchlist = useRemoveFromWatchlist();

  const quickAddMutation = useMutation(addToWatchListMutationOptions());
  const removeFromWatchlist = useMutation(removeFromWatchListMutationOptions());

  if (!userId) return null;

  // Handle quick add (no details)
  const handleQuickAdd = async () => {
    // if (!canAdd) {
    //   Alert.alert(
    //     "Watchlist Full",
    //     `Your watchlist is full (${currentCount}/${limit} items). Remove some items to add new ones.`,
    //     [{ text: "OK" }]
    //   );
    //   return;
    // }

    try {
      const watchlistItemData = WatchlistUtils.tmdbToWatchlistItem(tmdbData, userId, mediaType);
      // await quickAddMutationmutateAsync(watchlistItemData);
      quickAddMutation.mutateAsync({ userId, payload: watchlistItemData });

      setSnackbarMessage(`Added "${tmdbData.title || tmdbData.name}" to watchlist`);
      setSnackbarVisible(true);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add to watchlist";
      onError?.(errorMessage);
      Alert.alert("Error", errorMessage);
    }
  };

  // Handle detailed add (with modal)
  const handleDetailedAdd = async () => {
    // if (!canAdd) {
    //   Alert.alert(
    //     "Watchlist Full",
    //     `Your watchlist is full (${currentCount}/${limit} items). Remove some items to add new ones.`,
    //     [{ text: "OK" }]
    //   );
    //   return;
    // }

    try {
      const watchlistItemData = WatchlistUtils.tmdbToWatchlistItem(tmdbData, userId, mediaType);

      await quickAddMutation.mutateAsync({
        userId,
        payload: watchlistItemData,
      });

      setDetailsModalVisible(false);
      setSnackbarMessage(`Added "${tmdbData.title || tmdbData.name}" to watchlist`);
      setSnackbarVisible(true);
      onSuccess?.();

      // Reset form
      setWatchedStatus("unwatched");
      setPersonalRating("");
      setNotes("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add to watchlist";
      onError?.(errorMessage);
      Alert.alert("Error", errorMessage);
    }
  };

  // Handle remove
  const handleRemove = () => {
    if (!watchlistItem) return;

    Alert.alert(
      "Remove from Watchlist",
      `Remove "${tmdbData.title || tmdbData.name}" from your watchlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeFromWatchlist.mutateAsync(watchlistItem.id);
              setSnackbarMessage(`Removed "${tmdbData.title || tmdbData.name}" from watchlist`);
              setSnackbarVisible(true);
              onSuccess?.();
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : "Failed to remove from watchlist";
              onError?.(errorMessage);
              Alert.alert("Error", errorMessage);
            }
          },
        },
      ]
    );
  };

  // Get button props based on state
  const getButtonProps = () => {
    if (isInWatchlist) {
      return {
        icon: "check",
        text: showStatus
          ? `In Watchlist${watchlistItem?.watched_status === "watched" ? " (Watched)" : ""}`
          : "In Watchlist",
        color: watchlistItem?.watched_status === "watched" ? "#4CAF50" : "#2196F3",
        onPress: handleRemove,
      };
    }

    return {
      icon: isPending ? "hourglass-empty" : "bookmark-outline",
      text: isPending ? "Adding..." : "Add to Watchlist",
      color: "#2196F3",
      onPress: handleQuickAdd,
    };
  };

  const buttonProps = getButtonProps();
  const isDisabled =
    isLoading || isPending || quickAddMutation.isPending || removeFromWatchlist.isPending;

  // Render different variants
  const renderButton = () => {
    switch (variant) {
      case "icon":
        return (
          <IconButton
            icon={buttonProps.icon}
            size={size === "small" ? 20 : size === "large" ? 28 : 24}
            iconColor={buttonProps.color}
            disabled={isDisabled}
            onPress={buttonProps.onPress}
            onLongPress={isInWatchlist ? undefined : () => setDetailsModalVisible(true)}
          />
        );

      case "chip":
        return (
          <Chip
            icon={buttonProps.icon}
            selected={isInWatchlist}
            disabled={isDisabled}
            onPress={buttonProps.onPress}
            onLongPress={isInWatchlist ? undefined : () => setDetailsModalVisible(true)}
            style={[styles.chip, isInWatchlist && { backgroundColor: buttonProps.color + "20" }]}
            textStyle={isInWatchlist ? { color: buttonProps.color } : undefined}>
            {buttonProps.text}
          </Chip>
        );

      default:
        return (
          <View style={styles.buttonContainer}>
            <Button
              mode={isInWatchlist ? "outlined" : "contained"}
              icon={buttonProps.icon}
              disabled={isDisabled}
              onPress={buttonProps.onPress}
              style={[styles.button, isInWatchlist && { borderColor: buttonProps.color }]}
              buttonColor={isInWatchlist ? undefined : buttonProps.color}
              textColor={isInWatchlist ? buttonProps.color : undefined}>
              {buttonProps.text}
            </Button>

            {!isInWatchlist && (
              <IconButton
                icon="tune"
                size={20}
                disabled={isDisabled}
                onPress={() => setDetailsModalVisible(true)}
                style={styles.detailsButton}
              />
            )}
          </View>
        );
    }
  };

  return (
    <>
      {renderButton()}

      {/* Limit warning */}
      {/* {!canAdd && warningMessage && (
        <Text variant="bodySmall" style={styles.warningText}>
          {warningMessage}
        </Text>
      )} */}

      {/* Detailed Add Modal */}
      <Portal>
        <Modal
          visible={detailsModalVisible}
          onDismiss={() => setDetailsModalVisible(false)}
          contentContainerStyle={styles.modalContent}>
          <Card>
            <Card.Title title="Add to Watchlist" subtitle={tmdbData.title || tmdbData.name} />

            <Card.Content>
              {/* Watched Status */}
              <Text variant="titleSmall" style={styles.fieldLabel}>
                Status
              </Text>
              <SegmentedButtons
                value={watchedStatus}
                onValueChange={(value) => setWatchedStatus(value as WatchedStatus)}
                buttons={[
                  { value: "unwatched", label: "Plan to Watch" },
                  { value: "watching", label: "Watching" },
                  { value: "watched", label: "Watched" },
                ]}
                style={styles.segmentedButtons}
              />

              {/* Personal Rating */}
              <Text variant="titleSmall" style={styles.fieldLabel}>
                My Rating (1-10)
              </Text>
              <TextInput
                value={personalRating}
                onChangeText={setPersonalRating}
                placeholder="Optional"
                keyboardType="numeric"
                maxLength={2}
                style={styles.textInput}
              />

              {/* Notes */}
              <Text variant="titleSmall" style={styles.fieldLabel}>
                Notes
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Why do you want to watch this?"
                multiline
                numberOfLines={3}
                style={styles.textInput}
              />
            </Card.Content>

            <Card.Actions>
              <Button onPress={() => setDetailsModalVisible(false)}>Cancel</Button>
              <Button
                mode="contained"
                onPress={handleDetailedAdd}
                disabled={quickAddMutation.isPending}>
                Add to Watchlist
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>

      {/* Success/Error Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "Undo",
          onPress: () => {
            // Implement undo functionality if needed
          },
        }}>
        {snackbarMessage}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    flex: 1,
  },
  detailsButton: {
    marginLeft: 4,
  },
  chip: {
    marginVertical: 4,
  },
  warningText: {
    color: "#F44336",
    marginTop: 4,
    textAlign: "center",
  },

  // Modal styles
  modalContent: {
    margin: 20,
  },
  fieldLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  textInput: {
    marginBottom: 8,
  },
});
