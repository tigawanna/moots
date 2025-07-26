import { WatchlistCreate } from "@/lib/pb/types/pb-types";
import { createWatchListMutationOptions } from "@/lib/tanstack/operations/watchlist/operations-options";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  HelperText,
  SegmentedButtons,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { z } from "zod";

// this type comes from @/lib/pb/types/pb-types.ts do not overwrite or make a copy of it use it for refrence of the inputs required buy the mutation below
// export interface WatchlistCreate extends BaseCollectionCreate {
//   title?: string;
//   overview?: string;
//   user_id: MaybeArray<string>;
//   iiitems?: MaybeArray<string>;
//   visibility?: MaybeArray<'public' | 'private' | 'followers_only'>;
//   is_collaborative?: boolean;
// }

const createWatchlistSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  overview: z.string().max(500, "Description too long").optional(),
  visibility: z.enum(["public", "private", "followers_only"]),
  is_collaborative: z.boolean(),
});

type CreateWatchlistForm = z.infer<typeof createWatchlistSchema>;

interface CreateWatchlistProps {
  userId: string;
  onSuccess?: () => void;
}

export function CreateWatchlist({ userId, onSuccess }: CreateWatchlistProps) {
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateWatchlistForm>({
    resolver: zodResolver(createWatchlistSchema),
    defaultValues: {
      title: "",
      overview: "",
      visibility: "public",
      is_collaborative: false,
    },
  });

  const createMutation = useMutation({
    ...createWatchListMutationOptions(),
    onSuccess: () => {
      reset();
      onSuccess?.();
    },
  });

  const onSubmit = (data: CreateWatchlistForm) => {
    const payload: WatchlistCreate = {
      title: data.title,
      overview: data.overview || "",
      user_id: userId,
      visibility: [data.visibility],
      is_collaborative: data.is_collaborative,
    };
    createMutation.mutate(payload);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text
            variant="headlineSmall"
            style={[styles.title, { color: colors.onSurface }]}
          >
            Create New Watchlist
          </Text>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Title *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  error={!!errors.title}
                  disabled={createMutation.isPending}
                />
              )}
            />
            <HelperText type="error" visible={!!errors.title}>
              {errors.title?.message}
            </HelperText>
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="overview"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Description"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  error={!!errors.overview}
                  disabled={createMutation.isPending}
                />
              )}
            />
            <HelperText type="error" visible={!!errors.overview}>
              {errors.overview?.message}
            </HelperText>
          </View>

          <View style={styles.inputContainer}>
            <Text
              variant="labelLarge"
              style={{ color: colors.onSurface, marginBottom: 8 }}
            >
              Visibility
            </Text>
            <Controller
              control={control}
              name="visibility"
              render={({ field: { onChange, value } }) => (
                <SegmentedButtons
                  value={value}
                  onValueChange={onChange}
                  buttons={[
                    { value: "public", label: "Public" },
                    { value: "followers_only", label: "Followers" },
                    { value: "private", label: "Private" },
                  ]}
                />
              )}
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchContent}>
              <Text variant="bodyLarge" style={{ color: colors.onSurface }}>
                Collaborative
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                Allow others to add items to this watchlist
              </Text>
            </View>
            <Controller
              control={control}
              name="is_collaborative"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  disabled={createMutation.isPending}
                />
              )}
            />
          </View>

          {createMutation.isError && (
            <HelperText type="error" visible>
              {createMutation.error?.message || "Failed to create watchlist"}
            </HelperText>
          )}

          {createMutation.isSuccess && (
            <HelperText type="info" visible>
              Watchlist created successfully!
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={createMutation.isPending}
            disabled={!isValid || createMutation.isPending}
            style={styles.submitButton}
          >
            Create Watchlist
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    elevation: 2,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingVertical: 8,
  },
  switchContent: {
    flex: 1,
    marginRight: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});
