import { CreateUserForm } from '@/components/screens/user';
import { StyleSheet } from 'react-native'
import { Surface } from 'react-native-paper';
 
export function signup(){
return (
<Surface style={{ ...styles.container }}>
  <CreateUserForm/>
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
