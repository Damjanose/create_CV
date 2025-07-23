import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';

interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

const EducationScreen = ({ navigation }: any) => {
  const [educations, setEducations] = useState<Education[]>([
    { school: '', degree: '', startDate: '', endDate: '', description: '' },
  ]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const handleChange = (index: number, field: keyof Education, value: string) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      { school: '', degree: '', startDate: '', endDate: '', description: '' },
    ]);
  };

  const handleNext = () => {
    // TODO: Save data to context or state management
    navigation.navigate('Skills');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>Education</Text>
        {educations.map((edu, idx) => (
          <View key={idx} style={styles.eduBlock}>
            <TextInput
              style={styles.input}
              placeholder="School"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={edu.school}
              onChangeText={v => handleChange(idx, 'school', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Degree"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={edu.degree}
              onChangeText={v => handleChange(idx, 'degree', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Start Date"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={edu.startDate}
              onChangeText={v => handleChange(idx, 'startDate', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="End Date"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={edu.endDate}
              onChangeText={v => handleChange(idx, 'endDate', v)}
            />
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Description"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={edu.description}
              onChangeText={v => handleChange(idx, 'description', v)}
              multiline
            />
          </View>
        ))}
        <TouchableOpacity onPress={addEducation} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add Education</Text>
        </TouchableOpacity>
        <View style={styles.buttonWrapper}>
          <Button title="Next: Skills" onPress={handleNext} color={isDark ? '#4F8EF7' : '#1976D2'} />
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
  eduBlock: {
    marginBottom: 28,
    padding: 18,
    borderWidth: 1.5,
    borderColor: isDark ? '#333' : '#e5e7eb',
    borderRadius: 12,
    backgroundColor: isDark ? '#181A20' : '#f7f9fa',
  },
  input: {
    borderWidth: 1.2,
    borderColor: isDark ? '#333' : '#d1d5db',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: isDark ? '#23262F' : '#fff',
    color: isDark ? '#fff' : '#222',
  },
  addBtn: {
    marginBottom: 24,
    alignItems: 'center',
  },
  addBtnText: {
    color: isDark ? '#4F8EF7' : '#1976D2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default EducationScreen; 