import { StyleSheet } from "react-native";
import { Text, Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Signin() {
  const { top } = useSafeAreaInsets();
  return (
    <Surface style={{ ...styles.container, paddingTop: top }}>
      <Text variant="titleLarge">signin</Text>
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
