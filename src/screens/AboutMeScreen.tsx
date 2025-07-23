import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, useColorScheme } from 'react-native';

const AboutMeScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [summary, setSummary] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const handleNext = () => {
    // TODO: Save data to context or state management
    navigation.navigate('Experience');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>About Me</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Short Summary/About Me"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={summary}
          onChangeText={setSummary}
          multiline
        />
        <View style={styles.buttonWrapper}>
          <Button title="Next: Experience" onPress={handleNext} color={isDark ? '#4F8EF7' : '#1976D2'} />
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
  buttonWrapper: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default AboutMeScreen; 