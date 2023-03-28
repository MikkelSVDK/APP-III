import { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { BarCodeScanner } from 'expo-barcode-scanner'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export default function Qr({ navigation }: NativeStackScreenProps<any>) {
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        return Alert.alert(
          'QR scanner',
          `Permission denied... `,
          [
            { text: 'Go back', onPress: () => navigation.navigate("Home") },
          ],
          { cancelable: false }
        )
      }
    })
  }, [])

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true)
    Alert.alert(
      'Scanner',
      `Bar code with type ${type} and data ${data} has been scanned!`,
      [
        { text: 'OK', onPress: () => setScanned(false) },
      ],
      { cancelable: false }
    )
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
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
