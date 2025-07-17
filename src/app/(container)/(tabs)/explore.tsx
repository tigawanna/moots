import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";

// on this screen we'll render all the other movies in the movie list that other people have added to their lists
// it could also have a nested material tabs that show the user movie lists which will come from our livestore and the other should list from an api of movie and shows for people to add to their apps

export default function ExploreScreen() {
  return (
    <Surface style={styles.container}>
      <Text>Explore</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
