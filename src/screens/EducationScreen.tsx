import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, BackHandler } from 'react-native';

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
  const [errors, setErrors] = useState<{ [key: number]: { school?: boolean; degree?: boolean; startDate?: boolean } }>({});
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

  const handleChange = (index: number, field: keyof Education, value: string) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
    setErrors(e => ({ ...e, [index]: { ...e[index], [field]: false } }));
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      { school: '', degree: '', startDate: '', endDate: '', description: '' },
    ]);
  };

  const validate = () => {
    let valid = true;
    const newErrors: { [key: number]: { school?: boolean; degree?: boolean; startDate?: boolean } } = {};
    educations.forEach((edu, idx) => {
      const entryErr: { school?: boolean; degree?: boolean; startDate?: boolean } = {};
      if (!edu.school.trim()) { entryErr.school = true; valid = false; }
      if (!edu.degree.trim()) { entryErr.degree = true; valid = false; }
      if (!edu.startDate.trim()) { entryErr.startDate = true; valid = false; }
      if (Object.keys(entryErr).length > 0) newErrors[idx] = entryErr;
    });
    setErrors(newErrors);
    if (!valid) setErrorMsg('Please fill in all required fields for each education entry.');
    else setErrorMsg('');
    return valid;
  };

  const handleNext = () => {
    if (!validate()) return;
    // TODO: Save data to context or state management
    navigation.navigate('Skills');
  };

  const allFilled = educations.every(edu => edu.school.trim() && edu.degree.trim() && edu.startDate.trim());

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>Education</Text>
        {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}
        {educations.map((edu, idx) => (
          <View key={idx} style={styles.eduBlock}>
            <TextInput
              style={[styles.input, errors[idx]?.school && styles.inputError]}
              placeholder="School *"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={edu.school}
              onChangeText={v => handleChange(idx, 'school', v)}
            />
            <TextInput
              style={[styles.input, errors[idx]?.degree && styles.inputError]}
              placeholder="Degree *"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={edu.degree}
              onChangeText={v => handleChange(idx, 'degree', v)}
            />
            <TextInput
              style={[styles.input, errors[idx]?.startDate && styles.inputError]}
              placeholder="Start Date *"
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
        <View style={styles.buttonRow}>
          <View style={[styles.buttonWrapper, { flex: 1, marginRight: 8 }]}> 
            <Button title="Back" onPress={() => navigation.goBack()} color={isDark ? '#888' : '#ccc'} />
          </View>
          <View style={[styles.buttonWrapper, { flex: 1, marginLeft: 8 }]}> 
            <Button title="Next: Skills" onPress={handleNext} color={isDark ? '#4F8EF7' : '#1976D2'} disabled={!allFilled} />
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
  inputError: {
    borderColor: '#e53935',
  },
  errorMsg: {
    color: '#e53935',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
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
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
});

export default EducationScreen; 