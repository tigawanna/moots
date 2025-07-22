import { pb } from "@/lib/pb/client";
import { getClientId } from "@/lib/pb/extra-api";
import { queryKeyPrefixes } from "@/lib/tanstack/client";
import { viewerQueryOptions } from "@/lib/tanstack/operations/user";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet } from "react-native";
import { Text, Surface, Button } from "react-native-paper";

export function HomeScreenComponent() {
  // const [state, setState] = useState();
  // useEffect(() => {
  //   getClientId()
  //     .then((clientId) => {
  //       console.log("Client ID:", clientId);
  //       setState(clientId);
  //     })
  //     .catch((error) => {
  //       console.log("Error fetching client ID:", error);
  //     });
  // }, []);
  const {
    data: clientIdData,
    error,
    refetch,
  } = useQuery({
    queryKey: [queryKeyPrefixes.watchlist],
    queryFn: () => pb.from("watchlists").getFullList(),
    // staleTime: 1000 * 60 * 60, // 1 hour
  });
  const { data, isPending } = useQuery(viewerQueryOptions());
  console.log("full watchlists: == >", clientIdData);
  console.log(" error from full watchlists:", error);
  return (
    <Surface style={{ ...styles.container }}>
      <Text variant="titleLarge">HomeScreenComponent</Text>
      <Text variant="bodyLarge">{data?.email}</Text>
      <Button onPress={() => refetch()}>Refetch Client ID</Button>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
