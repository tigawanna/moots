import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, Surface } from "react-native-paper";

export default function ShowDetails() {
  const { show } = useLocalSearchParams() as { show: string };
  return (
    <Surface style={{ ...styles.container }}>
      <Text variant="titleLarge">Show {show}</Text>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
