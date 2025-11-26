import React from "react";
import {
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationStepProps {
  education: Education[];
  setEducation: (cb: (prev: Education[]) => Education[]) => void;
  styles: { [key: string]: StyleProp<ViewStyle | TextStyle> };
  isDark: boolean;
}

const EducationStep: React.FC<EducationStepProps> = ({
  education,
  setEducation,
  styles,
  isDark,
}) => (
  <View style={{ padding: 24 }}>
    <Text style={styles.title}>Education</Text>
    {education.map((edu, idx) => (
      <View key={idx} style={formStyles.educationCard}>
        <View style={formStyles.cardHeader}>
          <MaterialCommunityIcons
            name="school"
            size={24}
            color={isDark ? "#4F8EF7" : "#1976D2"}
          />
          <Text style={formStyles.cardNumber}>Education #{idx + 1}</Text>
        </View>
        <View style={formStyles.inputContainer}>
          <MaterialCommunityIcons
            name="school-outline"
            size={20}
            color={isDark ? "#4F8EF7" : "#1976D2"}
            style={formStyles.inputIcon}
          />
          <TextInput
            style={[styles.input, formStyles.input]}
            placeholder="School"
            value={edu.school}
            onChangeText={(school) => {
              setEducation((prev) => {
                const newEdu = [...prev];
                newEdu[idx] = { ...newEdu[idx], school };
                return newEdu;
              });
            }}
            placeholderTextColor={isDark ? "#888" : "#999"}
          />
        </View>
        <View style={formStyles.inputContainer}>
          <MaterialCommunityIcons
            name="certificate"
            size={20}
            color={isDark ? "#4F8EF7" : "#1976D2"}
            style={formStyles.inputIcon}
          />
          <TextInput
            style={[styles.input, formStyles.input]}
            placeholder="Degree"
            value={edu.degree}
            onChangeText={(degree) => {
              setEducation((prev) => {
                const newEdu = [...prev];
                newEdu[idx] = { ...newEdu[idx], degree };
                return newEdu;
              });
            }}
            placeholderTextColor={isDark ? "#888" : "#999"}
          />
        </View>
        <View style={formStyles.dateRow}>
          <View style={[formStyles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <MaterialCommunityIcons
              name="calendar-start"
              size={20}
              color={isDark ? "#4F8EF7" : "#1976D2"}
              style={formStyles.inputIcon}
            />
            <TextInput
              style={[styles.input, formStyles.input]}
              placeholder="Start Date"
              value={edu.startDate}
              onChangeText={(startDate) => {
                setEducation((prev) => {
                  const newEdu = [...prev];
                  newEdu[idx] = { ...newEdu[idx], startDate };
                  return newEdu;
                });
              }}
              placeholderTextColor={isDark ? "#888" : "#999"}
            />
          </View>
          <View style={[formStyles.inputContainer, { flex: 1 }]}>
            <MaterialCommunityIcons
              name="calendar-end"
              size={20}
              color={isDark ? "#4F8EF7" : "#1976D2"}
              style={formStyles.inputIcon}
            />
            <TextInput
              style={[styles.input, formStyles.input]}
              placeholder="End Date"
              value={edu.endDate}
              onChangeText={(endDate) => {
                setEducation((prev) => {
                  const newEdu = [...prev];
                  newEdu[idx] = { ...newEdu[idx], endDate };
                  return newEdu;
                });
              }}
              placeholderTextColor={isDark ? "#888" : "#999"}
            />
          </View>
        </View>
        <View style={formStyles.inputContainer}>
          <MaterialCommunityIcons
            name="text"
            size={20}
            color={isDark ? "#4F8EF7" : "#1976D2"}
            style={formStyles.inputIcon}
          />
          <TextInput
            style={[styles.input, formStyles.textArea]}
            placeholder="Description"
            value={edu.description}
            onChangeText={(description) => {
              setEducation((prev) => {
                const newEdu = [...prev];
                newEdu[idx] = { ...newEdu[idx], description };
                return newEdu;
              });
            }}
            multiline
            textAlignVertical="top"
            placeholderTextColor={isDark ? "#888" : "#999"}
          />
        </View>
        <TouchableOpacity
          style={formStyles.removeButton}
          onPress={() =>
            setEducation((prev) => prev.filter((_, i) => i !== idx))
          }
        >
          <MaterialCommunityIcons name="delete" size={18} color="#fff" />
          <Text style={formStyles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    ))}
    <TouchableOpacity
      style={[
        formStyles.addButton,
        { backgroundColor: isDark ? "#4F8EF7" : "#1976D2" },
      ]}
      onPress={() =>
        setEducation((prev) => [
          ...prev,
          {
            school: "",
            degree: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ])
      }
    >
      <MaterialCommunityIcons name="plus" size={20} color="#fff" />
      <Text style={formStyles.addButtonText}>Add Education</Text>
    </TouchableOpacity>
  </View>
);

const formStyles = StyleSheet.create({
  educationCard: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(79, 142, 247, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(79, 142, 247, 0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F8EF7",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    gap: 8,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#E53935",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginTop: 8,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default EducationStep;
