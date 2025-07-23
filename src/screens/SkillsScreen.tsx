import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';

const SkillsScreen = ({ navigation }: any) => {
  const [skills, setSkills] = useState<string[]>(['']);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const handleChange = (index: number, value: string) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const handleNext = () => {
    // TODO: Save data to context or state management
    navigation.navigate('ReviewGenerate');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>Skills</Text>
        {skills.map((skill, idx) => (
          <TextInput
            key={idx}
            style={styles.input}
            placeholder={`Skill #${idx + 1}`}
            placeholderTextColor={isDark ? '#aaa' : '#888'}
            value={skill}
            onChangeText={v => handleChange(idx, v)}
          />
        ))}
        <TouchableOpacity onPress={addSkill} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add Skill</Text>
        </TouchableOpacity>
        <View style={styles.buttonWrapper}>
          <Button title="Next: Review & Generate" onPress={handleNext} color={isDark ? '#4F8EF7' : '#1976D2'} />
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

export default SkillsScreen; 