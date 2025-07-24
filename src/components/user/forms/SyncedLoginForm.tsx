import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput, useTheme } from "react-native-paper";
import { z } from "zod";

// Define validation schema using zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface SyncedLoginFormProps {
  onSubmit?: (data: LoginFormData) => void;
  onForgotPassword?: () => void;
}

export function SyncedLoginForm({ onSubmit, onForgotPassword }: SyncedLoginFormProps) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onFormSubmit = (data: LoginFormData) => {
    console.log("Synced login submitted:", data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Card style={styles.formCard} elevation={2}>
      <Card.Content style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
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
                left={<TextInput.Icon icon="email" />}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
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
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.input}
                error={!!errors.password}
                mode="outlined"
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>
          )}
        />

        <Button 
          mode="contained" 
          onPress={handleSubmit(onFormSubmit)} 
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Login
        </Button>
        
        <Button 
          mode="text" 
          onPress={onForgotPassword} 
          style={styles.textButton}
        >
          Forgot Password?
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  formCard: {
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "transparent",
  },
  errorText: {
    marginTop: 4,
    marginLeft: 16,
    fontSize: 12,
    color: "#d32f2f",
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 3,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  textButton: {
    marginTop: 16,
  },
});