import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface AboutMe {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  image?: string;
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

const ModernTemplate: React.FC<Props> = ({ aboutMe, experience, education, skills }) => {
  return (
    <View style={styles.outer}>
      <View style={styles.sidebar} />
      <View style={styles.container}>
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Image
            source={aboutMe.image ? { uri: aboutMe.image } : require('../../assets/images/user.png')}
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
              <Text style={styles.itemTitle}>{exp.jobTitle} <Text style={styles.at}>@</Text> {exp.company}</Text>
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
          <View style={styles.skillsRow}>
            {skills.map((skill, i) => (
              <View key={i} style={styles.skillPill}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    flexDirection: 'row',
    backgroundColor: '#f7f9fa',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sidebar: {
    width: 16,
    backgroundColor: '#1976D2',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    color: '#555',
    marginBottom: 18,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 6,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  item: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  at: {
    color: '#1976D2',
    fontWeight: 'bold',
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
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  skillPill: {
    backgroundColor: '#e3eafc',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  skillText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
});

export default ModernTemplate; 