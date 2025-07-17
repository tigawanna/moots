import { CreateUserForm } from '@/components/screens/user';
import { StyleSheet } from 'react-native'
import { Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
 
export default function Signup(){
  const {top} = useSafeAreaInsets();
  return (
    <Surface style={{ ...styles.container, paddingTop: top }}>
      <CreateUserForm />
    </Surface>
  );
}
const styles = StyleSheet.create({
container:{
  flex:1,
  height:'100%',
   width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}
})
