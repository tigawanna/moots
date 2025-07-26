import { WatchlistResponse } from "@/lib/pb/types/pb-types";
import { DateUtils } from "@/utils/date-utils";
import { StyleSheet, View } from "react-native";
import { Card, Icon, IconButton, Text, useTheme } from "react-native-paper";

interface WatchlistCardProps {
  item: WatchlistResponse;
  viewMode: "grid" | "list";
  onPress?: (item: WatchlistResponse) => void;
  onMenuPress?: (item: WatchlistResponse) => void;
}

export function WatchlistCard({ 
  item, 
  viewMode, 
  onPress, 
  onMenuPress 
}: WatchlistCardProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    onPress?.(item);
  };

  const handleMenuPress = () => {
    onMenuPress?.(item);
  };

  const getVisibilityIcon = (visibility: string|string[]) => {
    switch (Array.isArray(visibility) ? visibility[0] : visibility) {
      case "public":
        return "earth";
      case "followers_only":
        return "account-group";
      case "private":
      default:
        return "lock";
    }
  };

  const getVisibilityColor = (visibility: string|string[]) => {
    switch (Array.isArray(visibility) ? visibility[0] : visibility) {
      case "public":
        return colors.primary;
      case "followers_only":
        return colors.tertiary;
      case "private":
      default:
        return colors.onSurfaceVariant;
    }
  };

  if (viewMode === "list") {
    return (
      <Card
        style={[styles.listCard, { backgroundColor: colors.surface }]}
        mode="outlined"
        onPress={handlePress}>
        <Card.Content style={styles.listContent}>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text variant="titleMedium" style={[styles.title, { color: colors.onSurface }]}>
                {item.title}
              </Text>
              <View style={styles.metadataRow}>
                <View style={styles.iconWithText}>
                  <Icon
                    source={getVisibilityIcon(item.visibility || "private")}
                    size={24}
                    color={getVisibilityColor(item.visibility || "private")}
                  />
                  <Text
                    variant="bodyMedium"
                    style={[styles.smallMetadataText, { color: colors.onSurfaceVariant }]}>
                    {item.visibility[0] || "private"}
                  </Text>
                </View>
                {item.is_collaborative && (
                  <View style={styles.iconWithText}>
                    <Icon source="account-multiple" size={14} color={colors.primary} />
                    <Text
                      variant="bodySmall"
                      style={[styles.metadataText, { color: colors.primary }]}>
                      Collaborative
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <IconButton
              icon="dots-vertical"
              size={20}
              iconColor={colors.onSurfaceVariant}
              onPress={handleMenuPress}
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
            <View style={styles.iconWithText}>
              <Icon source="playlist-play" size={16} color={colors.onSurfaceVariant} />
              <Text
                variant="bodySmall"
                style={[styles.itemCount, { color: colors.onSurfaceVariant }]}>
                {item.items?.length || 0} items
              </Text>
            </View>
            <View style={styles.iconWithText}>
              <Icon source="clock-outline" size={14} color={colors.onSurfaceVariant} />
              <Text
                variant="bodySmall"
                style={[styles.updatedDate, { color: colors.onSurfaceVariant }]}>
                {DateUtils.formatPocketBaseDate(item.updated)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  }

  // Grid view
  return (
    <Card
      style={[styles.gridCard, { backgroundColor: colors.surface }]}
      mode="outlined"
      onPress={handlePress}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text
              variant="titleMedium"
              style={[styles.title, { color: colors.onSurface }]}
              numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.metadataRow}>
              <View style={styles.iconWithText}>
                <Icon
                  source={getVisibilityIcon(item.visibility || "private")}
                  size={24}
                  color={getVisibilityColor(item.visibility || "private")}
                />
                <Text
                  variant="bodyMedium"
                  style={[styles.smallMetadataText, { color: colors.onSurfaceVariant }]}>
                  {item.visibility[0] || "private"}
                </Text>
              </View>
              {item.is_collaborative && (
                <View style={styles.iconWithText}>
                  <Icon source="account-multiple" size={12} color={colors.primary} />
                  <Text
                    variant="bodySmall"
                    style={[styles.smallMetadataText, { color: colors.primary }]}>
                    Collab
                  </Text>
                </View>
              )}
            </View>
          </View>
          <IconButton
            icon="dots-vertical"
            size={18}
            iconColor={colors.onSurfaceVariant}
            onPress={handleMenuPress}
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
          <View style={styles.iconWithText}>
            <Icon source="playlist-play" size={14} color={colors.onSurfaceVariant} />
            <Text
              variant="bodySmall"
              style={[styles.itemCount, { color: colors.onSurfaceVariant }]}>
              {item.items?.length || 0}
            </Text>
          </View>
          <View style={styles.iconWithText}>
            <Icon source="clock-outline" size={12} color={colors.onSurfaceVariant} />
            <Text
              variant="bodySmall"
              style={[styles.updatedDate, { color: colors.onSurfaceVariant }]}>
              {DateUtils.formatPocketBaseDate(item.updated)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
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
  metadataRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  iconWithText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  smallMetadataText: {
    fontSize: 10,
    textTransform: "capitalize",
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
    fontSize: 11,
  },
});
