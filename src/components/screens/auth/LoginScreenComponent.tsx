import { pb } from "@/lib/pb/client";
import { Platform, StyleSheet } from "react-native";
import { Text, Surface, Button } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

export function LoginScreenComponent() {
  const loginWithGoogle = () => {
    if (Platform.OS === "web") {
      return pb.collection("users").authWithOAuth2({
        provider: "google",
      });
    }

    return pb
      .from("users")
      .authWithOAuth2({
        provider: "google",
        urlCallback(url: string) {
          console.log("urlCallback === >", url);
          WebBrowser.openAuthSessionAsync(url, Linking.createURL("/")).then((res) => {
            WebBrowser.dismissAuthSession();
          });
        },
      })
      .catch((err) => {
        console.log(" err ", err);
      });
  };
  return (
    <Surface style={{ ...styles.container }}>
      <Text variant="titleLarge">LoginScreenComponent</Text>
      <Button mode="contained" onPress={loginWithGoogle} style={{ marginTop: 20 }}>
        Login with Google
      </Button>
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
    gap: 20,
  },
});
