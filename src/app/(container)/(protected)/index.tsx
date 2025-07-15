import { StyleSheet } from 'react-native';
import { Surface,Text } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>Home</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
