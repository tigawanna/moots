import { createWatchListMutationOptions } from "@/lib/tanstack/operations/watchlist/operations-options";
import { useMutation } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

// this type comes from @/lib/pb/types/pb-types.ts do not overwrite or make a copy of it use it for refrence of the inputs required buy the mutation below
// export interface WatchlistCreate extends BaseCollectionCreate {
//   title?: string;
//   overview?: string;
//   user_id: MaybeArray<string>;
//   iiitems?: MaybeArray<string>;
//   visibility?: MaybeArray<'public' | 'private' | 'followers_only'>;
//   is_collaborative?: boolean;
// }

export function CreateWatchlist() {
  const createMutation = useMutation(createWatchListMutationOptions());
  return (
    <View style={{ ...styles.container }}>
      <Text variant="titleLarge">CreateWatchlist</Text>
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
