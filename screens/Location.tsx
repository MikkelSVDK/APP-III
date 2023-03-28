import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject } from 'expo-location'
import MapView, { Marker } from 'react-native-maps'
import Spinner from 'react-native-loading-spinner-overlay'

import axios from 'axios'

export default function Location() {
  const [ mapViewRef, setMapViewRef ] = useState<MapView | null>(null)
  
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ location, setLocation ] = useState<LocationObject | undefined>()
  const [ feature, setFeature ] = useState<any>()

  useEffect(() => {
    requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        console.log("requestForegroundPermissionsAsync")
        setLoading(false)
        return
      }

      console.log("getCurrentPositionAsync")
      getCurrentPositionAsync({}).then(location => {
        axios.get(`https://api.openrouteservice.org/geocode/reverse?api_key=5b3ce3597851110001cf62480badd745b7524db9bd7bfa472578d43d&point.lon=${location.coords.longitude}&point.lat=${location.coords.latitude}`).then(res => {
          setLocation(location)

          res.data.features.sort((a: any, b: any) => b.properties.confidence - a.properties.confidence)
          setFeature(res.data.features[0])
          setLoading(false)
        }).catch(err => {
          setLoading(false)
        })
      })
    })
  }, [])

  useEffect(() => {
    console.log(mapViewRef)
    if(mapViewRef)
      mapViewRef.animateCamera({
        center: {
          latitude: feature?.geometry?.coordinates[1],
          longitude: feature?.geometry?.coordinates[0]
        },
        heading: 0,
        pitch: 0,
        zoom: 17
      }, { duration: 500 })
  }, [ mapViewRef, feature ])

  return (
    <View style={styles.container}>
      <MapView style={styles.map} ref={ref => setMapViewRef(ref)} showsUserLocation={true} mapType="hybrid" showsTraffic={true}>
        {feature && <Marker title={feature?.properties?.label} coordinate={{latitude: feature?.geometry?.coordinates[1] || 0, longitude: feature?.geometry?.coordinates[0] || 0}} />}
      </MapView>
      <Spinner
          visible={loading}
        />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: '100%',
    height: '100%',
  },
  text: {
    marginTop: 25,
    alignItems: 'center'
  }
});
