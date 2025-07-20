import { useAuthState, useLogout } from "@/store/auth-utils";
import { useTraktStore } from "@/store/trakt-store";
import { useUserInfoStore } from "@/store/user-info-store";
import React from "react";
import { View } from "react-native";
import { Avatar, Button, Text, useTheme } from "react-native-paper";

/**
 * Example component showing how to use the new store structure
 */
export function UserProfileExample() {
  const { colors } = useTheme();
  const { logout } = useLogout();
  const { isAuthenticated, userInfo, isTokenExpired } = useAuthState();
  const { tokens, rateLimits } = useTraktStore();
  const { updateUserInfo } = useUserInfoStore();

  if (!isAuthenticated || !userInfo) {
    return (
      <View style={{ padding: 16 }}>
        <Text variant="bodyLarge">Not authenticated</Text>
      </View>
    );
  }

  const handleLogout = () => {
    logout();
  };

  const handleUpdateProfile = () => {
    // Example of updating user info
    updateUserInfo({
      name: "Updated Name",
    });
  };

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {/* User Profile Section */}
      <View style={{ alignItems: "center", gap: 8 }}>
        <Avatar.Image 
          size={80} 
          source={{ uri: userInfo.avatarUrl || "https://via.placeholder.com/80" }} 
        />
        <Text variant="headlineSmall">{userInfo.name || userInfo.username}</Text>
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          @{userInfo.username}
        </Text>
        {userInfo.vip && (
          <Text variant="labelSmall" style={{ color: colors.primary }}>
            VIP Member
          </Text>
        )}
      </View>

      {/* Authentication Status */}
      <View style={{ gap: 8 }}>
        <Text variant="titleMedium">Authentication Status</Text>
        <Text variant="bodyMedium">
          Trakt Connected: {tokens?.accessToken ? "✅" : "❌"}
        </Text>
        <Text variant="bodyMedium">
          Token Expired: {isTokenExpired ? "⚠️ Yes" : "✅ No"}
        </Text>
      </View>

      {/* Rate Limits (if available) */}
      {rateLimits && (
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium">API Limits</Text>
          <Text variant="bodySmall">
            Watchlist: {rateLimits.watchlist.item_count} items
          </Text>
          <Text variant="bodySmall">
            Lists: {rateLimits.list.count} lists, {rateLimits.list.item_count} items
          </Text>
          <Text variant="bodySmall">
            Favorites: {rateLimits.favorites.item_count} items
          </Text>
        </View>
      )}

      {/* Actions */}
      <View style={{ gap: 12 }}>
        <Button mode="outlined" onPress={handleUpdateProfile}>
          Update Profile
        </Button>
        <Button mode="contained" onPress={handleLogout}>
          Logout
        </Button>
      </View>
    </View>
  );
}
