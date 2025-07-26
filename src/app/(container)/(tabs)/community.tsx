import { UserWatchList } from "@/components/home/watchlist-items/UserWatchListItems";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function CommunityRoute() {
    const { top } = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: top + 12 }}>
      <UserWatchList community />
    </View>
  );
}
