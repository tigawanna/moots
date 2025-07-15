import { LandscapeSvg } from '@/components/shared/svg/LandscapeSvg';
import { Link, Stack } from 'expo-router';
import { StyleSheet,View } from 'react-native';
import { Surface,Text, useTheme } from 'react-native-paper';



export default function NotFoundScreen() {
  const { colors } = useTheme();
  return (
    <Surface style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <LandscapeSvg/>
      <View style={styles.container}>
        <Text >This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          <Text >Go to home screen!</Text>
        </Link>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
