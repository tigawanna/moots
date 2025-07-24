import { StyleSheet } from "react-native";
import { Surface, useTheme } from "react-native-paper";

import { LoginForm } from "./LoginForm";
import { OauthLogin } from "./OauthLogin";

export function LoginScreenComponent() {
  const { colors } = useTheme();

  return (
    <Surface style={styles.container}>
      <LoginForm />
      <OauthLogin />
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
