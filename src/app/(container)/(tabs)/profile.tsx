import { useSnackbar } from "@/components/react-native-paper/snackbar/global-snackbar-store";
import { LoadingIndicatorDots } from "@/components/screens/state-screens/LoadingIndicatorDots";
import { createEmailVerificationMutationOptions, signOutAllMutationOptions, signOutMutationOptions, viewerQueryOptions } from "@/lib/tanstack/auth/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Divider, Surface, Text, useTheme } from "react-native-paper";

export default function Profile() {
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();
  
  const { data: user, isLoading, error } = useQuery(viewerQueryOptions());
  const signOutMutation = useMutation(signOutMutationOptions());
  const signOutAllMutation = useMutation(signOutAllMutationOptions());
  const emailVerificationMutation = useMutation(createEmailVerificationMutationOptions());

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        showSnackbar("Signed out successfully");
      },
      onError: (error: any) => {
        showSnackbar(error.message || "Failed to sign out");
      },
    });
  };

  const handleSignOutAll = () => {
    signOutAllMutation.mutate(undefined, {
      onSuccess: () => {
        showSnackbar("Signed out from all devices");
      },
      onError: (error: any) => {
        showSnackbar(error.message || "Failed to sign out from all devices");
      },
    });
  };

  const handleSendVerificationEmail = () => {
    emailVerificationMutation.mutate(
      {
        url: "exp://127.0.0.1:19000/--/auth/verify-email",
      },
      {
        onSuccess: () => {
          showSnackbar("Verification email sent!", { duration: 5000 });
        },
        onError: (error: any) => {
          showSnackbar(error.message || "Failed to send verification email");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Surface style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <LoadingIndicatorDots />
          <Text variant="bodyMedium" style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>
            Loading profile...
          </Text>
        </View>
      </Surface>
    );
  }

  if (error || !user) {
    return (
      <Surface style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text variant="bodyMedium" style={{ color: colors.error }}>
            Failed to load profile
          </Text>
        </View>
      </Surface>
    );
  }

  return (
    <Surface style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={[styles.name, { color: colors.onBackground }]}>
            {user.name || "User"}
          </Text>
          <Text variant="bodyMedium" style={[styles.email, { color: colors.onSurfaceVariant }]}>
            {user.email}
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.onSurface }]}>
              Account Information
            </Text>
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={[styles.infoLabel, { color: colors.onSurfaceVariant }]}>
                Email Status:
              </Text>
              <View style={styles.statusContainer}>
                <Text variant="bodyMedium" style={[styles.infoValue, { color: user.emailVerification ? colors.primary : colors.error }]}>
                  {user.emailVerification ? "Verified" : "Not Verified"}
                </Text>
                {!user.emailVerification && (
                  <Button
                    mode="text"
                    onPress={handleSendVerificationEmail}
                    loading={emailVerificationMutation.isPending}
                    disabled={emailVerificationMutation.isPending}
                    compact
                    style={styles.verifyButton}
                  >
                    Verify
                  </Button>
                )}
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={[styles.infoLabel, { color: colors.onSurfaceVariant }]}>
                Account Created:
              </Text>
              <Text variant="bodyMedium" style={[styles.infoValue, { color: colors.onSurface }]}>
                {new Date(user.$createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={[styles.infoLabel, { color: colors.onSurfaceVariant }]}>
                Last Updated:
              </Text>
              <Text variant="bodyMedium" style={[styles.infoValue, { color: colors.onSurface }]}>
                {new Date(user.$updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.onSurface }]}>
              Account Actions
            </Text>
            
            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={handleSignOut}
                loading={signOutMutation.isPending}
                disabled={signOutMutation.isPending}
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
              >
                Sign Out
              </Button>

              <Button
                mode="outlined"
                onPress={handleSignOutAll}
                loading={signOutAllMutation.isPending}
                disabled={signOutAllMutation.isPending}
                style={[styles.actionButton, { borderColor: colors.error }]}
                contentStyle={styles.actionButtonContent}
                textColor={colors.error}
              >
                Sign Out All Devices
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  verifyButton: {
    marginLeft: 8,
  },
  divider: {
    marginVertical: 12,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 28,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
});
