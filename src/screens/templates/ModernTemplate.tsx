// ModernTemplate.tsx
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface AboutMe {
  name: string;
  role: string;
  lastname: string;
  summary: string;
  email: string;
  location: string;
  phone: string;
  imageUri?: string;
}

interface Language {
  label: string;
  level: number;
}

interface EducationEntry {
  period: string;
  location: string;
  degree: string;
  school: string;
}

interface SkillSections {
  hard: string[];
  soft: string[];
}

interface ExperienceEntry {
  period: string;
  company: string;
  role: string;
  bullets: string[];
}

interface Props {
  cvName: string;
  aboutMe: AboutMe;
  languages: Language[];
  education: EducationEntry[];
  skills: SkillSections;
  experience: ExperienceEntry[];
}

const ModernTemplate: React.FC<Props> = ({
  aboutMe,
  languages,
  education,
  skills,
  experience,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.a4}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nameFirst}>{aboutMe.name}</Text>
              <Text style={styles.nameLast}>{aboutMe.lastname}</Text>
              <Text style={styles.role}>{aboutMe.role}</Text>
              <Text style={styles.summary}>{aboutMe.summary}</Text>
            </View>
            <Image
              source={
                aboutMe.imageUri
                  ? { uri: aboutMe.imageUri }
                  : require("../../assets/images/user.png")
              }
              style={styles.avatar}
            />
          </View>

          {/* Contact Row */}
          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <Icon name="email-outline" size={8} color="#333" />
              <Text style={styles.contactText}>{aboutMe.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="map-marker-outline" size={8} color="#333" />
              <Text style={styles.contactText}>{aboutMe.location}</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="phone-outline" size={8} color="#333" />
              <Text style={styles.contactText}>{aboutMe.phone}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Languages */}
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.languageRow}>
            {languages.map((lang, i) => (
              <View key={i} style={styles.languageItem}>
                <Text style={styles.languageLabel}>{lang.label}</Text>
                <View style={styles.languageBar}>
                  <View style={[styles.languageFill, { flex: lang.level }]} />
                  <View style={{ flex: 1 - lang.level }} />
                </View>
              </View>
            ))}
          </View>

          {/* Education */}
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((edu, i) => (
            <View key={i} style={styles.block}>
              <Text style={styles.blockTitle}>{edu.degree}</Text>
              <Text style={styles.meta}>
                {edu.school}, {edu.location} ({edu.period})
              </Text>
            </View>
          ))}

          {/* Skills */}
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.bullet}>
            <Text style={{ fontWeight: "600" }}>Hard:</Text>{" "}
            {skills.hard.join(", ")}
          </Text>
          <Text style={styles.bullet}>
            <Text style={{ fontWeight: "600" }}>Soft:</Text>{" "}
            {skills.soft.join(", ")}
          </Text>

          {/* Experience */}
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {experience.map((exp, i) => (
            <View key={i} style={styles.block}>
              <Text style={styles.blockTitle}>{exp.role}</Text>
              <Text style={styles.meta}>
                {exp.company} ({exp.period})
              </Text>
              {exp.bullets.map((b, j) => (
                <Text key={j} style={styles.bullet}>
                  • {b}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#bbb",
  },
  a4: {
    width: 300,
    aspectRatio: 1 / 1.414,
    backgroundColor: "#fff",
    borderRadius: 4,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 12,
  },
  headerTop: {
    flexDirection: "row",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginLeft: 8,
  },
  nameFirst: {
    fontSize: 10,
    color: "#666",
    fontFamily: "serif",
  },
  nameLast: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "serif",
  },
  role: {
    fontSize: 6,
    fontStyle: "italic",
    color: "#444",
    marginBottom: 4,
  },
  summary: {
    fontSize: 6,
    color: "#333",
    lineHeight: 9,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 6,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
  },
  contactText: {
    fontSize: 5,
    marginLeft: 2,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 7,
    fontWeight: "700",
    backgroundColor: "#ddd",
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginTop: 10,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  block: {
    marginBottom: 6,
  },
  blockTitle: {
    fontSize: 6.5,
    fontWeight: "600",
    color: "#111",
  },
  meta: {
    fontSize: 5.5,
    color: "#666",
    marginBottom: 2,
  },
  bullet: {
    fontSize: 5.5,
    color: "#333",
    marginLeft: 6,
    marginBottom: 2,
  },
  languageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  languageItem: {
    flex: 1,
    marginHorizontal: 3,
  },
  languageLabel: {
    fontSize: 5,
    marginBottom: 2,
    color: "#333",
  },
  languageBar: {
    flexDirection: "row",
    height: 3,
    backgroundColor: "#EEE",
    borderRadius: 2,
  },
  languageFill: {
    backgroundColor: "#333",
    borderRadius: 2,
  },
});

export default ModernTemplate;
