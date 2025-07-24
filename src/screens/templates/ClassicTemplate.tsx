import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

interface AboutMe {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  image?: string; // Added image property
  imageBase64?: string; // Added imageBase64 property
}
interface Experience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}
interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Props {
  aboutMe: AboutMe;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

const getImageSource = (aboutMe: AboutMe) => {
  if (aboutMe.imageBase64) {
    return { uri: `data:image/jpeg;base64,${aboutMe.imageBase64}` };
  } else if (aboutMe.image) {
    return { uri: aboutMe.image };
  } else {
    return require('../../assets/images/user.png');
  }
};

const ClassicTemplate: React.FC<Props> = ({ aboutMe, experience, education, skills }) => {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={getImageSource(aboutMe)}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{aboutMe.name}</Text>
      </View>
      <Text style={styles.contact}>{aboutMe.email} | {aboutMe.phone} | {aboutMe.address}</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.text}>{aboutMe.summary}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        {experience.map((exp, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.itemTitle}>{exp.jobTitle} at {exp.company}</Text>
            <Text style={styles.itemPeriod}>{exp.startDate} - {exp.endDate}</Text>
            <Text style={styles.text}>{exp.description}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {education.map((edu, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.itemTitle}>{edu.degree}, {edu.school}</Text>
            <Text style={styles.itemPeriod}>{edu.startDate} - {edu.endDate}</Text>
            <Text style={styles.text}>{edu.description}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.text}>{skills.join(', ')}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  contact: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  section: {
    marginBottom: 18,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 6,
  },
  item: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  itemPeriod: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    color: '#222',
  },
});

export default ClassicTemplate; 