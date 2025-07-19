
import { StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Signup() {
  const { top } = useSafeAreaInsets();


  return (
      <Surface style={{ flex: 1, paddingTop: top + 10 }}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Choose the type of account you want to create
          </Text>
        </View>

      </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    textAlign: "center",
  },
  tabContent: {
    paddingTop: 16,
  },
  tabDescription: {
    marginBottom: 16,
    textAlign: "center",
    opacity: 0.7,
    paddingHorizontal: 16,
  },
});
