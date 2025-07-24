import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface AboutMe {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  image?: string;
  imageBase64?: string;
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

const MinimalTemplate: React.FC<Props> = ({ aboutMe, experience, education, skills }) => {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <Image
          source={getImageSource(aboutMe)}
          style={styles.profileImage}
        />
      </View>
      <Text style={styles.name}>{aboutMe.name}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    backgroundColor: '#fafbfc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  name: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
    letterSpacing: 0.5,
  },
  contact: {
    fontSize: 13,
    color: '#888',
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#b0b0b0',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  item: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  itemPeriod: {
    fontSize: 12,
    color: '#bbb',
    marginBottom: 2,
  },
  text: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
});

export default MinimalTemplate; 