import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput, useTheme } from "react-native-paper";
import { useTabNavigation } from "react-native-paper-tabs";
import { z } from "zod";

// Define validation schema using zod
const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface RequestCodeFormProps {
  onSubmit?: (data: ResetPasswordFormData) => void;
}

export function RequestCodeForm({ onSubmit }: RequestCodeFormProps) {
  const theme = useTheme();
  const goTo = useTabNavigation();
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    }
  });

  const onFormSubmit = (data: ResetPasswordFormData) => {
    console.log("Reset password email submitted:", data);
    if (onSubmit) {
      onSubmit(data);
    }
    goTo(1); // Navigate to the next tab
  };

  return (
    <Card style={styles.formCard} elevation={2}>
      <Card.Content style={styles.form}>
        <Text style={styles.instructions}>
          Enter your email address and we&apos;ll send you a verification code to reset your password.
        </Text>
        
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

        <Button 
          mode="contained" 
          onPress={handleSubmit(onFormSubmit)}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Send Reset Code
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
});