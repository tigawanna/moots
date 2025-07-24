import { UserWatchList } from "@/components/home/UserWatchList";
import React from "react";
import { View } from "react-native";


export default function CommunityRoute() {
  return (
    <View style={{ flex: 1 }}>
      <UserWatchList community />
    </View>
  );
}
