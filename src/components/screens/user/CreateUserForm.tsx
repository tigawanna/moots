import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Surface, Text, TextInput, useTheme } from "react-native-paper";
import { z } from "zod";

// Define validation schema using zod
const createUserSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type CreateUserFormData = z.infer<typeof createUserSchema>;

export function CreateUserForm() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: CreateUserFormData) => {
    // Here you would handle the form submission, e.g., dispatch an event
    console.log("Form submitted:", data);
    // Example: dispatch userEvents.userRegistered event
  };

  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Create Account
      </Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Username"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              error={!!errors.username}
              mode="outlined"
            />
          )}
        />
        {errors.username && (
          <Text style={{ color: theme.colors.error }}>
            {errors.username.message}
          </Text>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              error={!!errors.email}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text style={{ color: theme.colors.error }}>
            {errors.email.message}
          </Text>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              error={!!errors.password}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
          )}
        />
        {errors.password && (
          <Text style={{ color: theme.colors.error }}>
            {errors.password.message}
          </Text>
        )}

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Confirm Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              error={!!errors.confirmPassword}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={{ color: theme.colors.error }}>
            {errors.confirmPassword.message}
          </Text>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
        >
          Create Account
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
  },
});
