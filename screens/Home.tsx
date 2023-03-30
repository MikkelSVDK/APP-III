import { Button, StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { selectionAsync } from 'expo-haptics'

import { NativeStackScreenProps } from '@react-navigation/native-stack'

export default function Home({ navigation }: NativeStackScreenProps<any>) {
  return (
    <View style={styles.container}>
      <View style={{marginBottom: 10}}>
        <Button title="Go to Geocache" onPress={() => {selectionAsync(); navigation.navigate('Geocache')}} />
      </View>
      <View style={{marginBottom: 10}}>
        <Button title="Go to Camera" onPress={() => {selectionAsync(); navigation.navigate('Camera')}} />
      </View>
      <View style={{marginBottom: 10}}>
        <Button title="Go to Location" onPress={() => {selectionAsync(); navigation.navigate('Location')}} />
      </View>
      <View style={{marginBottom: 10}}>
        <Button title="Go to QR scanner" onPress={() => {selectionAsync(); navigation.navigate('Qr')}} />
      </View>
      <Button title="Go to Sensors" onPress={() => {selectionAsync(); navigation.navigate('Sensors')}} />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

})
