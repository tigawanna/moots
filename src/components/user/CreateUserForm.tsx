import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";



export function CreateUserForm() {


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Choose the type of account you want to create
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
  },
  content: {
    padding: 2,
    paddingTop: 40,
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
  }
});
