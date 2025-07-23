import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';

interface Experience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

const ExperienceScreen = ({ navigation }: any) => {
  const [experiences, setExperiences] = useState<Experience[]>([
    { jobTitle: '', company: '', startDate: '', endDate: '', description: '' },
  ]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const handleChange = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { jobTitle: '', company: '', startDate: '', endDate: '', description: '' },
    ]);
  };

  const handleNext = () => {
    // TODO: Save data to context or state management
    navigation.navigate('Education');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>Experience</Text>
        {experiences.map((exp, idx) => (
          <View key={idx} style={styles.expBlock}>
            <TextInput
              style={styles.input}
              placeholder="Job Title"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={exp.jobTitle}
              onChangeText={v => handleChange(idx, 'jobTitle', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Company"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={exp.company}
              onChangeText={v => handleChange(idx, 'company', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Start Date"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={exp.startDate}
              onChangeText={v => handleChange(idx, 'startDate', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="End Date"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={exp.endDate}
              onChangeText={v => handleChange(idx, 'endDate', v)}
            />
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Description"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={exp.description}
              onChangeText={v => handleChange(idx, 'description', v)}
              multiline
            />
          </View>
        ))}
        <TouchableOpacity onPress={addExperience} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add Experience</Text>
        </TouchableOpacity>
        <View style={styles.buttonWrapper}>
          <Button title="Next: Education" onPress={handleNext} color={isDark ? '#4F8EF7' : '#1976D2'} />
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
  expBlock: {
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

export default ExperienceScreen; 