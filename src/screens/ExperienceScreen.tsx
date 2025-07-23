import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, BackHandler } from 'react-native';

const ExperienceScreen = ({
  navigation,
  data,
  setData,
  errors,
  setErrors,
  errorMsg,
  setErrorMsg,
  isWizard,
}: any) => {
  const [local, setLocal] = useState([
    { jobTitle: '', company: '', startDate: '', endDate: '', description: '' },
  ]);
  const [localErrors, setLocalErrors] = useState({});
  const [localErrorMsg, setLocalErrorMsg] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  useEffect(() => {
    if (!isWizard) {
      // Block hardware back
      const handler = () => true;
      const subscription = BackHandler.addEventListener('hardwareBackPress', handler);
      return () => subscription.remove();
    }
  }, [isWizard]);

  useEffect(() => {
    if (!isWizard && navigation?.setOptions) {
      navigation.setOptions({ gestureEnabled: false });
    }
  }, [navigation, isWizard]);

  const state = isWizard ? data || local : local;
  const setState = isWizard && setData ? setData : setLocal;
  const errState = isWizard ? errors || localErrors : localErrors;
  const setErrState = isWizard && setErrors ? setErrors : setLocalErrors;
  const errMsg = isWizard ? errorMsg || localErrorMsg : localErrorMsg;
  const setErrMsg = isWizard && setErrorMsg ? setErrorMsg : setLocalErrorMsg;

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...state];
    updated[index][field] = value;
    setState(updated);
    setErrState((e: any) => ({ ...e, [index]: { ...e[index], [field]: false } }));
  };

  const addExperience = () => {
    setState([
      ...state,
      { jobTitle: '', company: '', startDate: '', endDate: '', description: '' },
    ]);
  };

  const allFilled = state.every((exp: any) => exp.jobTitle?.trim() && exp.company?.trim() && exp.startDate?.trim());

  const handleNext = () => {
    let valid = true;
    const newErrors: any = {};
    state.forEach((exp: any, idx: number) => {
      const entryErr: any = {};
      if (!exp.jobTitle?.trim()) { entryErr.jobTitle = true; valid = false; }
      if (!exp.company?.trim()) { entryErr.company = true; valid = false; }
      if (!exp.startDate?.trim()) { entryErr.startDate = true; valid = false; }
      if (Object.keys(entryErr).length > 0) newErrors[idx] = entryErr;
    });
    setErrState(newErrors);
    if (!valid) setErrMsg('Please fill in all required fields for each experience.');
    else setErrMsg('');
    if (valid && !isWizard && navigation) navigation.navigate('Education');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>Experience</Text>
        {errMsg ? <Text style={styles.errorMsg}>{errMsg}</Text> : null}
        {state.map((exp: any, idx: number) => (
          <View key={idx} style={styles.expBlock}>
            <TextInput
              style={[styles.input, errState[idx]?.jobTitle && styles.inputError]}
              placeholder="Job Title *"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={exp.jobTitle}
              onChangeText={v => handleChange(idx, 'jobTitle', v)}
            />
            <TextInput
              style={[styles.input, errState[idx]?.company && styles.inputError]}
              placeholder="Company *"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={exp.company}
              onChangeText={v => handleChange(idx, 'company', v)}
            />
            <TextInput
              style={[styles.input, errState[idx]?.startDate && styles.inputError]}
              placeholder="Start Date *"
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
        {!isWizard && (
          <View style={styles.buttonRow}>
            <View style={[styles.buttonWrapper, { flex: 1, marginRight: 8 }]}> 
              <Button title="Back" onPress={() => navigation.goBack()} color={isDark ? '#888' : '#ccc'} />
            </View>
            <View style={[styles.buttonWrapper, { flex: 1, marginLeft: 8 }]}> 
              <Button title="Next: Education" onPress={handleNext} color={isDark ? '#4F8EF7' : '#1976D2'} disabled={!allFilled} />
            </View>
          </View>
        )}
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

export default ExperienceScreen; 