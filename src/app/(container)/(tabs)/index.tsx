import { HomeScreenComponent } from "@/components/screens/home/HomeScreenComponent";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";

// On this screen we'll render the current user's movie list

export default function HomeScreen() {
  return (
    <Surface style={styles.container}>
      <HomeScreenComponent />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
