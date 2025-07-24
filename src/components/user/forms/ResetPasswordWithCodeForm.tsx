import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { useTabNavigation } from "react-native-paper-tabs";
import { z } from "zod";

const newPasswordSchema = z.object({
  code: z.string().min(1, "Verification code is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

interface ResetPasswordWithCodeFormProps {
  onSubmit?: (data: NewPasswordFormData) => void;
}

export function ResetPasswordWithCodeForm({ onSubmit }: ResetPasswordWithCodeFormProps) {
  const goTo = useTabNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    }
  });

  const onFormSubmit = (data: NewPasswordFormData) => {
    console.log("New password submitted:", data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Card style={styles.formCard} elevation={2}>
      <Card.Content style={styles.form}>
        <Text style={styles.instructions}>
          Enter the verification code sent to your email and create a new password.
        </Text>
        
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label="Verification Code"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.input}
                error={!!errors.code}
                mode="outlined"
                left={<TextInput.Icon icon="key" />}
              />
              {errors.code && (
                <Text style={styles.errorText}>{errors.code.message}</Text>
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
                label="New Password"
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

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label="Confirm New Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.input}
                error={!!errors.confirmPassword}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? "eye-off" : "eye"}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
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
          Reset Password
        </Button>
        
        <Button 
          mode="text" 
          onPress={() => goTo(0)} 
          style={styles.textButton}
        >
          Back to Email Form
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
  instructions: {
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
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
