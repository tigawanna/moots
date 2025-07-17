import { TestQueryScreen } from "@/components/screens/home/TestQueryScreen";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";

export default function HomeScreen() {
  return (
    <Surface style={styles.container}>
      <TestQueryScreen />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
