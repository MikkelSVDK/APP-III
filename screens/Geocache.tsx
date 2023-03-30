import { useCallback, useEffect, useState } from 'react'
import { Alert, StyleSheet, View, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { requestForegroundPermissionsAsync, watchPositionAsync, LocationSubscription, getLastKnownPositionAsync, getForegroundPermissionsAsync } from 'expo-location'
import MapView, { Circle, UserLocationChangeEvent } from 'react-native-maps'

export default function Geocache({ route, navigation }: NativeStackScreenProps<any>) {
  const [ arrived, setArrived ] = useState<boolean>(false)
  const [ meters, setMeters ] = useState<number>(0)
  let currentLvl = 0
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

  function mapViewUserLocationChange(e: UserLocationChangeEvent) {
    if(!mapViewRef) return

    mapViewRef.animateCamera({
      center: {
        latitude: e.nativeEvent.coordinate!.latitude,
        longitude: e.nativeEvent.coordinate!.longitude
      },
      heading: e.nativeEvent.coordinate!.heading > 0 ? e.nativeEvent.coordinate?.heading : 0,
      pitch: 0,
      zoom: 0,
      altitude: 200
    }, { duration: 500 })
  }


  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      currentLvl++
      
      setArrived(false)
      localArrived = false

      getLastKnownPositionAsync().then(location => {
        let [latitude, longitude] = getRandomLocation(location!.coords.latitude, location!.coords.longitude, 7)

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
      
      console.log("watchPositionAsync")
      locationWatchPosition = await watchPositionAsync({
        distanceInterval: 1
      }, (location) => {
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })

        if(localRandomLocation){
          let localMeters = getDistanceInMeters(location.coords.latitude, location.coords.longitude, localRandomLocation.latitude, localRandomLocation.longitude)
          console.log(localMeters)
          setMeters(localMeters)
          if(localMeters < 2 && !localArrived){
            setArrived(true)
            localArrived = true
            navigation.navigate('Qr', { showHeader: false, currentLvl })
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

  return (
    <View style={styles.container}>
      <Text style={{ position:'absolute', zIndex: 1, top: 10, left: 10, fontSize: 25 }}>{meters == 0 ? '-' : meters.toFixed(2)} m</Text>
      <MapView 
        style={styles.map} 
        ref={ref => setMapViewRef(ref)} 
        onUserLocationChange={mapViewUserLocationChange} 
        showsUserLocation={true}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0,
          longitudeDelta: 0
        }}
      >
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
