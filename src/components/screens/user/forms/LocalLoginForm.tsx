import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput, useTheme } from "react-native-paper";
import { z } from "zod";

// Define schema for local account login
const localLoginSchema = z.object({
  username: z.string().min(1, "username is required"),
});

type LocalLoginFormData = z.infer<typeof localLoginSchema>;

interface LocalLoginFormProps {
  onSubmit?: (data: LocalLoginFormData) => void;
}

export function LocalLoginForm({ onSubmit }: LocalLoginFormProps) {
  const theme = useTheme();

  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LocalLoginFormData>({
    resolver: zodResolver(localLoginSchema),
    defaultValues: {
      username: "",
    }
  });

  const onFormSubmit = (data: LocalLoginFormData) => {
    console.log("Local login submitted:", data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Card style={styles.formCard} elevation={2}>
      <Card.Content style={styles.form}>
        <Text style={styles.localAccountInfo}>
          Access your local account by entering your username
        </Text>
        
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label="username"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.input}
                error={!!errors.username}
                mode="outlined"
                left={<TextInput.Icon icon="cellphone" />}
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username.message}</Text>
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
          Access Local Account
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
  localAccountInfo: {
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
