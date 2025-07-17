import { LocalAccountForm, SyncedAccountForm } from "@/components/screens/user/forms";
import { StyleSheet, View } from "react-native";
import { Surface, useTheme, Text } from "react-native-paper";
import { Tabs, TabScreen, TabsProvider } from "react-native-paper-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Signup() {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <TabsProvider defaultIndex={0}>
      <Surface style={{ flex: 1, paddingTop: top + 10 }}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Choose the type of account you want to create
          </Text>
        </View>
        <Tabs
          mode="fixed"
          showLeadingSpace={true}
          theme={theme}
          tabHeaderStyle={{
            backgroundColor: theme.colors.surface,
            padding: 4,
          }}
        >
          <TabScreen label="Local Only" icon="cellphone" >
            <View style={styles.tabContent}>
              <LocalAccountForm />
            </View>
          </TabScreen>
          <TabScreen label="Synced Account" icon="cloud-sync">
            <View style={styles.tabContent}>

              <SyncedAccountForm />
            </View>
          </TabScreen>
        </Tabs>
      </Surface>
    </TabsProvider>
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
