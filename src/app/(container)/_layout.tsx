import { Stack } from 'expo-router';


// this grouped routes  (contaner) layout exists because tanstcak query provider is defined in the root layout making it hard to useQuery to check for logged i user in that layout 
export default function ContainerLayout(){
const isAuthenticated = true; // Replace with actual authentication logic    
return (
  <Stack>
    <Stack.Protected guard={isAuthenticated}>
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
    </Stack.Protected>
    <Stack.Screen name="login" options={{ headerShown: true }} />
  </Stack>
);
}
