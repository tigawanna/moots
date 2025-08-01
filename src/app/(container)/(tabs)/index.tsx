import { Watchlist } from "@/components/watchlist/list/Watchlist";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// On this screen we'll render the current user's movie list

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <Surface style={[styles.container, { paddingTop: top + 12 }]}>
      <Watchlist />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
