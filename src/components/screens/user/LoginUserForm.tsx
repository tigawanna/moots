import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { TabScreen, Tabs, TabsProvider } from "react-native-paper-tabs";



interface LoginUserFormProps {
  // Define any props if needed
}
export function LoginUserForm({}: LoginUserFormProps) {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Login
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Access your account
          </Text>
        </View>



        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>


      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#757575",
  },
  createAccountButton: {
    marginHorizontal: 24,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});
