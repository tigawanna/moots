import { useSnackbar } from "@/components/react-native-paper/snackbar/global-snackbar-store";
import { getAccount } from "@/lib/appwrite/client";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { OAuthProvider } from "react-native-appwrite";
import { Button } from "react-native-paper";

export function GoogleOauth() {
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const account = getAccount();
      
      // Create deep link URL - use development URL for now
      const deepLink = __DEV__ 
        ? "exp://127.0.0.1:19000/--/"
        : "moots://";
      
      const successUrl = __DEV__ 
        ? "exp://127.0.0.1:19000/--/auth/callback"
        : "moots://auth/callback";
      
      const failureUrl = __DEV__ 
        ? "exp://127.0.0.1:19000/--/auth/error"
        : "moots://auth/error";
      
      // Create OAuth2 token URL
      const response = await account.createOAuth2Token(
        OAuthProvider.Google,
        successUrl,
        failureUrl
      );

      if (response) {
        // Open the OAuth URL in the browser
        const result = await WebBrowser.openAuthSessionAsync(
          response.toString(),
          deepLink
        );

        if (result.type === "success") {
          showSnackbar("Successfully signed in with Google");
        } else if (result.type === "cancel") {
          showSnackbar("Google sign-in was cancelled");
        }
      } else {
        showSnackbar("Failed to get Google OAuth URL");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for deep link callbacks
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      if (url.includes("/auth/callback")) {
        // OAuth success - the session should be created automatically
        showSnackbar("Google sign-in successful!");
      } else if (url.includes("/auth/error")) {
        // OAuth error
        showSnackbar("Google sign-in failed. Please try again.");
      }
    };

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, [showSnackbar]);

  return (
    <Button
      mode="outlined"
      onPress={handleGoogleSignIn}
      loading={isLoading}
      disabled={isLoading}
      style={styles.googleButton}
      contentStyle={styles.submitButtonContent}
      icon="google"
    >
      Continue with Google
    </Button>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    borderRadius: 28,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});
