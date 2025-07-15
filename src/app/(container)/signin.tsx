import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, Surface, Button } from "react-native-paper";

export default function Signin() {
  return (
    <Surface style={{ ...styles.container }}>
      <Text variant="titleLarge">login</Text>
      <Button mode="contained" onPress={() => console.log("Pressed")}>
        <Link href="/">Go to Home</Link>
      </Button>
      <Button mode="contained" onPress={() => console.log("Pressed")}>
        <Link href="/signup">Go to Signup</Link>
      </Button>
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
    gap: 10,
  },
});
