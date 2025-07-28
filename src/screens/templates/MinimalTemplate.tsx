import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface AboutMe {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  image?: string;
  imageBase64?: string;
  languages?: { name: string; level: number }[];
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
  cvName: string;
  aboutMe: AboutMe;
  experience: Experience[];
  education: Education[];
  skills: string[];
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

const getImageSource = (aboutMe: AboutMe) => {
  if (aboutMe.imageBase64) {
    return { uri: `data:image/jpeg;base64,${aboutMe.imageBase64}` };
  } else if (aboutMe.image) {
    return { uri: aboutMe.image };
  } else {
    return require("../../assets/images/user.png");
  }
};

const MinimalTemplate: React.FC<Props> = ({
  aboutMe,
  experience,
  education,
  skills,
  contact,
  address,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.a4}>
        <View style={styles.header}>
          <Image source={getImageSource(aboutMe)} style={styles.avatar} />
          <Text style={styles.name}>
            {contact.name} {contact.lastname}
          </Text>
          <Text style={styles.title}>{aboutMe.summary}</Text>
          <Text style={styles.contact}>
            {address.address1}, {address.cityName}, {address.countryName}
          </Text>
          <Text style={styles.contact}>{contact.phone}</Text>
          <Text style={styles.contact}>{contact.email}</Text>
        </View>

        <View style={styles.row}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((s, i) => (
              <Text key={i} style={styles.text}>
                • {s}
              </Text>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
              Languages
            </Text>
            {(aboutMe.languages || []).map((l, i) => (
              <Text key={i} style={styles.text}>
                {l.name} – {Math.round(l.level * 100)}%
              </Text>
            ))}
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.headerTitle}>Experience</Text>
            <View style={styles.divider} />
            {experience.map((exp, i) => (
              <View key={i} style={styles.block}>
                <Text style={styles.blockTitle}>{exp.jobTitle}</Text>
                <Text style={styles.meta}>
                  {exp.company} ({exp.startDate} – {exp.endDate})
                </Text>
                <Text style={styles.bullet}>• {exp.description}</Text>
              </View>
            ))}

            <Text style={styles.headerTitle}>Education</Text>
            <View style={styles.divider} />
            {education.map((edu, i) => (
              <View key={i} style={styles.block}>
                <Text style={styles.blockTitle}>{edu.degree}</Text>
                <Text style={styles.meta}>
                  {edu.school} ({edu.startDate} – {edu.endDate})
                </Text>
                <Text style={styles.bullet}>• {edu.description}</Text>
              </View>
            ))}
          </View>
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
  header: {
    backgroundColor: "#3DF8C8",
    padding: 10,
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEE",
    marginBottom: 5,
  },
  name: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#000",
  },
  title: {
    fontSize: 6,
    color: "#111",
    fontWeight: "600",
    marginVertical: 2,
    textAlign: "center",
  },
  contact: {
    fontSize: 5.5,
    color: "#222",
    marginBottom: 1,
  },
  sidebar: {
    width: 90,
    backgroundColor: "#f5f5f5",
    padding: 5,
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#111",
    fontSize: 6.5,
    marginTop: 7,
    marginBottom: 3,
  },
  text: {
    color: "#333",
    fontSize: 5.5,
    marginBottom: 2,
  },
  content: {
    flex: 1,
    padding: 8,
  },
  headerTitle: {
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

export default MinimalTemplate;
