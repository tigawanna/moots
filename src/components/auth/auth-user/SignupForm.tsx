import { signupMutationOption } from "@/lib/tanstack/operations/user";
import { useMutation } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { OauthLogin } from "./OauthLogin";

export function SignupForm() {
  const mutation = useMutation(signupMutationOption());
  return (
    <View style={{ ...styles.container }}>
      <Text variant="titleLarge">SignupForm</Text>
      <SignupForm />
      <OauthLogin />
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
