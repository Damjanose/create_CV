import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

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

interface Props {
  cvName: string;
  aboutMeText: string;
  imageUri?: string;
  hobbies: string[];
  name: string;
  lastname: string;
  jobTitle: string;
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
  experience: TimelineEntry[];
  education: EduEntry[];
  skills: string[];
  languages: { name: string; level: number }[];
}

const ClassicTemplate: React.FC<Props> = ({
  aboutMeText,
  imageUri,
  hobbies,
  name,
  lastname,
  jobTitle,
  contact,
  address,
  experience,
  education,
  skills,
  languages,
}) => (
  <ScrollView contentContainerStyle={styles.scroll}>
    <View style={styles.a4}>
      <View style={styles.row}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require("../../assets/images/user.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {name} {lastname}
          </Text>
          <Text style={styles.jobTitle}>{jobTitle}</Text>

          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.text}>{contact.email}</Text>
          <Text style={styles.text}>{contact.phone}</Text>
          <Text style={styles.text}>
            {address.cityName}, {address.countryName}
          </Text>

          <Text style={styles.sectionTitle}>Skills</Text>
          {skills.map((s, i) => (
            <Text key={i} style={styles.text}>
              • {s}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Languages</Text>
          {languages.map((l, i) => (
            <Text key={i} style={styles.text}>
              {l.name} – {Math.round(l.level * 100)}%
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Hobbies</Text>
          {hobbies.map((h, i) => (
            <Text key={i} style={styles.text}>
              • {h}
            </Text>
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.header}>Profile</Text>
          <View style={styles.divider} />
          <Text style={styles.paragraph}>{aboutMeText}</Text>

          <Text style={styles.header}>Work Experience</Text>
          <View style={styles.divider} />
          {experience.map((exp, i) => (
            <View key={i} style={styles.block}>
              <Text style={styles.blockTitle}>{exp.position}</Text>
              <Text style={styles.meta}>
                {exp.company}, {exp.location} ({exp.startDate} – {exp.endDate})
              </Text>
              {exp.bullets.map((b, j) => (
                <Text key={j} style={styles.bullet}>
                  • {b}
                </Text>
              ))}
            </View>
          ))}

          <Text style={styles.header}>Education</Text>
          <View style={styles.divider} />
          {education.map((edu, i) => (
            <View key={i} style={styles.block}>
              <Text style={styles.blockTitle}>{edu.degree}</Text>
              <Text style={styles.meta}>
                {edu.institution}, {edu.location} ({edu.year})
              </Text>
              {edu.bullets.map((b, j) => (
                <Text key={j} style={styles.bullet}>
                  • {b}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#bbb",
  },
  a4: {
    width: 300,
    aspectRatio: 1 / 1.414, // true A4 ratio
    backgroundColor: "#fff",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    flex: 1,
  },
  sidebar: {
    width: 90,
    backgroundColor: "#232323",
    padding: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEE",
    alignSelf: "center",
    marginBottom: 5,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 8,
    textAlign: "center",
  },
  jobTitle: {
    color: "#ccc",
    fontSize: 6,
    textAlign: "center",
    marginBottom: 6,
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#fff",
    fontSize: 6.5,
    marginTop: 7,
    marginBottom: 3,
  },
  text: {
    color: "#ddd",
    fontSize: 5.5,
    marginBottom: 2,
  },
  content: {
    flex: 1,
    padding: 8,
  },
  header: {
    fontSize: 9,
    fontWeight: "700",
    marginBottom: 4,
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 6,
    color: "#333",
    lineHeight: 9,
    marginBottom: 8,
  },
  block: {
    marginBottom: 8,
  },
  blockTitle: {
    fontSize: 7,
    fontWeight: "600",
    color: "#000",
  },
  meta: {
    fontSize: 5.5,
    color: "#555",
    marginBottom: 2,
  },
  bullet: {
    fontSize: 6,
    color: "#333",
    marginLeft: 5,
    marginBottom: 2,
  },
});

export default ClassicTemplate;
