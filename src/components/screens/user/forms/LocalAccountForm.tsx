import { events } from "@/lib/livestore/simple-schema";
import { useLocalUserStore } from "@/store/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "@livestore/livestore";
import { useStore } from "@livestore/react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { z } from "zod";

// Define schema for local account
const localAccountSchema = z.object({
  username: z.string().min(1, "username is required"),
});

type LocalAccountFormData = z.infer<typeof localAccountSchema>;

interface LocalAccountFormProps {
  onSubmit?: (data: LocalAccountFormData) => void;
}

export function LocalAccountForm({ onSubmit }: LocalAccountFormProps) {
  const { store } = useStore();
  const { setUser } = useLocalUserStore();
  const {
    control,
    handleSubmit,
    formState: { errors,isSubmitting },
  } = useForm<LocalAccountFormData>({
    resolver: zodResolver(localAccountSchema),
    defaultValues: {
      username: "",
    },
  });

  const onFormSubmit = (data: LocalAccountFormData) => {
    console.log("Local account form submitted:", data);
    if (onSubmit) {
      onSubmit(data);
    }
    const userId = `local-${nanoid()}`;
    store.commit(
      events.userCreated({
        id: userId,
        username: data.username,
      })
    )
    setUser({
      id: userId,
      username: data.username,
    });

    // Handle local account creation
  };

  return (
    <Card style={styles.formCard} elevation={2}>
      <Card.Content style={styles.form}>
        <Text style={styles.localAccountInfo}>
          A local account stores your data only on this device and doesn&apos;t require an email or
          password.
        </Text>

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label="Your username"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.input}
                error={!!errors.username}
                mode="outlined"
                left={<TextInput.Icon icon="account" />}
              />
              {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
            </View>
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onFormSubmit)}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}>
          {isSubmitting ? "Creating Local Account..." : "Create Local Account"}
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
    marginTop: 32,
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
