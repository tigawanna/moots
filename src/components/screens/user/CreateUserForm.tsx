import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { TabScreen, Tabs, TabsProvider } from "react-native-paper-tabs";
import { LocalAccountForm, SyncedAccountForm } from "./forms";

export function CreateUserForm() {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Choose the type of account you want to create
          </Text>
        </View>

        <TabsProvider defaultIndex={0}>
          <Tabs mode="fixed" showLeadingSpace={true}>
            <TabScreen label="Synced Account" icon="cloud-sync">
              <View style={styles.tabContent}>
                <Text variant="bodyMedium" style={styles.tabDescription}>
                  A synced account allows you to access your data across devices and join the larger community
                </Text>
                <SyncedAccountForm />
              </View>
            </TabScreen>
            <TabScreen label="Local Only" icon="cellphone">
              <View style={styles.tabContent}>
                <Text variant="bodyMedium" style={styles.tabDescription}>
                  A local account stores your data only on this device
                </Text>
                <LocalAccountForm />
              </View>
            </TabScreen>
          </Tabs>
        </TabsProvider>
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