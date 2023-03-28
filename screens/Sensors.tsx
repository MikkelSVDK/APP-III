import {  Button, StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { NativeStackScreenProps } from '@react-navigation/native-stack';

export default function Sensors({ navigation }: NativeStackScreenProps<any>) {
  return (
    <View style={styles.container}>
      <View style={{marginBottom: 10}}>
        <Button title="Accelerometer" onPress={() => navigation.navigate('Accelerometer')} />
      </View>
      <View style={{marginBottom: 10}}>
        <Button title="Barometer" onPress={() => navigation.navigate('Barometer')} />
      </View>
      <View style={{marginBottom: 10}}>
        <Button title="Gyroscope" onPress={() => navigation.navigate('Gyroscope')} />
      </View>
      <View style={{marginBottom: 10}}>
        <Button title="LightSensor" onPress={() => navigation.navigate('LightSensor')} />
      </View>
      <View style={{marginBottom: 10}}>
        <Button title="Haptics" onPress={() => navigation.navigate('Haptics')} />
      </View>
      <Button title="Magnetometer" onPress={() => navigation.navigate('Magnetometer')} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
