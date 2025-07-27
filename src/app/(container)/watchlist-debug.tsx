import { WatchlistDebugScreen } from "@/components/watchlist/WatchlistDebugScreen";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WatchlistDebugRoute() {
  const { top } = useSafeAreaInsets();
  
  return (
    <View style={{ flex: 1, paddingTop: top }}>
      <WatchlistDebugScreen />
    </View>
  );
}

export const unstable_settings = {
  headerShown: false,
};
