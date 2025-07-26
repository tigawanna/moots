import {
  deleteWatchListMutationOptions,
  updateWatchListMutationOptions,
} from "@/lib/tanstack/operations/watchlist/operations-options";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

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

export function UpdateWatchlist() {
  const updateMutation = useMutation(updateWatchListMutationOptions());
  return (
    <View style={{ ...styles.container }}>
      <Text variant="titleLarge">UpdateWatchlist</Text>
    </View>
  );
}

// required input is id

interface DeleteWatchlistProps {
  watchlistid: string;
}
export function DeleteWatchlist({ watchlistid }: DeleteWatchlistProps) {
  const deleteMutation = useMutation(deleteWatchListMutationOptions());
  return (
    <View style={{ ...styles.container }}>
      <IconButton
        icon={() => deleteMutation.isPending? <ActivityIndicator /> : <MaterialIcons name="delete" size={24} color="red" />}
        size={24}
        onPress={() => {
          deleteMutation.mutate(watchlistid);
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
