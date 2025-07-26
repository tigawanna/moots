import { WatchlistResponse, WatchlistUpdate } from "@/lib/pb/types/pb-types";
import {
  deleteWatchListMutationOptions,
  updateWatchListMutationOptions,
} from "@/lib/tanstack/operations/watchlist/operations-options";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  HelperText,
  IconButton,
  SegmentedButtons,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { z } from "zod";

// this type comes from @/lib/pb/types/pb-types.ts do not overwrite or make a copy of it use it for refrence of the inputs required buy the mutation below
// export interface WatchlistUpdate extends BaseCollectionUpdate {
//   id: string;
//   title?: string;
//   overview?: string;
//   user_id: MaybeArray<string>;
//   'user_id+'?: MaybeArray<string>;
//   'user_id-'?: MaybeArray<string>;
//   iiitems?: MaybeArray<string>;
//   'iiitems+'?: MaybeArray<string>;
//   'iiitems-'?: MaybeArray<string>;
//   visibility?: MaybeArray<'public' | 'private' | 'followers_only'>;
//   'visibility+'?: MaybeArray<'public' | 'private' | 'followers_only'>;
//   'visibility-'?: MaybeArray<'public' | 'private' | 'followers_only'>;
//   is_collaborative?: boolean;
// }

const updateWatchlistSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  overview: z.string().max(500, "Description too long").optional(),
  visibility: z.enum(["public", "private", "followers_only"]),
  is_collaborative: z.boolean(),
});

type UpdateWatchlistForm = z.infer<typeof updateWatchlistSchema>;

interface UpdateWatchlistProps {
  watchlist: WatchlistResponse;
  onSuccess?: () => void;
}

