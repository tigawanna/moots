import { useSnackbar } from "@/components/react-native-paper/snackbar/global-snackbar-store";
import { createPasswordRecoveryMutationOptions, googleSignInMutationOptions, signInMutationOptions } from "@/lib/tanstack/auth/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, HelperText, Surface, Text, TextInput, useTheme } from "react-native-paper";
import { z } from "zod";

const signInSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function Signin() {
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation(signInMutationOptions());
  const googleSignInMutation = useMutation(googleSignInMutationOptions());
  const passwordRecoveryMutation = useMutation(createPasswordRecoveryMutationOptions());

  const onSubmit = (data: SignInForm) => {
    signInMutation.mutate(data, {
      onSuccess: () => {
        showSnackbar("Welcome back!");
      },
      onError: (error: any) => {
        showSnackbar(error.message || "Failed to sign in. Please try again.");
      },
    });
  };

  const handleGoogleSignIn = () => {
    googleSignInMutation.mutate(
      {
        successUrl: "exp://127.0.0.1:19000/--/auth/callback",
        failureUrl: "exp://127.0.0.1:19000/--/auth/error",
      },
      {
        onSuccess: () => {
          showSnackbar("Signed in with Google successfully!");
        },
        onError: (error: any) => {
          showSnackbar(error.message || "Failed to sign in with Google.");
        },
      }
    );
  };

  const handleForgotPassword = () => {
    const email = getValues("email");
    if (!email) {
      showSnackbar("Please enter your email address first.");
      return;
    }

    passwordRecoveryMutation.mutate(
      {
        email,
        url: "exp://127.0.0.1:19000/--/auth/reset-password",
      },
      {
        onSuccess: () => {
          showSnackbar("Password reset link sent to your email!", { duration: 5000 });
        },
        onError: (error: any) => {
          showSnackbar(error.message || "Failed to send reset email.");
        },
      }
    );
  };

  return (
    <Surface style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
            Welcome Back
          </Text>
          
          <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Sign in to your account
          </Text>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Email"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textContentType="emailAddress"
                  />
                  {errors.email && (
                    <HelperText type="error" visible={!!errors.email}>
                      {errors.email.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Password"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.password}
                    secureTextEntry
                    textContentType="password"
                  />
                  {errors.password && (
                    <HelperText type="error" visible={!!errors.password}>
                      {errors.password.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

            <Button
              mode="text"
              onPress={handleForgotPassword}
              loading={passwordRecoveryMutation.isPending}
              disabled={passwordRecoveryMutation.isPending}
              style={styles.forgotPasswordButton}
              compact
            >
              Forgot Password?
            </Button>

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={signInMutation.isPending}
              disabled={signInMutation.isPending}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
            >
              Sign In
            </Button>

            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
              <Text variant="bodySmall" style={[styles.dividerText, { color: colors.onSurfaceVariant }]}>
                or
              </Text>
              <Divider style={styles.divider} />
            </View>

            <Button
              mode="outlined"
              onPress={handleGoogleSignIn}
              loading={googleSignInMutation.isPending}
              disabled={googleSignInMutation.isPending}
              style={styles.googleButton}
              contentStyle={styles.submitButtonContent}
              icon="google"
            >
              Continue with Google
            </Button>
          </View>

          <View style={styles.linkContainer}>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
              Don&apos;t have an account?{" "}
            </Text>
            <Link href="/signup" asChild>
              <Button mode="text" compact>
                Sign Up
              </Button>
            </Link>
          </View>
        </View>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  formContainer: {
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 8,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: -8,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 28,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  googleButton: {
    borderRadius: 28,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
});
