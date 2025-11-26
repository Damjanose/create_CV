import React, { useState } from "react";
import {
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface Experience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  ongoing?: boolean;
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
}) => {
  const [showStartPicker, setShowStartPicker] = useState<number | null>(null);
  const [showEndPicker, setShowEndPicker] = useState<number | null>(null);

  const formatDate = (dateString: string): Date => {
    if (dateString) {
      // Try to parse MM/YYYY format
      const parts = dateString.split("/");
      if (parts.length === 2) {
        const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[1], 10);
        if (!isNaN(month) && !isNaN(year)) {
          return new Date(year, month, 1);
        }
      }
      // Try to parse as standard date string
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return new Date();
  };

  const formatDateString = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${year}`;
  };

  const handleDateChange = (
    event: any,
    selectedDate: Date | undefined,
    index: number,
    type: "start" | "end"
  ) => {
    // On Android, always dismiss picker first
    if (Platform.OS === "android") {
      setShowStartPicker(null);
      setShowEndPicker(null);
      
      // On Android, if user cancelled, event.type will be 'dismissed'
      if (event.type === "dismissed" || !selectedDate) {
        return;
      }
    }

    if (selectedDate) {
      const dateString = formatDateString(selectedDate);
      setExperience((prev) => {
        const newExp = [...prev];
        if (type === "start") {
          newExp[index] = { ...newExp[index], startDate: dateString };
        } else {
          newExp[index] = { ...newExp[index], endDate: dateString };
        }
        return newExp;
      });
    }

    // On iOS, dismiss after selection
    if (Platform.OS === "ios") {
      if (type === "start") {
        setShowStartPicker(null);
      } else {
        setShowEndPicker(null);
      }
    }
  };

  return (
    <View style={formStyles.container}>
      <Text style={styles.title}>Work Experience</Text>

      {experience.map((exp, idx) => (
        <View
          key={idx}
          style={[
            formStyles.experienceCard,
            {
              backgroundColor: isDark ? "rgba(79, 142, 247, 0.08)" : "rgba(25, 118, 210, 0.04)",
              borderColor: isDark ? "rgba(79, 142, 247, 0.3)" : "rgba(25, 118, 210, 0.2)",
            },
          ]}
        >
          <View style={formStyles.cardHeader}>
            <View style={formStyles.cardHeaderLeft}>
              <View
                style={[
                  formStyles.cardIcon,
                  { backgroundColor: isDark ? "#4F8EF7" : "#1976D2" },
                ]}
              >
                <MaterialCommunityIcons name="briefcase" size={20} color="#fff" />
              </View>
              <Text style={formStyles.cardNumber}>Experience #{idx + 1}</Text>
            </View>
            <TouchableOpacity
              style={formStyles.removeButton}
              onPress={() =>
                setExperience((prev) => prev.filter((_, i) => i !== idx))
              }
            >
              <MaterialCommunityIcons name="delete-outline" size={22} color="#E53935" />
            </TouchableOpacity>
          </View>

          <View style={formStyles.inputRow}>
            <View style={[formStyles.inputContainer, { flex: 1 }]}>
              <MaterialCommunityIcons
                name="briefcase-outline"
                size={20}
                color={isDark ? "#4F8EF7" : "#1976D2"}
                style={formStyles.inputIcon}
              />
              <TextInput
                style={[styles.input, formStyles.input]}
                placeholder="Job Title"
                value={exp.jobTitle}
                onChangeText={(jobTitle) => {
                  setExperience((prev) => {
                    const newExp = [...prev];
                    newExp[idx] = { ...newExp[idx], jobTitle };
                    return newExp;
                  });
                }}
                placeholderTextColor={isDark ? "#888" : "#999"}
              />
            </View>
          </View>

          <View style={formStyles.inputRow}>
            <View style={[formStyles.inputContainer, { flex: 1 }]}>
              <MaterialCommunityIcons
                name="office-building"
                size={20}
                color={isDark ? "#4F8EF7" : "#1976D2"}
                style={formStyles.inputIcon}
              />
              <TextInput
                style={[styles.input, formStyles.input]}
                placeholder="Company Name"
                value={exp.company}
                onChangeText={(company) => {
                  setExperience((prev) => {
                    const newExp = [...prev];
                    newExp[idx] = { ...newExp[idx], company };
                    return newExp;
                  });
                }}
                placeholderTextColor={isDark ? "#888" : "#999"}
              />
            </View>
          </View>

          <View style={formStyles.dateRow}>
            <TouchableOpacity
              style={[
                formStyles.dateButton,
                {
                  backgroundColor: isDark ? "rgba(79, 142, 247, 0.15)" : "rgba(25, 118, 210, 0.1)",
                  borderColor: isDark ? "rgba(79, 142, 247, 0.3)" : "rgba(25, 118, 210, 0.2)",
                },
              ]}
              onPress={() => setShowStartPicker(idx)}
            >
              <MaterialCommunityIcons
                name="calendar-start"
                size={18}
                color={isDark ? "#4F8EF7" : "#1976D2"}
              />
              <Text
                style={[
                  formStyles.dateButtonText,
                  { color: exp.startDate ? (isDark ? "#FFF" : "#222") : (isDark ? "#888" : "#999") },
                ]}
              >
                {exp.startDate || "Start Date"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                formStyles.dateButton,
                {
                  backgroundColor: isDark ? "rgba(79, 142, 247, 0.15)" : "rgba(25, 118, 210, 0.1)",
                  borderColor: isDark ? "rgba(79, 142, 247, 0.3)" : "rgba(25, 118, 210, 0.2)",
                  opacity: exp.ongoing ? 0.5 : 1,
                },
              ]}
              onPress={() => !exp.ongoing && setShowEndPicker(idx)}
              disabled={exp.ongoing}
            >
              <MaterialCommunityIcons
                name="calendar-end"
                size={18}
                color={isDark ? "#4F8EF7" : "#1976D2"}
              />
              <Text
                style={[
                  formStyles.dateButtonText,
                  { color: exp.ongoing ? (isDark ? "#888" : "#999") : (exp.endDate ? (isDark ? "#FFF" : "#222") : (isDark ? "#888" : "#999")) },
                ]}
              >
                {exp.ongoing ? "Present" : (exp.endDate || "End Date")}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={formStyles.ongoingContainer}
            onPress={() => {
              setExperience((prev) => {
                const newExp = [...prev];
                const isOngoing = !newExp[idx].ongoing;
                newExp[idx] = { 
                  ...newExp[idx], 
                  ongoing: isOngoing,
                  endDate: isOngoing ? "" : newExp[idx].endDate,
                };
                return newExp;
              });
            }}
          >
            <View
              style={[
                formStyles.checkbox,
                {
                  backgroundColor: exp.ongoing
                    ? isDark ? "#4F8EF7" : "#1976D2"
                    : "transparent",
                  borderColor: isDark ? "#4F8EF7" : "#1976D2",
                },
              ]}
            >
              {exp.ongoing && (
                <MaterialCommunityIcons name="check" size={16} color="#fff" />
              )}
            </View>
            <Text style={[formStyles.ongoingText, { color: isDark ? "#FFF" : "#222" }]}>
              Ongoing
            </Text>
          </TouchableOpacity>

          <View style={formStyles.inputContainer}>
            <MaterialCommunityIcons
              name="text-long"
              size={20}
              color={isDark ? "#4F8EF7" : "#1976D2"}
              style={formStyles.inputIcon}
            />
            <View style={formStyles.textAreaContainer}>
              <TextInput
                style={[styles.input, formStyles.textArea]}
                placeholder="Job description, responsibilities, achievements..."
                value={exp.description}
                onChangeText={(description) => {
                  setExperience((prev) => {
                    const newExp = [...prev];
                    newExp[idx] = { ...newExp[idx], description };
                    return newExp;
                  });
                }}
                multiline
                textAlignVertical="top"
                placeholderTextColor={isDark ? "#888" : "#999"}
              />
            </View>
          </View>
        </View>
      ))}

      {/* Date Pickers - Render outside the map to avoid layout issues */}
      {/* Android: Only show one picker at a time, it shows as a modal */}
      {Platform.OS === "android" && showStartPicker !== null && experience[showStartPicker] && (
        <DateTimePicker
          value={formatDate(experience[showStartPicker].startDate)}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (showStartPicker !== null) {
              handleDateChange(event, date, showStartPicker, "start");
            }
          }}
          maximumDate={new Date()}
        />
      )}

      {Platform.OS === "android" && showEndPicker !== null && experience[showEndPicker] && showStartPicker === null && (
        <DateTimePicker
          value={formatDate(experience[showEndPicker].endDate)}
          mode="date"
          display="default"
          onChange={(event, date) => {
            if (showEndPicker !== null) {
              handleDateChange(event, date, showEndPicker, "end");
            }
          }}
          maximumDate={new Date()}
        />
      )}

      {Platform.OS === "ios" && showStartPicker !== null && experience[showStartPicker] && (
        <View style={formStyles.iosPickerContainer}>
          <View style={formStyles.iosPickerHeader}>
            <TouchableOpacity
              onPress={() => setShowStartPicker(null)}
              style={formStyles.iosPickerButton}
            >
              <Text style={formStyles.iosPickerButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={formStyles.iosPickerTitle}>Select Start Date</Text>
            <TouchableOpacity
              onPress={() => setShowStartPicker(null)}
              style={formStyles.iosPickerButton}
            >
              <Text style={formStyles.iosPickerButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={formatDate(experience[showStartPicker].startDate)}
            mode="date"
            display="spinner"
            onChange={(event, date) => {
              if (showStartPicker !== null && date) {
                handleDateChange(event, date, showStartPicker, "start");
              }
            }}
            maximumDate={new Date()}
            style={formStyles.iosPicker}
          />
        </View>
      )}

      {Platform.OS === "ios" && showEndPicker !== null && experience[showEndPicker] && (
        <View style={formStyles.iosPickerContainer}>
          <View style={formStyles.iosPickerHeader}>
            <TouchableOpacity
              onPress={() => setShowEndPicker(null)}
              style={formStyles.iosPickerButton}
            >
              <Text style={formStyles.iosPickerButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={formStyles.iosPickerTitle}>Select End Date</Text>
            <TouchableOpacity
              onPress={() => setShowEndPicker(null)}
              style={formStyles.iosPickerButton}
            >
              <Text style={formStyles.iosPickerButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={formatDate(experience[showEndPicker].endDate)}
            mode="date"
            display="spinner"
            onChange={(event, date) => {
              if (showEndPicker !== null && date) {
                handleDateChange(event, date, showEndPicker, "end");
              }
            }}
            maximumDate={new Date()}
            style={formStyles.iosPicker}
          />
        </View>
      )}

      <TouchableOpacity
        style={[
          formStyles.addButton,
          { backgroundColor: isDark ? "#4F8EF7" : "#1976D2" },
        ]}
        onPress={() =>
          setExperience((prev) => [
            ...prev,
            {
              jobTitle: "",
              company: "",
              startDate: "",
              endDate: "",
              description: "",
              ongoing: false,
            },
          ])
        }
      >
        <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
        <Text style={formStyles.addButtonText}>Add Experience</Text>
      </TouchableOpacity>
    </View>
  );
};

const formStyles = StyleSheet.create({
  container: {
    padding: 20,
  },
  experienceCard: {
    marginBottom: 20,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F8EF7",
  },
  removeButton: {
    padding: 4,
  },
  inputRow: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  textAreaContainer: {
    flex: 1,
    minWidth: 0,
  },
  textArea: {
    minHeight: 60,
    maxHeight: 100,
    paddingTop: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  iosPickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  iosPickerButton: {
    padding: 8,
  },
  iosPickerButtonText: {
    color: "#1976D2",
    fontSize: 16,
    fontWeight: "600",
  },
  iosPickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  iosPicker: {
    height: 200,
  },
  ongoingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  ongoingText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ExperienceStep;
