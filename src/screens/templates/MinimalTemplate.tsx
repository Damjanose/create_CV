import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

interface AboutMe {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  image?: string;
  imageBase64?: string;
  languages?: string[];
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
  const screenWidth = useWindowDimensions().width;
  const A4_WIDTH = 794;
  const scale = screenWidth / A4_WIDTH;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        flexGrow: 1,
      }}
      minimumZoomScale={scale}
      maximumZoomScale={2}
      pinchGestureEnabled
      scrollEnabled
    >
      <View style={[styles.page, { transform: [{ scale }] }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerImageWrapper}>
            <Image
              source={getImageSource(aboutMe)}
              style={styles.headerImage}
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {contact.name} {contact.lastname}
            </Text>
            <Text style={styles.title}>{aboutMe.summary}</Text>
            <Text style={styles.contact}>
              {address.address1}, {address.cityName}, {address.countryName}
            </Text>
            <Text style={styles.contact}>
              {contact.phone} |
              <Text style={styles.link}>{contact.email}</Text>
            </Text>
          </View>
        </View>

        {/* BODY */}
        <View style={styles.body}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>Skills</Text>
            {skills.map((s, i) => (
              <Text key={i} style={styles.sidebarItem}>
                {s}
              </Text>
            ))}
            <Text style={[styles.sidebarTitle, { marginTop: 24 }]}>
              Languages
            </Text>
            {(aboutMe.languages || []).map((l, i) => (
              <Text key={i} style={styles.sidebarItem}>
                {l}
              </Text>
            ))}
          </View>

          {/* Main */}
          <View style={styles.main}>
            <Section title="Profile">
              <Text style={styles.mainText}>{aboutMe.summary}</Text>
            </Section>

            <Section title="Employment History">
              {experience.map((exp, i) => (
                <View key={i} style={styles.item}>
                  <Text style={styles.itemTitle}>
                    {exp.jobTitle} at {exp.company}
                  </Text>
                  <Text style={styles.itemPeriod}>
                    {exp.startDate} – {exp.endDate}
                  </Text>
                  <Text style={styles.mainText}>{exp.description}</Text>
                </View>
              ))}
            </Section>

            <Section title="Education">
              {education.map((edu, i) => (
                <View key={i} style={styles.item}>
                  <Text style={styles.itemTitle}>
                    {edu.degree}, {edu.school}
                  </Text>
                  <Text style={styles.itemPeriod}>
                    {edu.startDate} – {edu.endDate}
                  </Text>
                  <Text style={styles.mainText}>{edu.description}</Text>
                </View>
              ))}
            </Section>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const Section: React.FC<React.PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <View style={{ marginBottom: 28 }}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  page: {
    width: 794,
    minHeight: 1123,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#3DF8C8",
    padding: 24,
    alignItems: "center",
  },
  headerImageWrapper: {
    width: 100,
    height: 100,
    marginRight: 24,
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EEE",
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 4,
    color: "#222",
  },
  contact: {
    fontSize: 12,
    color: "#111",
    lineHeight: 18,
  },
  link: {
    textDecorationLine: "underline",
    color: "#000",
  },
  body: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sidebar: {
    width: 120,
  },
  sidebarTitle: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#444",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  sidebarItem: {
    fontSize: 13,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    color: "#555",
  },
  main: {
    flex: 1,
    paddingLeft: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mainText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 20,
    marginBottom: 16,
  },
  item: {
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  itemPeriod: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
});

export default MinimalTemplate;
