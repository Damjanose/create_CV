import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  useColorScheme,
  BackHandler,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

type Props = {
  navigation?: any;
  data?: any;
  setData?: any;
  errors?: any;
  setErrors?: any;
  errorMsg?: string;
  setErrorMsg?: any;
  isWizard?: boolean;
};

const AboutMeScreen: React.FC<Props> = ({
  navigation,
  data,
  setData,
  errors,
  setErrors,
  errorMsg,
  setErrorMsg,
  isWizard = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark, isWizard);

  // block back only when standalone
  useEffect(() => {
    if (!isWizard) {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }
  }, [isWizard]);

  // disable swipe‑back gesture
  useEffect(() => {
    if (!isWizard && navigation?.setOptions) {
      navigation.setOptions({ gestureEnabled: false });
    }
  }, [navigation, isWizard]);

  // choose between wizard state vs. local
  const state = isWizard ? data! : data! /* or your local state logic */;
  const setState = isWizard ? setData! : setData!;
  const fieldErrors = isWizard ? errors! : errors!;
  const setFieldErrors = isWizard ? setErrors! : setErrors!;
  const msg = isWizard ? errorMsg! : errorMsg!;
  const setMsg = isWizard ? setErrorMsg! : setErrorMsg!;

  const handleChange = (key: string, val: string) => {
    setState((prev: any) => ({ ...prev, [key]: val }));
    setFieldErrors((e: any) => ({ ...e, [key]: false }));
  };

  const requestCameraPermission = async () => {
    let result;
    if (Platform.OS === 'ios') {
      result = await request(PERMISSIONS.IOS.CAMERA);
    } else {
      result = await request(PERMISSIONS.ANDROID.CAMERA);
    }
    return result === RESULTS.GRANTED;
  };
  const requestPhotoLibraryPermission = async () => {
    let result;
    if (Platform.OS === 'ios') {
      result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    } else {
      const version = typeof Platform.Version === 'string' ? parseInt(Platform.Version, 10) : Platform.Version;
      if (version >= 33) {
        result = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      } else {
        result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      }
    }
    return result === RESULTS.GRANTED;
  };
  const handleImagePick = async () => {
    const granted = await requestPhotoLibraryPermission();
    if (!granted) {
      Alert.alert('Permission required', 'Please allow photo library access to select a photo.', [
        { text: 'Open Settings', onPress: () => openSettings() },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        setMsg('Image selection error');
        return;
      }
      const asset = response.assets && response.assets[0];
      if (asset && asset.uri) {
        setState((prev: any) => ({ ...prev, image: asset.uri }));
      }
    });
  };
  const handleTakePhoto = async () => {
    const granted = await requestCameraPermission();
    if (!granted) {
      Alert.alert('Permission required', 'Please allow camera access to take a photo.', [
        { text: 'Open Settings', onPress: () => openSettings() },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }
    launchCamera({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        setMsg('Camera error');
        return;
      }
      const asset = response.assets && response.assets[0];
      if (asset && asset.uri) {
        setState((prev: any) => ({ ...prev, image: asset.uri }));
      }
    });
  };

  const fields = [
    { key: 'name', label: 'Full Name *', multiline: false, keyboard: 'default' },
    { key: 'email', label: 'Email *', multiline: false, keyboard: 'email-address' },
    { key: 'phone', label: 'Phone Number *', multiline: false, keyboard: 'phone-pad' },
    { key: 'address', label: 'Address *', multiline: false, keyboard: 'default' },
    {
      key: 'summary',
      label: 'Short Summary/About Me *',
      multiline: true,
      keyboard: 'default',
      height: 100,
    },
  ];

  const content = (
    <>
      <Text style={styles.title}>About Me</Text>
      {!!msg && <Text style={styles.errorMsg}>{msg}</Text>}

      <View style={styles.imagePickerRow}>
        {state.image ? (
          <Image source={{ uri: state.image }} style={styles.profileImage} />
        ) : (
          <Image source={require('../assets/images/user.png')} style={styles.profileImage} />
        )}
        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.imageBtn} onPress={handleImagePick}>
            <Text style={styles.imageBtnText}>Upload Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageBtn} onPress={handleTakePhoto}>
            <Text style={styles.imageBtnText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {fields.map(({ key, label, multiline, keyboard, height }) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            value={state[key]}
            onChangeText={(v) => handleChange(key, v)}
            placeholder={label}
            placeholderTextColor={isDark ? '#888' : '#AAA'}
            multiline={multiline}
            keyboardType={keyboard as any}
            textAlignVertical={multiline ? 'top' : 'center'}
            style={[
              styles.input,
              multiline && { height },
              fieldErrors[key] && styles.inputError,
            ]}
          />
        </View>
      ))}

      {!isWizard && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.btn, styles.btnSecondary]} disabled>
            <Text style={[styles.btnText, styles.textSecondary]}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]}>
            <Text style={styles.btnText}>Next: Experience</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  return isWizard ? (
    <View style={styles.container}>{content}</View>
  ) : (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>{content}</View>
    </ScrollView>
  );
};

const getStyles = (isDark: boolean, isWizard: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      padding: isWizard ? 0 : 24,
      justifyContent: isWizard ? 'flex-start' : 'center',
      alignItems: isWizard ? 'stretch' : 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: isDark ? '#FFF' : '#222',
      marginBottom: 16,
      textAlign: 'center',
    },
    errorMsg: {
      color: '#E53935',
      marginBottom: 12,
      textAlign: 'center',
      fontWeight: '600',
    },
    field: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      marginBottom: 6,
      color: isDark ? '#DDD' : '#555',
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#CCC',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      backgroundColor: isDark ? '#1E1F24' : '#FFF',
      color: isDark ? '#FFF' : '#222',
    },
    inputError: {
      borderColor: '#E53935',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
    },
    btn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    btnPrimary: {
      backgroundColor: isDark ? '#4F8EF7' : '#1976D2',
    },
    btnSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDark ? '#888' : '#CCC',
    },
    btnText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
    },
    textSecondary: {
      color: isDark ? '#888' : '#555',
    },
    imagePickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#eee',
      marginRight: 16,
    },
    imageButtons: {
      flexDirection: 'column',
      gap: 8,
    },
    imageBtn: {
      backgroundColor: isDark ? '#4F8EF7' : '#1976D2',
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 6,
    },
    imageBtnText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
  });

export default AboutMeScreen;
