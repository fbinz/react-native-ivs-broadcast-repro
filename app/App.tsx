import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {
  IIVSBroadcastCameraView,
  IVSBroadcastCameraView,
} from 'amazon-ivs-react-native-broadcast';

import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  broadcastView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  screen: {
    flex: 1,
  },
});

const VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  bitrate: 7500000,
  targetFrameRate: 60,
  keyframeInterval: 2,
  isBFrames: true,
  isAutoBitrate: true,
  maxBitrate: 8500000,
  minBitrate: 1500000,
} as const;

const AUDIO_CONFIG = {
  bitrate: 128000,
} as const;

function BroadcastScreen() {
  const navigation = useNavigation();
  const cameraViewRef = useRef<IIVSBroadcastCameraView>(null);

  const swapCamera = async () => {
    if (cameraViewRef.current) {
      await cameraViewRef.current.swapCamera();
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <IVSBroadcastCameraView
        ref={cameraViewRef}
        audioConfig={AUDIO_CONFIG}
        style={styles.broadcastView}
        videoConfig={VIDEO_CONFIG}
      />
      <Button onPress={() => navigation.navigate('Other')} title="To other" />
      <Button onPress={() => swapCamera()} title="Swap camera" />
    </SafeAreaView>
  );
}

function OtherScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.screen}>
      <Button
        onPress={() => navigation.navigate('Broadcast')}
        title="To broadcast"
      />
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

const requestPermissions = async () => {
  await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  ]);
};

function App(): JSX.Element {
  const [isReadyToDisplay, setIsReadyToDisplay] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await requestPermissions();
      } finally {
        setIsReadyToDisplay(true);
      }
    })();
  }, []);

  if (!isReadyToDisplay) {
    return <Text>Waiting for permissions</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Broadcast" component={BroadcastScreen} />
        <Stack.Screen name="Other" component={OtherScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
