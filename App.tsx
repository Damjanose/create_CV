import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import WizardForm from "./src/components/WizardForm";
import { Alert, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const client = new QueryClient();

const requestAllPermissions = async () => {
  let camera, photos;
  if (Platform.OS === 'ios') {
    camera = await check(PERMISSIONS.IOS.CAMERA);
    if (camera !== RESULTS.GRANTED) camera = await request(PERMISSIONS.IOS.CAMERA);
    photos = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    if (photos !== RESULTS.GRANTED) photos = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
  } else {
    camera = await check(PERMISSIONS.ANDROID.CAMERA);
    if (camera !== RESULTS.GRANTED) camera = await request(PERMISSIONS.ANDROID.CAMERA);
    const version = typeof Platform.Version === 'string' ? parseInt(Platform.Version, 10) : Platform.Version;
    if (version >= 33) {
      photos = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      if (photos !== RESULTS.GRANTED) photos = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    } else {
      photos = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      if (photos !== RESULTS.GRANTED) photos = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    }
  }
  if (camera !== RESULTS.GRANTED || photos !== RESULTS.GRANTED) {
    Alert.alert(
      'Permissions required',
      'This app needs camera and photo library permissions to allow you to upload or take a profile photo.',
    );
  }
};

export default function App() {
  useEffect(() => {
    requestAllPermissions();
  }, []);
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={client}>
        <WizardForm />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
