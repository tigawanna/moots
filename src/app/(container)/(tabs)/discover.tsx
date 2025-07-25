import { DiscoverScreen } from "@/components/discover/DiscoverScreen";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExploreRoute() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: top + 12 }}>
      <DiscoverScreen />
    </View>
  );
}
