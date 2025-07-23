import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, useColorScheme, TouchableOpacity, FlatList, ScrollView } from 'react-native';

const TEMPLATES = [
  { id: 'classic', name: 'Classic', description: 'A clean, traditional layout.' },
  { id: 'modern', name: 'Modern', description: 'A stylish, contemporary look.' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant.' },
];

const ReviewGenerateScreen = ({
  navigation,
  aboutMe,
  experience,
  education,
  skills,
  isWizard,
}: any) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [showTemplates, setShowTemplates] = useState(false);

  // Use props if provided, otherwise fallback to mock
  const cv = aboutMe && experience && education && skills ? {
    name: aboutMe.name,
    email: aboutMe.email,
    phone: aboutMe.phone,
    address: aboutMe.address,
    summary: aboutMe.summary,
    experience,
    education,
    skills,
  } : {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+123456789',
    address: '123 Main St, City',
    summary: 'Motivated professional with 5+ years of experience.',
    experience: [
      { jobTitle: 'Software Engineer', company: 'Tech Co', startDate: '2019', endDate: '2023', description: 'Developed cool apps.' },
    ],
    education: [
      { school: 'University X', degree: 'BSc Computer Science', startDate: '2015', endDate: '2019', description: 'Graduated with honors.' },
    ],
    skills: ['React', 'TypeScript', 'Node.js'],
  };

  const handleGeneratePDF = () => {
    // TODO: Implement PDF generation using selectedTemplate
    Alert.alert('PDF generation coming soon!', `Selected template: ${selectedTemplate}`);
  };

  const renderTemplate = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.templateCard, selectedTemplate === item.id && styles.selectedTemplate]}
      onPress={() => setSelectedTemplate(item.id)}
      activeOpacity={0.8}
    >
      <Text style={styles.templateName}>{item.name}</Text>
      <Text style={styles.templateDesc}>{item.description}</Text>
      {selectedTemplate === item.id && (
        <Text style={styles.selectedLabel}>Selected</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {!showTemplates ? (
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={styles.title}>Review Your CV</Text>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.field}><Text style={styles.label}>Name:</Text> {cv.name}</Text>
            <Text style={styles.field}><Text style={styles.label}>Email:</Text> {cv.email}</Text>
            <Text style={styles.field}><Text style={styles.label}>Phone:</Text> {cv.phone}</Text>
            <Text style={styles.field}><Text style={styles.label}>Address:</Text> {cv.address}</Text>
            <Text style={styles.field}><Text style={styles.label}>Summary:</Text> {cv.summary}</Text>
            <Text style={styles.sectionTitle}>Experience</Text>
            {cv.experience.map((exp: any, i: number) => (
              <View key={i} style={styles.subBlock}>
                <Text style={styles.field}><Text style={styles.label}>Job:</Text> {exp.jobTitle} at {exp.company}</Text>
                <Text style={styles.field}><Text style={styles.label}>Period:</Text> {exp.startDate} - {exp.endDate}</Text>
                <Text style={styles.field}><Text style={styles.label}>Description:</Text> {exp.description}</Text>
              </View>
            ))}
            <Text style={styles.sectionTitle}>Education</Text>
            {cv.education.map((edu: any, i: number) => (
              <View key={i} style={styles.subBlock}>
                <Text style={styles.field}><Text style={styles.label}>School:</Text> {edu.school}</Text>
                <Text style={styles.field}><Text style={styles.label}>Degree:</Text> {edu.degree}</Text>
                <Text style={styles.field}><Text style={styles.label}>Period:</Text> {edu.startDate} - {edu.endDate}</Text>
                <Text style={styles.field}><Text style={styles.label}>Description:</Text> {edu.description}</Text>
              </View>
            ))}
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.field}>{cv.skills.join(', ')}</Text>
            {!isWizard && (
              <View style={styles.buttonRow}>
                <View style={[styles.buttonWrapper, { flex: 1, marginRight: 8 }]}> 
                  <Button title="Back" onPress={() => navigation.goBack()} color={isDark ? '#888' : '#ccc'} />
                </View>
                <View style={[styles.buttonWrapper, { flex: 1, marginLeft: 8 }]}> 
                  <Button
                    title="Next: Choose Template"
                    onPress={() => setShowTemplates(true)}
                    color={isDark ? '#4F8EF7' : '#1976D2'}
                  />
                </View>
              </View>
            )}
          </ScrollView>
        ) : (
          <>
            <Text style={styles.title}>Choose a CV Template</Text>
            <FlatList
              data={TEMPLATES}
              renderItem={renderTemplate}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.templatesList}
            />
            <View style={styles.buttonRow}>
              <View style={[styles.buttonWrapper, { flex: 1, marginRight: 8 }]}> 
                <Button title="Back" onPress={() => setShowTemplates(false)} color={isDark ? '#888' : '#ccc'} />
              </View>
              <View style={[styles.buttonWrapper, { flex: 1, marginLeft: 8 }]}> 
                <Button
                  title="Generate PDF"
                  onPress={handleGeneratePDF}
                  color={isDark ? '#4F8EF7' : '#1976D2'}
                  disabled={!selectedTemplate}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: isDark ? '#181A20' : '#f2f4f8',
  },
  card: {
    backgroundColor: isDark ? '#23262F' : '#fff',
    borderRadius: 16,
    padding: 32,
    shadowColor: isDark ? '#000' : '#aaa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginVertical: 32,
    width: '100%',
    maxWidth: 480,
    minHeight: 420,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: isDark ? '#fff' : '#222',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 6,
    color: isDark ? '#4F8EF7' : '#1976D2',
  },
  field: {
    fontSize: 15,
    color: isDark ? '#eee' : '#222',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#222',
  },
  subBlock: {
    marginBottom: 8,
    marginLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: isDark ? '#4F8EF7' : '#1976D2',
    paddingLeft: 8,
  },
  templatesList: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 16,
  },
  templateCard: {
    width: 140,
    height: 180,
    backgroundColor: isDark ? '#181A20' : '#f7f9fa',
    borderRadius: 12,
    marginHorizontal: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: isDark ? '#000' : '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedTemplate: {
    borderColor: isDark ? '#4F8EF7' : '#1976D2',
    shadowOpacity: 0.18,
    elevation: 4,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#222',
    marginBottom: 8,
  },
  selectedLabel: {
    color: isDark ? '#4F8EF7' : '#1976D2',
    fontWeight: 'bold',
    marginTop: 8,
  },
  templateDesc: {
    fontSize: 14,
    color: isDark ? '#aaa' : '#555',
    textAlign: 'center',
    marginBottom: 12,
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

export default ReviewGenerateScreen; 