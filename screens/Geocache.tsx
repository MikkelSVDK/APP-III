import { useCallback, useEffect, useState } from 'react'
import { Alert, StyleSheet, View, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { requestForegroundPermissionsAsync, watchPositionAsync, LocationSubscription, getLastKnownPositionAsync, getForegroundPermissionsAsync } from 'expo-location'
import MapView, { Circle } from 'react-native-maps'

export default function Geocache({ navigation }: NativeStackScreenProps<any>) {
  const [ arrived, setArrived ] = useState<boolean>(false)
  let localArrived: boolean = false

  const [ mapViewRef, setMapViewRef ] = useState<MapView | null>(null)
  
  const [ location, setLocation ] = useState<{ latitude: number, longitude: number } | undefined>()
  const [ randomLocation, setRandomLocation ] = useState<{ latitude: number, longitude: number } | undefined>()

  let localRandomLocation: { latitude: number, longitude: number } | undefined

  function getRandomLocation(latitude: number, longitude: number, radius: number) {
    // Convert radius from meters to degrees
    var radiusInDegrees = radius / 111000; // Approximate conversion value
    
    var u = Math.random();
    var v = Math.random();
    var w = radiusInDegrees * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);
    
    // Adjust the x-coordinate for the shrinking of the east-west distances
    var newLongitude = x / Math.cos(latitude);
    
    var foundLatitude = latitude + y;
    var foundLongitude = longitude + newLongitude;
    
    // Return as [latitude, longitude] pair
    return [foundLatitude, foundLongitude];
  }

  function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const earthRadius = 6371e3; // Earth's radius in meters
    const phi1 = lat1 * Math.PI / 180; // Convert lat1 to radians
    const phi2 = lat2 * Math.PI / 180; // Convert lat2 to radians
    const deltaPhi = (lat2 - lat1) * Math.PI / 180; // Difference in latitudes
    const deltaLambda = (lon2 - lon1) * Math.PI / 180; // Difference in longitudes

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceInMeters = earthRadius * c;
    return distanceInMeters;
  }

  useEffect(() => {

    const focusHandler = navigation.addListener('focus', () => {
      setArrived(false)
      localArrived = false

      getLastKnownPositionAsync().then(location => {
        let [latitude, longitude] = getRandomLocation(location!.coords.latitude, location!.coords.longitude, 100)

        localRandomLocation = {
          latitude,
          longitude
        }

        setRandomLocation(localRandomLocation)
      })
    })

    let locationWatchPosition: LocationSubscription | undefined
    getForegroundPermissionsAsync().then(async ({ granted }) => {
      if(!granted){
        let { granted } = await requestForegroundPermissionsAsync()
        if(!granted)
          return Alert.alert(
            'Location',
            `Permission denied... `,
            [
              { text: 'Go back', onPress: () => navigation.navigate("Home") },
            ],
            { cancelable: false }
          )
      }
      
      locationWatchPosition = await watchPositionAsync({
        distanceInterval: 1
      }, (location) => {
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })

        if(localRandomLocation){
          let meters = getDistanceInMeters(location.coords.latitude, location.coords.longitude, localRandomLocation.latitude, localRandomLocation.longitude)
          console.log(meters)
          if(meters < 10 && !localArrived){
            setArrived(true)
            localArrived = true
            navigation.navigate('Qr')
          }
        }
      })
    })

    return () => {
      focusHandler()

      if(locationWatchPosition)
        locationWatchPosition.remove()
    }
  }, [])


  /*useFocusEffect(
    useCallback(() => {
      setArrived(false)

      if(watchPosition)
        watchPosition.remove()
      
      requestForegroundPermissionsAsync().then(async ({ status }) => {
        if (status !== 'granted') {
          return Alert.alert(
            'Location',
            `Permission denied... `,
            [
              { text: 'Go back', onPress: () => navigation.navigate("Home") },
            ],
            { cancelable: false }
          )
        }

        getLastKnownPositionAsync().then(location => {
          let [latitude, longitude] = getRandomLocation(location!.coords.latitude, location!.coords.longitude, 50)

          setRandomLocation({
            latitude,
            longitude
          })
        })
      })

      return () => {
        if(watchPosition)
          watchPosition.remove()
      }
    }, [])
  )

  useEffect(() => {
    if(watchPosition)
      watchPosition.remove()

    requestForegroundPermissionsAsync().then(async ({ status }) => {
      if(status === 'granted'){
        watchPosition = await watchPositionAsync({
          distanceInterval: 1
        }, location => {
          setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          })

          console.log(arrived, randomLocation)
          if(randomLocation){
            let meters = getDistanceInMeters(location.coords.latitude, location.coords.longitude, randomLocation.latitude, randomLocation.longitude)
            console.log(meters)
            if(meters < 50 && !arrived){
              setArrived(true)
              navigation.navigate('Qr')
            }
          }
        })
      }
    })

    return () => {
      if(watchPosition)
        watchPosition.remove()
    }
  }, [randomLocation])*/

  return (
    <View style={styles.container}>
      <MapView style={styles.map} ref={ref => setMapViewRef(ref)} showsUserLocation={true} followsUserLocation={true}>
        {randomLocation && <Circle
          center={randomLocation}
          radius={5}
          strokeWidth={2}
          strokeColor="#3399ff"
          fillColor="#80bfff"
        />}
      </MapView>
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
  map: {
    width: '100%',
    height: '100%',
  }
})
