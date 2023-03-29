import { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { unlockAsync } from 'expo-screen-orientation'
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from './screens/Home'
import Qr from './screens/Qr'
import Location from './screens/Location'
import Sensors from './screens/Sensors'
import AccelerometerScreen from './screens/Sensors/Accelerometer'
import BarometerScreen from './screens/Sensors/Barometer'
import GyroscopeScreen from './screens/Sensors/Gyroscope'
import LightSensorScreen from './screens/Sensors/LightSensor'
import MagnetometerScreen from './screens/Sensors/Magnetometer'
import HapticsScreen from './screens/Sensors/Haptics'
import CameraScreen from './screens/Camera'
import Geocache from './screens/Geocache'

preventAutoHideAsync()

const Stack = createNativeStackNavigator()

export default function App() {
  unlockAsync()
  hideAsync()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        {/*<Stack.Screen name="Geocache" component={Geocache} />*/}
        <Stack.Screen name="Qr" component={Qr} />
        <Stack.Screen name="Location" component={Location} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Sensors" component={Sensors} />
        
        <Stack.Screen name="Accelerometer" component={AccelerometerScreen} />
        <Stack.Screen name="Barometer" component={BarometerScreen} />
        <Stack.Screen name="Gyroscope" component={GyroscopeScreen} />
        <Stack.Screen name="LightSensor" component={LightSensorScreen} />
        <Stack.Screen name="Magnetometer" component={MagnetometerScreen} />
        <Stack.Screen name="Haptics" component={HapticsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
