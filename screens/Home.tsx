import { Button, StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { NativeStackScreenProps } from '@react-navigation/native-stack'

export default function Home({ navigation }: NativeStackScreenProps<any>) {
  return (
    <View style={styles.container}>
      <View style={{marginBottom: 10}}>
        <Button title="Go to Geocache" onPress={() => navigation.navigate('Geocache')} />
      </View>
      <View style={{marginBottom: 10}}>
        <Button title="Go to Camera" onPress={() => navigation.navigate('Camera')} />
      </View>
      <View style={{marginBottom: 10}}>
        <Button title="Go to Location" onPress={() => navigation.navigate('Location')} />
      </View>
      <View style={{marginBottom: 10}}>
        <Button title="Go to QR scanner" onPress={() => navigation.navigate('Qr')} />
      </View>
      <Button title="Go to Sensors" onPress={() => navigation.navigate('Sensors')} />
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
