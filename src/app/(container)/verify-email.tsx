import { useSnackbar } from "@/components/react-native-paper/snackbar/global-snackbar-store";
import { verifyEmailMutationOptions } from "@/lib/tanstack/auth/auth";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Surface, Text, useTheme } from "react-native-paper";

export default function VerifyEmail() {
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { userId, secret } = useLocalSearchParams<{ userId: string; secret: string }>();
  const [isValidToken, setIsValidToken] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const verifyEmailMutation = useMutation(verifyEmailMutationOptions());

  useEffect(() => {
    if (userId && secret) {
      setIsValidToken(true);
      // Auto-verify email when the component mounts
      verifyEmailMutation.mutate(
        {
          userId,
          secret,
        },
        {
          onSuccess: () => {
            setIsVerified(true);
            showSnackbar("Email verified successfully!", { duration: 5000 });
          },
          onError: (error: any) => {
            showSnackbar(error.message || "Failed to verify email. The link may be expired.");
          },
        }
      );
    } else {
      showSnackbar("Invalid email verification link");
      router.replace("/signin");
    }
  }, [userId, secret, router, showSnackbar, verifyEmailMutation]);

  const handleContinue = () => {
    router.replace("/");
  };

  if (!isValidToken) {
    return (
      <Surface style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Text variant="bodyMedium" style={{ color: colors.error }}>
            Invalid email verification link
          </Text>
        </View>
      </Surface>
    );
  }

  return (
    <Surface style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.centerContainer}>
        <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
          Email Verification
        </Text>
        
        {verifyEmailMutation.isPending && (
          <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Verifying your email...
          </Text>
        )}

        {isVerified && (
          <>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.primary }]}>
              Your email has been verified successfully!
            </Text>
            
            <Button
              mode="contained"
              onPress={handleContinue}
              style={styles.continueButton}
              contentStyle={styles.continueButtonContent}
            >
              Continue to App
            </Button>
          </>
        )}

        {verifyEmailMutation.isError && (
          <>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.error }]}>
              Failed to verify email. The link may be expired or invalid.
            </Text>
            
            <Button
              mode="outlined"
              onPress={() => router.replace("/signin")}
              style={styles.continueButton}
              contentStyle={styles.continueButtonContent}
            >
              Back to Sign In
            </Button>
          </>
        )}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  centerContainer: {
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
  },
  continueButton: {
    borderRadius: 28,
  },
  continueButtonContent: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
});
