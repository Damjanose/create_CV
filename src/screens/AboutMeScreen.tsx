import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, useColorScheme, BackHandler } from 'react-native';

const AboutMeScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [summary, setSummary] = useState('');
  const [errors, setErrors] = useState<{ name?: boolean; email?: boolean; phone?: boolean; address?: boolean; summary?: boolean }>({});
  const [errorMsg, setErrorMsg] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  useEffect(() => {
    // Block hardware back
    const handler = () => true;
    const subscription = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    navigation.setOptions && navigation.setOptions({ gestureEnabled: false });
  }, [navigation]);

  const validate = () => {
    const newErrors: { name?: boolean; email?: boolean; phone?: boolean; address?: boolean; summary?: boolean } = {};
    if (!name.trim()) newErrors.name = true;
    if (!email.trim()) newErrors.email = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!address.trim()) newErrors.address = true;
    if (!summary.trim()) newErrors.summary = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrorMsg('Please fill in all required fields.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const allFilled = name.trim() && email.trim() && phone.trim() && address.trim() && summary.trim();

  const handleNext = () => {
    if (!validate()) return;
    navigation.navigate('Experience');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>About Me</Text>
        {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Full Name *"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={name}
          onChangeText={v => { setName(v); setErrors(e => ({ ...e, name: false })); }}
        />
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email *"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={email}
          onChangeText={v => { setEmail(v); setErrors(e => ({ ...e, email: false })); }}
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="Phone Number *"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={phone}
          onChangeText={v => { setPhone(v); setErrors(e => ({ ...e, phone: false })); }}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, errors.address && styles.inputError]}
          placeholder="Address *"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={address}
          onChangeText={v => { setAddress(v); setErrors(e => ({ ...e, address: false })); }}
        />
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }, errors.summary && styles.inputError]}
          placeholder="Short Summary/About Me *"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={summary}
          onChangeText={v => { setSummary(v); setErrors(e => ({ ...e, summary: false })); }}
          multiline
        />
        <View style={styles.buttonRow}>
          <View style={[styles.buttonWrapper, { flex: 1, marginRight: 8 }]}> 
            <Button title="Back" onPress={() => {}} color={isDark ? '#888' : '#ccc'} disabled />
          </View>
          <View style={[styles.buttonWrapper, { flex: 1, marginLeft: 8 }]}> 
            <Button title="Next: Experience" onPress={handleNext} color={isDark ? '#4F8EF7' : '#1976D2'} disabled={!allFilled} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: isDark ? '#181A20' : '#f2f4f8',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: isDark ? '#23262F' : '#fff',
    borderRadius: 16,
    padding: 28,
    shadowColor: isDark ? '#000' : '#aaa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginVertical: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: isDark ? '#fff' : '#222',
  },
  input: {
    borderWidth: 1.5,
    borderColor: isDark ? '#333' : '#d1d5db',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    fontSize: 17,
    backgroundColor: isDark ? '#181A20' : '#f7f9fa',
    color: isDark ? '#fff' : '#222',
  },
  inputError: {
    borderColor: '#e53935',
  },
  errorMsg: {
    color: '#e53935',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  buttonWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default AboutMeScreen; 