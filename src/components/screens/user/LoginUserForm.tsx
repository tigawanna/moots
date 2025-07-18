import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { TabScreen, Tabs, TabsProvider } from "react-native-paper-tabs";
import { LocalLoginForm, SyncedLoginForm } from "./forms";

// Define types for the form data
interface LoginFormData {
  email: string;
  password: string;
}

interface LocalLoginFormData {
  username: string;
}

interface LoginUserFormProps {
  onSubmit?: (data: LoginFormData) => void;
  onLocalLogin?: (data: LocalLoginFormData) => void;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
}

export function LoginUserForm({
  onSubmit,
  onLocalLogin,
  onForgotPassword,
  onCreateAccount,
}: LoginUserFormProps) {
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

        <TabsProvider defaultIndex={0}>
          <Tabs mode="fixed" showLeadingSpace={true}>
            <TabScreen label="Synced Account" icon="cloud-sync">
              <View style={styles.tabContent}>
                <SyncedLoginForm
                  onSubmit={onSubmit}
                  onForgotPassword={onForgotPassword}
                />
              </View>
            </TabScreen>
            <TabScreen label="Local Account" icon="cellphone">
              <View style={styles.tabContent}>
                <LocalLoginForm onSubmit={onLocalLogin} />
              </View>
            </TabScreen>
          </Tabs>
        </TabsProvider>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          mode="outlined"
          onPress={onCreateAccount}
          style={styles.createAccountButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Create New Account
        </Button>
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
