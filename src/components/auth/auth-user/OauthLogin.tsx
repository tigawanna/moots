import { AppLogoSvg } from "@/components/shared/svg/AppLogoSvg";
import { GoogleSvg } from "@/components/shared/svg/GoogleSvg";
import { pb } from "@/lib/pb/client";
import { viewerQueryOptions } from "@/lib/tanstack/operations/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { LoadingIndicatorDots } from "../../state-screens/LoadingIndicatorDots";

export function OauthLogin() {
  const { colors } = useTheme();
  const { data, isPending: isCurrentUserPending } = useQuery(viewerQueryOptions());

 // const watchedEmail = watch("email");

  const loginWithGoogle = () => {
    if (Platform.OS === "web") {
      return pb.collection("users").authWithOAuth2({
        provider: "google",
      });
    }
    return pb.collection("users").authWithOAuth2({
      provider: "google",
      urlCallback(url: string) {
        WebBrowser.openAuthSessionAsync(url, Linking.createURL("/")).then((res) => {
          if (Platform.OS === "ios") {
            WebBrowser.dismissAuthSession();
          }
        });
      },
    });
  };
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: () => {
      return loginWithGoogle();
    },
    onSuccess: (data) => {

    },
    onError: (error) => {
      console.log("Login failed", error.message);
    },
    meta: {
      invalidates: [["viewer"]],
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text variant="displaySmall" style={[styles.title, { color: colors.onSurface }]}>
            Welcome to Moots
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Your movie social network
          </Text>
          <AppLogoSvg />
        </View>

        {/* Login Card */}

        <Card style={styles.loginCard}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleLarge" style={[styles.cardTitle, { color: colors.onSurface }]}>
              Connect with Trakt
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.cardSubtitle, { color: colors.onSurfaceVariant }]}>
              Sync your watchlists and discover new movies and shows with your friends.
            </Text>

            <Pressable
              onPress={() => mutate()}
              disabled={isPending}
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor: pressed ? colors.primaryContainer : colors.surface,
                  borderColor: colors.primary,
                  opacity: isPending ? 0.4 : 1,
                },
              ]}>
              {isPending ? (
                <View style={{}}>
                  <LoadingIndicatorDots />
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}>
                  {/* <TraktSvg width={24} height={24} /> */}
                  <GoogleSvg width={24} height={24} />
                  <Text
                    variant="titleMedium"
                    style={[styles.buttonText, { color: colors.primary }]}>
                    Continue with Trakt
                  </Text>
                </View>
              )}
            </Pressable>
          </Card.Content>
        </Card>
        <View style={styles.footer}>
          <Text variant="bodySmall" style={[styles.footerText, { color: colors.onSurfaceVariant }]}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>

      {!data && isCurrentUserPending && isSuccess && (
        <View style={styles.globalLoading}>
          <LoadingIndicatorDots />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    paddingTop: 60,
    gap: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
  },
  loginCard: {
    maxWidth: 400,
    borderRadius: 20,
    overflow: "hidden",
  },
  cardContent: {
    padding: 32,
  },
  cardTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  cardSubtitle: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    marginBottom: 24,
    elevation: 4,
  },
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
  },

  footer: {
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    lineHeight: 18,
    opacity: 0.7,
  },
  globalLoading: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
