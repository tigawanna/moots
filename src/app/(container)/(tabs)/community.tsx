import { Watchlist } from "@/components/watchlist/list/Watchlist";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function CommunityRoute() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: top + 12 }}>
        <Watchlist community />
    </View>
  );
}
