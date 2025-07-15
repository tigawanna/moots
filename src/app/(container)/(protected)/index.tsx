import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Button, Surface,Text } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Button mode="contained">
        <Link href={"/login"}>Login</Link>
      </Button>
      <Button mode="contained">
        <Link href={"/settings"}>Settings</Link>
      </Button>

    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
