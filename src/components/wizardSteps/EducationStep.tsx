import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationStepProps {
  education: Education[];
  setEducation: (cb: (prev: Education[]) => Education[]) => void;
  styles: { [key: string]: StyleProp<ViewStyle | TextStyle> };
  isDark: boolean;
}

const EducationStep: React.FC<EducationStepProps> = ({
  education,
  setEducation,
  styles,
  isDark,
}) => (
  <View style={{ padding: 24 }}>
    <Text style={styles.title}>Education</Text>
    {education.map((edu, idx) => (
      <View key={idx} style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: isDark ? '#333' : '#EEE', paddingBottom: 16 }}>
        <Text style={styles.label}>School</Text>
        <TextInput
          style={styles.input}
          placeholder="School"
          value={edu.school}
          onChangeText={school => {
            setEducation((prev) => {
              const newEdu = [...prev];
              newEdu[idx] = { ...newEdu[idx], school };
              return newEdu;
            });
          }}
        />
        <Text style={styles.label}>Degree</Text>
        <TextInput
          style={styles.input}
          placeholder="Degree"
          value={edu.degree}
          onChangeText={degree => {
            setEducation((prev) => {
              const newEdu = [...prev];
              newEdu[idx] = { ...newEdu[idx], degree };
              return newEdu;
            });
          }}
        />
        <Text style={styles.label}>Start Date</Text>
        <TextInput
          style={styles.input}
          placeholder="Start Date"
          value={edu.startDate}
          onChangeText={startDate => {
            setEducation((prev) => {
              const newEdu = [...prev];
              newEdu[idx] = { ...newEdu[idx], startDate };
              return newEdu;
            });
          }}
        />
        <Text style={styles.label}>End Date</Text>
        <TextInput
          style={styles.input}
          placeholder="End Date"
          value={edu.endDate}
          onChangeText={endDate => {
            setEducation((prev) => {
              const newEdu = [...prev];
              newEdu[idx] = { ...newEdu[idx], endDate };
              return newEdu;
            });
          }}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Description"
          value={edu.description}
          onChangeText={description => {
            setEducation((prev) => {
              const newEdu = [...prev];
              newEdu[idx] = { ...newEdu[idx], description };
              return newEdu;
            });
          }}
          multiline
        />
        <TouchableOpacity
          style={{ marginTop: 8, alignSelf: 'flex-end', backgroundColor: '#E53935', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
          onPress={() => setEducation((prev) => prev.filter((_, i) => i !== idx))}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Remove</Text>
        </TouchableOpacity>
      </View>
    ))}
    <TouchableOpacity
      style={{ marginTop: 8, alignSelf: 'flex-start', backgroundColor: isDark ? '#4F8EF7' : '#1976D2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
      onPress={() => setEducation((prev) => [...prev, { school: '', degree: '', startDate: '', endDate: '', description: '' }])}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Add Education</Text>
    </TouchableOpacity>
  </View>
);

export default EducationStep; 