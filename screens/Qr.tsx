import { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics'

import { BarCodeScanner } from 'expo-barcode-scanner'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export default function Qr({ route, navigation }: NativeStackScreenProps<any>) {
  const [scanned, setScanned] = useState(false)

  if(route.params?.showHeader === false){
    navigation.setOptions({
      headerShown: false
    })
  }
  console.log(route.params)

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

    if(data == 'iXZaf&KH^6%9%a^Hq88b' && route.params?.currentLvl == 1){
      notificationAsync(NotificationFeedbackType.Success)
      Alert.alert(
        '1/3',
        `U found the first QR code, now find the next one :O`,
        [
          { text: 'take me there...', onPress: () => navigation.goBack() },
        ],
        { cancelable: false }
      )
    }else if(data == 'U957cW4Yor%zsHQ6#*pE' && route.params?.currentLvl == 2){
      notificationAsync(NotificationFeedbackType.Success)
      Alert.alert(
        '2/3',
        `U found the second QR code, now find the next one :O`,
        [
          { text: 'take me there...', onPress: () => navigation.goBack() },
        ],
        { cancelable: false }
      )
    }else if(data == '@k6o#YWXCaHZPerxfxD8' && route.params?.currentLvl == 3){
      notificationAsync(NotificationFeedbackType.Success)
      Alert.alert(
        '3/3',
        `U found the third QR code... Good job wasting time to find them all`,
        [
          { text: 'Leave', onPress: () => navigation.navigate("Home") },
        ],
        { cancelable: false }
      )
    }else if(route.params?.showHeader === false){
      notificationAsync(NotificationFeedbackType.Error)
      Alert.alert(
        ':(',
        `Wrong QR code.. go back to the first one again. No cheating`,
        [
          { text: 'Leave', onPress: () => navigation.replace("Geocache", { failed: true }) },
        ],
        { cancelable: false }
      )
    }else{
      notificationAsync(NotificationFeedbackType.Success)
      Alert.alert(
        'Scanner',
        `Bar code with type ${type} and data ${data} has been scanned!`,
        [
          { text: 'OK', onPress: () => setScanned(false) },
        ],
        { cancelable: false }
      )
    }
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
