import axios from 'axios'
import { Camera, CameraType } from 'expo-camera'
import { useRef, useState } from 'react'
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { selectionAsync } from 'expo-haptics'

export default function CameraScreen() {
  const [type, setType] = useState(CameraType.back)
  const [permission, requestPermission] = Camera.useCameraPermissions()
  
  const camera = useRef<any>(null)

  if (!permission) 
    return <View />

  if (!permission.granted)
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    )

  function toggleCameraType() {
    selectionAsync()
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
  }

  function takePicture() {
    camera.current?.takePictureAsync({ quality: 0, base64: true }).then((data: any) => {
      selectionAsync()
      axios.post(`http://10.130.64.119:8080/upload/image`, { base64image: `data:image/png;base64, ${data.base64}` }).then(res => {
        WebBrowser.openBrowserAsync(`http://10.130.64.119:8080${res.data}`)
      }).catch(err => {
        console.log(err)
      })
    })
  }

  return (
    <View style={styles.container}>
      <Camera ref={camera} style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
})
