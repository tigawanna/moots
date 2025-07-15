import { useSnackbar } from "@/components/react-native-paper/snackbar/global-snackbar-store";
import { updatePasswordRecoveryMutationOptions } from "@/lib/tanstack/auth/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Surface, Text, TextInput, useTheme } from "react-native-paper";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { userId, secret } = useLocalSearchParams<{ userId: string; secret: string }>();
  const [isValidToken, setIsValidToken] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation(updatePasswordRecoveryMutationOptions());

  useEffect(() => {
    if (userId && secret) {
      setIsValidToken(true);
    } else {
      showSnackbar("Invalid password reset link");
      router.replace("/signin");
    }
  }, [userId, secret, router, showSnackbar]);

  const onSubmit = (data: ResetPasswordForm) => {
    if (!userId || !secret) {
      showSnackbar("Invalid password reset link");
      return;
    }

    resetPasswordMutation.mutate(
      {
        userId,
        secret,
        password: data.password,
      },
      {
        onSuccess: () => {
          showSnackbar("Password reset successfully! You can now sign in with your new password.", {
            duration: 5000,
          });
          router.replace("/signin");
        },
        onError: (error: any) => {
          showSnackbar(error.message || "Failed to reset password. Please try again.");
        },
      }
    );
  };

  if (!isValidToken) {
    return (
      <Surface style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text variant="bodyMedium" style={{ color: colors.error }}>
            Invalid password reset link
          </Text>
        </View>
      </Surface>
    );
  }

  return (
    <Surface style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
          Reset Password
        </Text>
        
        <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
          Enter your new password
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="New Password"
                  mode="outlined"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={!!errors.password}
                  secureTextEntry
                  textContentType="newPassword"
                />
                {errors.password && (
                  <HelperText type="error" visible={!!errors.password}>
                    {errors.password.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Confirm New Password"
                  mode="outlined"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={!!errors.confirmPassword}
                  secureTextEntry
                  textContentType="newPassword"
                />
                {errors.confirmPassword && (
                  <HelperText type="error" visible={!!errors.confirmPassword}>
                    {errors.confirmPassword.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={resetPasswordMutation.isPending}
            disabled={resetPasswordMutation.isPending}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            Reset Password
          </Button>
        </View>
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
  submitButton: {
    marginTop: 16,
    borderRadius: 28,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
