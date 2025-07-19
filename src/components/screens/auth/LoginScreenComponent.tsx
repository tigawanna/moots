import { pb } from "@/lib/pb/client";
import { Platform, StyleSheet } from "react-native";
import { Text, Surface, Button } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useMutation } from "@tanstack/react-query";

export function LoginScreenComponent() {
  const loginWithGoogle = () => {
    if (Platform.OS === "web") {
      return pb.collection("users").authWithOAuth2({
        provider: "google",
      });
    }

    return pb.from("users").authWithOAuth2({
      provider: "google",
      urlCallback(url: string) {
        WebBrowser.openAuthSessionAsync(url, Linking.createURL("/")).then((res) => {
          if (Platform.OS === "ios" || Platform.OS === "web") {
            WebBrowser.dismissAuthSession();
          }
        });
      },
    });
  };
  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return loginWithGoogle();
    },
    onSuccess: (data) => {
      console.log("Login successful", data);
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
    meta: {
      invalidates: [["viewer"]],
    },
  });
  return (
    <Surface style={{ ...styles.container }}>
      <Text variant="titleLarge">LoginScreenComponent</Text>
      <Button mode="contained" onPress={() => mutate()} style={{ marginTop: 20 }}>
        {isPending ? "Logging in with Google..." : "Login with Google"}
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
