import { WatchlistResponse } from "@/lib/pb/types/pb-types";
import {
  deleteWatchListMutationOptions,
  updateWatchListMutationOptions,
} from "@/lib/tanstack/operations/watchlist/operations-options";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  Card,
  Divider,
  IconButton,
  Menu,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { UpdateWatchlist } from "../UpdateOrDeleteWatchlist";

interface WatchlistMenuProps {
  watchlist: WatchlistResponse;
  onPress?: () => void;
}

export function WatchlistMenu({ watchlist, onPress }: WatchlistMenuProps) {
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const updateMutation = useMutation(updateWatchListMutationOptions());
  const deleteMutation = useMutation(deleteWatchListMutationOptions());

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleEdit = () => {
    closeMenu();
    setUpdateModalVisible(true);
  };

  const handleDelete = () => {
    closeMenu();
    Alert.alert(
      "Delete Watchlist",
      `Are you sure you want to delete "${watchlist.title}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMutation.mutate(watchlist.id);
          },
        },
      ]
    );
  };

  const handleTogglePrivacy = () => {
    closeMenu();
    const currentVisibility = watchlist.visibility[0] || "private";
    const newVisibility =
      currentVisibility === "private" ? "public" : "private";

    Alert.alert(
      `Make ${newVisibility === "private" ? "Private" : "Public"}`,
      `Are you sure you want to make "${watchlist.title}" ${newVisibility}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: `Make ${newVisibility === "private" ? "Private" : "Public"}`,
          onPress: () => {
            updateMutation.mutate({
              id: watchlist.id,
              visibility: [newVisibility],
              user_id: watchlist.user_id,
            });
          },
        },
      ]
    );
  };

  const handleShare = () => {
    closeMenu();
    // TODO: Implement share functionality
    Alert.alert("Share", "Share functionality coming soon!");
  };

  const handleDuplicate = () => {
    closeMenu();
    // TODO: Implement duplicate functionality
    Alert.alert("Duplicate", "Duplicate functionality coming soon!");
  };

  const currentVisibility = watchlist.visibility[0] || "private";
  const isPrivate = currentVisibility === "private";

  return (
    <View>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon="dots-vertical"
            size={20}
            iconColor={colors.onSurfaceVariant}
            onPress={openMenu}
          />
        }
        anchorPosition="bottom"
      >
        <Menu.Item onPress={handleEdit} title="Edit" leadingIcon="pencil" />

        <Menu.Item
          onPress={handleTogglePrivacy}
          title={isPrivate ? "Make Public" : "Make Private"}
          leadingIcon={isPrivate ? "earth" : "lock"}
        />

        <Menu.Item
          onPress={handleShare}
          title="Share"
          leadingIcon="share-variant"
        />

        <Menu.Item
          onPress={handleDuplicate}
          title="Duplicate"
          leadingIcon="content-copy"
        />

        <Divider />

        <Menu.Item
          onPress={handleDelete}
          title="Delete"
          leadingIcon="delete"
          titleStyle={{ color: colors.error }}
        />
      </Menu>

      {/* Update Modal */}
      <Portal>
        <Modal
          visible={updateModalVisible}
          onDismiss={() => setUpdateModalVisible(false)}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          <Card style={{ backgroundColor: colors.surface }}>
            <Card.Content>
              <View style={styles.modalHeader}>
                <Text
                  variant="headlineSmall"
                  style={{ color: colors.onSurface }}
                >
                  Edit Watchlist
                </Text>
                <IconButton
                  icon="close"
                  size={24}
                  iconColor={colors.onSurface}
                  onPress={() => setUpdateModalVisible(false)}
                />
              </View>

              <UpdateWatchlist
                watchlist={watchlist}
                onSuccess={() => {
                  setUpdateModalVisible(false);
                }}
              />
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 12,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
});
