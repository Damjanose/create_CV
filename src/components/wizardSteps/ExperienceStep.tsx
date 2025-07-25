import React from "react";
import {
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface Experience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceStepProps {
  experience: Experience[];
  setExperience: (cb: (prev: Experience[]) => Experience[]) => void;
  styles: { [key: string]: StyleProp<ViewStyle | TextStyle> };
  isDark: boolean;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({
  experience,
  setExperience,
  styles,
  isDark,
}) => (
  <View style={{ padding: 24 }}>
    <Text style={styles.title}>Experience</Text>
    {experience.map((exp, idx) => (
      <View
        key={idx}
        style={{
          marginBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#333" : "#EEE",
          paddingBottom: 16,
        }}
      >
        <Text style={styles.label}>Job Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Job Title"
          value={exp.jobTitle}
          onChangeText={(jobTitle) => {
            setExperience((prev) => {
              const newExp = [...prev];
              newExp[idx] = { ...newExp[idx], jobTitle };
              return newExp;
            });
          }}
        />
        <Text style={styles.label}>Company</Text>
        <TextInput
          style={styles.input}
          placeholder="Company"
          value={exp.company}
          onChangeText={(company) => {
            setExperience((prev) => {
              const newExp = [...prev];
              newExp[idx] = { ...newExp[idx], company };
              return newExp;
            });
          }}
        />
        <Text style={styles.label}>Start Date</Text>
        <TextInput
          style={styles.input}
          placeholder="Start Date"
          value={exp.startDate}
          onChangeText={(startDate) => {
            setExperience((prev) => {
              const newExp = [...prev];
              newExp[idx] = { ...newExp[idx], startDate };
              return newExp;
            });
          }}
        />
        <Text style={styles.label}>End Date</Text>
        <TextInput
          style={styles.input}
          placeholder="End Date"
          value={exp.endDate}
          onChangeText={(endDate) => {
            setExperience((prev) => {
              const newExp = [...prev];
              newExp[idx] = { ...newExp[idx], endDate };
              return newExp;
            });
          }}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Description"
          value={exp.description}
          onChangeText={(description) => {
            setExperience((prev) => {
              const newExp = [...prev];
              newExp[idx] = { ...newExp[idx], description };
              return newExp;
            });
          }}
          multiline
        />
        <TouchableOpacity
          style={{
            marginTop: 8,
            alignSelf: "flex-end",
            backgroundColor: "#E53935",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
          }}
          onPress={() =>
            setExperience((prev) => prev.filter((_, i) => i !== idx))
          }
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Remove</Text>
        </TouchableOpacity>
      </View>
    ))}
    <TouchableOpacity
      style={{
        marginTop: 8,
        alignSelf: "flex-start",
        backgroundColor: isDark ? "#4F8EF7" : "#1976D2",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
      }}
      onPress={() =>
        setExperience((prev) => [
          ...prev,
          {
            jobTitle: "",
            company: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ])
      }
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>
        + Add Experience
      </Text>
    </TouchableOpacity>
  </View>
);

export default ExperienceStep;
