import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';

const SkillsScreen = ({
  navigation,
  data,
  setData,
  errorMsg,
  setErrorMsg,
  isWizard,
}: any) => {
  const [local, setLocal] = useState(['']);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const state = isWizard ? data || local : local;
  const setState = isWizard && setData ? setData : setLocal;
  const errMsg = isWizard ? errorMsg : undefined;
  const setErrMsg = isWizard && setErrorMsg ? setErrorMsg : undefined;

  const handleChange = (index: number, value: string) => {
    const updated = [...state];
    updated[index] = value;
    setState(updated);
  };

  const addSkill = () => {
    setState([...state, '']);
  };

  const allFilled = state.some((s: string) => s.trim());

  const handleNext = () => {
    if (!allFilled && setErrMsg) {
      setErrMsg('Please enter at least one skill.');
      return;
    }
    if (!isWizard && navigation) navigation.navigate('ReviewGenerate');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>Skills</Text>
        {errMsg ? <Text style={styles.errorMsg}>{errMsg}</Text> : null}
        {state.map((skill: string, idx: number) => (
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
        {!isWizard && (
          <View style={styles.buttonRow}>
            <View style={[styles.buttonWrapper, { flex: 1, marginRight: 8 }]}> 
              <Button title="Back" onPress={() => navigation.goBack()} color={isDark ? '#888' : '#ccc'} />
            </View>
            <View style={[styles.buttonWrapper, { flex: 1, marginLeft: 8 }]}> 
              <Button title="Next: Review & Generate" onPress={handleNext} color={isDark ? '#4F8EF7' : '#1976D2'} />
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
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  errorMsg: {
    color: '#e53935',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SkillsScreen; 