export function UpdateWatchlist({
  watchlist,
  onSuccess,
}: UpdateWatchlistProps) {
  const { colors } = useTheme();

  const getVisibilityValue = (
    visibility: ("public" | "private" | "followers_only")[] | undefined
  ): "public" | "private" | "followers_only" => {
    const value = visibility?.[0];
    if (
      value === "public" ||
      value === "private" ||
      value === "followers_only"
    ) {
      return value;
    }
    return "public";
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<UpdateWatchlistForm>({
    resolver: zodResolver(updateWatchlistSchema),
    defaultValues: {
      title: watchlist.title || "",
      overview: watchlist.overview || "",
      visibility: getVisibilityValue(watchlist.visibility),
      is_collaborative: watchlist.is_collaborative || false,
    },
  });

  const updateMutation = useMutation({
    ...updateWatchListMutationOptions(),
    onSuccess: () => {
      onSuccess?.();
    },
  });

  // Reset form when watchlist changes
  useEffect(() => {
    reset({
      title: watchlist.title || "",
      overview: watchlist.overview || "",
      visibility: getVisibilityValue(watchlist.visibility),
      is_collaborative: watchlist.is_collaborative || false,
    });
  }, [watchlist, reset]);

  const onSubmit = (data: UpdateWatchlistForm) => {
    const payload: WatchlistUpdate = {
      id: watchlist.id,
      title: data.title,
      overview: data.overview || "",
      visibility: [data.visibility],
      is_collaborative: data.is_collaborative,
      user_id: watchlist.user_id, // Keep existing user_id
    };
    updateMutation.mutate(payload);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text
            variant="headlineSmall"
            style={[styles.title, { color: colors.onSurface }]}
          >
            Update Watchlist
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
                  disabled={updateMutation.isPending}
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
                  disabled={updateMutation.isPending}
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
                  disabled={updateMutation.isPending}
                />
              )}
            />
          </View>

          {updateMutation.isError && (
            <HelperText type="error" visible>
              {updateMutation.error?.message || "Failed to update watchlist"}
            </HelperText>
          )}

          {updateMutation.isSuccess && (
            <HelperText type="info" visible>
              Watchlist updated successfully!
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={updateMutation.isPending}
            disabled={!isValid || !isDirty || updateMutation.isPending}
            style={styles.submitButton}
          >
            Update Watchlist
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

// required input is id

interface DeleteWatchlistProps {
  watchlistid: string;
  watchlistTitle?: string;
  onSuccess?: () => void;
  variant?: "icon" | "button";
}

export function DeleteWatchlist({
  watchlistid,
  watchlistTitle,
  onSuccess,
  variant = "icon",
}: DeleteWatchlistProps) {
  const { colors } = useTheme();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const deleteMutation = useMutation({
    ...deleteWatchListMutationOptions(),
    onSuccess: () => {
      setShowConfirmation(false);
      onSuccess?.();
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(watchlistid);
  };

  if (variant === "icon") {
    return (
      <View>
        <IconButton
          icon={() =>
            deleteMutation.isPending ? (
              <ActivityIndicator size={20} color={colors.error} />
            ) : (
              <MaterialIcons name="delete" size={24} color={colors.error} />
            )
          }
          size={24}
          onPress={() => setShowConfirmation(true)}
          disabled={deleteMutation.isPending}
        />

        {showConfirmation && (
          <Card
            style={[
              styles.confirmationCard,
              { backgroundColor: colors.errorContainer },
            ]}
          >
            <Card.Content>
              <Text
                variant="titleMedium"
                style={{ color: colors.onErrorContainer, marginBottom: 8 }}
              >
                Delete Watchlist?
              </Text>
              {watchlistTitle && (
                <Text
                  variant="bodyMedium"
                  style={{ color: colors.onErrorContainer, marginBottom: 16 }}
                >
                  &quot;{watchlistTitle}&quot; will be permanently deleted.
                </Text>
              )}

              {deleteMutation.isError && (
                <HelperText type="error" visible style={{ marginBottom: 8 }}>
                  {deleteMutation.error?.message ||
                    "Failed to delete watchlist"}
                </HelperText>
              )}

              <View style={styles.confirmationButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setShowConfirmation(false)}
                  disabled={deleteMutation.isPending}
                  style={{ marginRight: 8 }}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleDelete}
                  loading={deleteMutation.isPending}
                  disabled={deleteMutation.isPending}
                  buttonColor={colors.error}
                  textColor={colors.onError}
                >
                  Delete
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
      </View>
    );
  }

  return (
    <View>
      <Button
        mode="outlined"
        onPress={() => setShowConfirmation(true)}
        disabled={deleteMutation.isPending}
        icon={() =>
          deleteMutation.isPending ? (
            <ActivityIndicator size={16} color={colors.error} />
          ) : (
            <MaterialIcons name="delete" size={16} color={colors.error} />
          )
        }
        textColor={colors.error}
        style={[styles.deleteButton, { borderColor: colors.error }]}
      >
        Delete Watchlist
      </Button>

      {showConfirmation && (
        <Card
          style={[
            styles.confirmationCard,
            { backgroundColor: colors.errorContainer },
          ]}
        >
          <Card.Content>
            <Text
              variant="titleMedium"
              style={{ color: colors.onErrorContainer, marginBottom: 8 }}
            >
              Delete Watchlist?
            </Text>
            {watchlistTitle && (
              <Text
                variant="bodyMedium"
                style={{ color: colors.onErrorContainer, marginBottom: 16 }}
              >
                &quot;{watchlistTitle}&quot; will be permanently deleted. This
                action cannot be undone.
              </Text>
            )}

            {deleteMutation.isError && (
              <HelperText type="error" visible style={{ marginBottom: 8 }}>
                {deleteMutation.error?.message || "Failed to delete watchlist"}
              </HelperText>
            )}

            <View style={styles.confirmationButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowConfirmation(false)}
                disabled={deleteMutation.isPending}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleDelete}
                loading={deleteMutation.isPending}
                disabled={deleteMutation.isPending}
                buttonColor={colors.error}
                textColor={colors.onError}
              >
                Delete
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}
    </View>
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
  deleteButton: {
    marginTop: 8,
  },
  confirmationCard: {
    marginTop: 16,
    elevation: 4,
  },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
});
