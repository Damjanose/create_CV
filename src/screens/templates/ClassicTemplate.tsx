// ClassicTemplate.tsx
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LinkItem {
  label: string;
  url: string;
}
interface Reference {
  name: string;
  title: string;
  phone: string;
  email: string;
}
interface TimelineEntry {
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  position: string;
  bullets: string[];
}
interface EduEntry {
  institution: string;
  location: string;
  year: string;
  degree: string;
  bullets: string[];
}
interface LevelItem {
  label: string;
  level: number; // 0 → 1
}

interface Props {
  // left sidebar
  aboutMeText: string;
  imageUri?: string;
  links: LinkItem[];
  reference: Reference;
  hobbies: string[];
  // top‐right header
  name: string;
  jobTitle: string;
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  // timeline
  experience: TimelineEntry[];
  education: EduEntry[];
  // bars
  skills: string[];
  languages: LevelItem[];
}

const ClassicTemplate: React.FC<Props> = ({
  // sidebar
  aboutMeText,
  imageUri,
  links,
  reference,
  hobbies,
  // header
  name,
  jobTitle,
  contact,
  // timeline
  experience,
  education,
  // bars
  skills,
  languages,
}) => (
  <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.row}>
      {/* ============ LEFT SIDEBAR ============ */}
      <View style={styles.sidebar}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : require('../../assets/images/user.png')
          }
          style={styles.avatar}
        />

        <Text style={styles.sidebarHeader}>About Me</Text>
        <Text style={styles.sidebarText}>{aboutMeText}</Text>
        <View style={styles.divider} />

        <Text style={styles.sidebarHeader}>Links</Text>
        {links.map((l, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => Linking.openURL(l.url)}
          >
            <Text style={[styles.sidebarText, styles.linkText]}>
              {l.label}: {l.url}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={styles.divider} />

        <Text style={styles.sidebarHeader}>Reference</Text>
        <Text style={styles.sidebarText}>{reference.name}</Text>
        <Text style={styles.sidebarText}>{reference.title}</Text>
        <Text style={styles.sidebarText}>T: {reference.phone}</Text>
        <Text style={styles.sidebarText}>E: {reference.email}</Text>
        <View style={styles.divider} />

        <Text style={styles.sidebarHeader}>Hobbies</Text>
        {hobbies.map((h, i) => (
          <Text key={i} style={styles.sidebarBullet}>
            • {h}
          </Text>
        ))}
      </View>

      {/* ============ RIGHT MAIN ============ */}
      <View style={styles.main}>
        {/* — Header row: name/title + contacts */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.mainName}>{name}</Text>
            <Text style={styles.mainTitle}>{jobTitle}</Text>
          </View>
          <View>
            <ContactRow icon="map-marker" text={contact.address} />
            <ContactRow icon="phone" text={contact.phone} />
            <ContactRow icon="email" text={contact.email} />
          </View>
        </View>

        {/* — Work Experience */}
        <Text style={styles.sectionHeader}>Work Experience</Text>
        <View style={styles.sectionDivider} />
        {experience.map((exp, i) => (
          <View key={i} style={styles.timeline}>
            <View style={styles.timelineLeft}>
              <Text style={styles.timelineCompany}>{exp.company}</Text>
              <Text style={styles.timelineLocation}>{exp.location}</Text>
              <Text style={styles.timelineDate}>
                {exp.startDate} – {exp.endDate}
              </Text>
            </View>
            <View style={styles.timelineCenter}>
              <View style={styles.timelineDot} />
              {i < experience.length - 1 && (
                <View style={styles.timelineLine} />
              )}
            </View>
            <View style={styles.timelineRight}>
              <Text style={styles.timelineRole}>{exp.position}</Text>
              {exp.bullets.map((b, j) => (
                <Text key={j} style={styles.timelineBullet}>
                  • {b}
                </Text>
              ))}
            </View>
          </View>
        ))}

        {/* — Education */}
        <Text style={[styles.sectionHeader, { marginTop: 32 }]}>
          Education
        </Text>
        <View style={styles.sectionDivider} />
        {education.map((edu, i) => (
          <View key={i} style={styles.timeline}>
            <View style={styles.timelineLeft}>
              <Text style={styles.timelineCompany}>{edu.institution}</Text>
              <Text style={styles.timelineLocation}>{edu.location}</Text>
              <Text style={styles.timelineDate}>{edu.year}</Text>
            </View>
            <View style={styles.timelineCenter}>
              <View style={styles.timelineDot} />
              {i < education.length - 1 && (
                <View style={styles.timelineLine} />
              )}
            </View>
            <View style={styles.timelineRight}>
              <Text style={styles.timelineRole}>{edu.degree}</Text>
              {edu.bullets.map((b, j) => (
                <Text key={j} style={styles.timelineBullet}>
                  • {b}
                </Text>
              ))}
            </View>
          </View>
        ))}

        {/* — Skills */}
        <Text style={[styles.sectionHeader, { marginTop: 32 }]}>
          Skills
        </Text>
        <View style={styles.sectionDivider} />
        <View style={styles.barGrid}>
          {skills.map((s, i) => (
            <Bar key={i} label={s} />
          ))}
        </View>

        {/* — Languages */}
        <Text style={[styles.sectionHeader, { marginTop: 32 }]}>
          Languages
        </Text>
        <View style={styles.sectionDivider} />
        <View style={styles.barGrid}>
          {languages.map((l, i) => (
            <Bar key={i} label={l.label} level={l.level} />
          ))}
        </View>
      </View>
    </View>
  </ScrollView>
);

// — CONTACT ROW
const ContactRow = ({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) => (
  <View style={styles.contactRow}>
    <Icon
      name={icon}
      size={16}
      color="#333"
      style={styles.contactIcon}
    />
    <Text style={styles.contactText}>{text}</Text>
  </View>
);

// — HORIZONTAL BAR (for Skills & Languages)
const Bar = ({
  label,
  level = 1,
}: {
  label: string;
  level?: number;
}) => (
  <View style={styles.barWrapper}>
    <Text style={styles.barLabel}>{label}</Text>
    <View style={styles.barBackground}>
      <View style={[styles.barFill, { flex: level }]} />
      <View style={{ flex: 1 - level }} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FFF' },
  row: { flexDirection: 'row' },

  // Sidebar
  sidebar: {
    width: 200,
    backgroundColor: '#424242',
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEE',
    alignSelf: 'center',
    marginBottom: 24,
  },
  sidebarHeader: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  sidebarText: {
    color: '#DDD',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: '#555',
    marginVertical: 16,
  },
  sidebarBullet: {
    color: '#DDD',
    fontSize: 12,
    marginBottom: 6,
  },

  // Main
  main: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  mainName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginTop: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    fontSize: 12,
    color: '#333',
  },

  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#CCC',
    marginBottom: 16,
  },

  // Timeline
  timeline: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    width: 100,
  },
  timelineCompany: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timelineLocation: {
    fontSize: 12,
    color: '#888',
    marginVertical: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: '#888',
  },
  timelineCenter: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginVertical: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#CCC',
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 16,
  },
  timelineRole: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  timelineBullet: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },

  // Bars for Skills & Languages
  barGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  barWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  barLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  barBackground: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: '#EEE',
    borderRadius: 2,
  },
  barFill: {
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
  },
});

export default ClassicTemplate;
