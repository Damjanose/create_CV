// ModernTemplate.tsx
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AboutMe {
  name: string;            // e.g. "John Doe"
  role: string;            // e.g. "Financial Analyst"
  summary: string;
  email: string;
  location: string;
  phone: string;
  imageUri?: string;
}

interface Language {
  label: string;
  level: number;  // 0–1
}

interface EducationEntry {
  period: string;     // e.g. "20XX–20XX"
  location: string;   // e.g. "NY-USA"
  degree: string;     // e.g. "Master of Business Administration"
  school: string;     // e.g. "NYU"
}

interface SkillSections {
  hard: string[];     // e.g. ["Financial Modeling","Excel",…]
  soft: string[];     // e.g. ["Analytical thinking","Communication",…]
}

interface ExperienceEntry {
  period: string;     // e.g. "Nov. 20XX – Jul. 20XX"
  company: string;    // e.g. "ABC CORPORATION"
  role: string;       // e.g. "Senior Financial Analyst"
  bullets: string[];  // each bullet item
}

interface Props {
  cvName: string;
  aboutMe: AboutMe;
  languages: { label: string; level: number }[];
  education: EducationEntry[];
  skills: SkillSections;
  experience: ExperienceEntry[];
  contact: {
    name: string;
    lastname: string;
    phone: string;
    email: string;
  };
  address: {
    countryName: string;
    cityName: string;
    address1: string;
    address2: string;
  };
}

const ModernTemplate: React.FC<Props> = ({
  cvName,
  aboutMe,
  languages,
  education,
  skills,
  experience,
  contact,
  address,
}) => {
  // split name into first + last
  const parts = aboutMe.name.split(' ');
  const first = parts.shift()!;
  const last = parts.join(' ');
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Top: name/subtitle/photo */}
      <View style={styles.topRow}>
        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text style={styles.nameFirst}>{first}</Text>
            <Text style={styles.nameLast}> {last}</Text>
          </View>
          <Text style={styles.role}>{aboutMe.role}</Text>
          <Text style={styles.summary}>{aboutMe.summary}</Text>
        </View>
        <Image
          source={
            aboutMe.imageUri
              ? { uri: aboutMe.imageUri }
              : require('../../assets/images/user.png')
          }
          style={styles.avatar}
        />
      </View>

      {/* Contact icons */}
      <View style={styles.contactRow}>
        <View style={styles.contactItem}>
          <Icon name="email-outline" size={16} />
          <Text style={styles.contactText}>{aboutMe.email}</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon name="map-marker-outline" size={16} />
          <Text style={styles.contactText}>{aboutMe.location}</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon name="phone-outline" size={16} />
          <Text style={styles.contactText}>{aboutMe.phone}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Languages */}
      <Text style={styles.sectionHeader}>Languages</Text>
      <View style={styles.languagesRow}>
        {languages.map((lang, i) => (
          <View key={i} style={styles.languageItem}>
            <Text style={styles.languageLabel}>{lang.label}</Text>
            <View style={styles.languageBar}>
              <View style={[styles.languageBarFill, { flex: lang.level }]} />
              <View style={{ flex: 1 - lang.level }} />
            </View>
          </View>
        ))}
      </View>

      {/* Education */}
      <Text style={styles.sectionHeader}>Education</Text>
      {education.map((edu, i) => (
        <View key={i} style={styles.eduRow}>
          <View style={styles.eduLeft}>
            <Text style={styles.eduPeriod}>{edu.period}</Text>
            <Text style={styles.eduLocation}>{edu.location}</Text>
          </View>
          <View style={styles.eduRight}>
            <Text style={styles.eduDegree}>{edu.degree}</Text>
            <Text style={styles.eduSchool}>{edu.school}</Text>
          </View>
        </View>
      ))}

      {/* Skills */}
      <Text style={styles.sectionHeader}>Skills</Text>
      <Text style={styles.skillLine}>
        <Text style={styles.skillLabel}>Hard: </Text>
        <Text style={styles.skillText}>{skills.hard.join(', ')}</Text>
      </Text>
      <Text style={styles.skillLine}>
        <Text style={styles.skillLabel}>Soft: </Text>
        <Text style={styles.skillText}>{skills.soft.join(', ')}</Text>
      </Text>

      {/* Professional Experience */}
      <Text style={styles.sectionHeader}>Professional Experience</Text>
      {experience.map((exp, i) => (
        <View key={i} style={styles.expBlock}>
          <Text style={styles.expLine}>
            <Text style={styles.expPeriod}>{exp.period}</Text>{' '}
            <Text style={styles.expCompany}>{exp.company}</Text>
          </Text>
          <Text style={styles.expRole}>{exp.role}</Text>
          {exp.bullets.map((b, j) => (
            <Text key={j} style={styles.expBullet}>
              • {b}
            </Text>
          ))}
        </View>
      ))}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  nameBlock: {
    flex: 1,
    paddingRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  nameFirst: {
    fontSize: 28,
    fontFamily: 'serif',
    color: '#666',
  },
  nameLast: {
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#000',
  },
  role: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  summary: {
    fontSize: 13,
    color: '#222',
    lineHeight: 20,
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  contactText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#333',
  },
  divider: {
    height: 2,
    backgroundColor: '#000',
    marginVertical: 12,
  },
  sectionHeader: {
    backgroundColor: '#DDD',
    alignSelf: 'stretch',
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },

  /* Languages */
  languagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  languageItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  languageLabel: {
    fontSize: 12,
    marginBottom: 4,
    color: '#333',
  },
  languageBar: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: '#EEE',
    borderRadius: 2,
  },
  languageBarFill: {
    backgroundColor: '#333',
    borderRadius: 2,
  },

  /* Education */
  eduRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  eduLeft: {
    width: 80,
  },
  eduPeriod: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  eduLocation: {
    fontSize: 12,
    color: '#555',
  },
  eduRight: {
    flex: 1,
    paddingLeft: 12,
  },
  eduDegree: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  eduSchool: {
    fontSize: 12,
    color: '#333',
  },

  /* Skills */
  skillLine: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  skillLabel: {
    fontWeight: '600',
    fontSize: 12,
    color: '#333',
  },
  skillText: {
    fontSize: 12,
    color: '#555',
  },

  /* Experience */
  expBlock: {
    marginBottom: 16,
  },
  expLine: {
    flexDirection: 'row',
    fontSize: 12,
    marginBottom: 4,
  },
  expPeriod: {
    fontSize: 12,
    color: '#333',
  },
  expCompany: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  expRole: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 4,
  },
  expBullet: {
    fontSize: 12,
    color: '#333',
    marginLeft: 8,
    marginBottom: 2,
  },
});

export default ModernTemplate;
