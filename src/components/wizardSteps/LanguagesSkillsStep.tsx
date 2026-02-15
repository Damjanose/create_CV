import React, { useState, useCallback } from "react";
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
  LayoutAnimation,
  UIManager,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Language {
  name: string;
  level: number;
}

interface LanguagesSkillsStepProps {
  languages: Language[];
  setLanguages: (cb: (prev: Language[]) => Language[]) => void;
  skills: string[];
  setSkills: (cb: (prev: string[]) => string[]) => void;
  hobbies: string[];
  setHobbies: (cb: (prev: string[]) => string[]) => void;
  styles: { [key: string]: StyleProp<ViewStyle | TextStyle> };
  isDark: boolean;
  fieldErrors?: Record<string, string>;
  clearFieldError?: (field: string) => void;
}

const LanguagesSkillsStep: React.FC<LanguagesSkillsStepProps> = ({
  languages,
  setLanguages,
  skills,
  setSkills,
  hobbies,
  setHobbies,
  styles,
  isDark,
  fieldErrors,
  clearFieldError,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    languages.length > 0 ? languages.length - 1 : null
  );

  const levelLabelsMap = ["Beginner", "Basic", "Intermediate", "Advanced", "Native"];

  const toggleExpand = useCallback((index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  const LevelSelector: React.FC<{
    level: number;
    onLevelChange: (level: number) => void;
    isDark: boolean;
  }> = ({ level, onLevelChange, isDark }) => {
    const levels = [1, 2, 3, 4, 5];
    const levelLabels = ["Beginner", "Basic", "Intermediate", "Advanced", "Native"];

    return (
      <View style={formStyles.levelSelector}>
        <View style={formStyles.levelButtons}>
          {levels.map((lvl) => (
            <TouchableOpacity
              key={lvl}
              style={[
                formStyles.levelButton,
                level >= lvl && {
                  backgroundColor: isDark ? "#4F8EF7" : "#1976D2",
                },
                level >= lvl && formStyles.levelButtonActive,
              ]}
              onPress={() => onLevelChange(lvl)}
            >
              <Text
                style={[
                  formStyles.levelButtonText,
                  level >= lvl && formStyles.levelButtonTextActive,
                ]}
              >
                {lvl}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[formStyles.levelLabel, { color: isDark ? "#AAA" : "#666" }]}>
          {levelLabels[level - 1] || "Select level"}
        </Text>
      </View>
    );
  };

  // Ensure there's always an empty item at the end for adding new skills/hobbies
  const getItemsWithEmpty = (items: string[]): string[] => {
    // Only add empty item if the last item is not already empty
    if (items.length === 0 || items[items.length - 1].trim() !== "") {
      return [...items, ""];
    }
    return items;
  };

  const handleSkillChange = (index: number, value: string) => {
    setSkills((prev) => {
      // Filter out all empty items first
      const nonEmpty = prev.filter(item => item.trim() !== "");
      
      if (value.trim() === "") {
        // If value is empty, just ensure we have one empty item
        return nonEmpty.length > 0 ? [...nonEmpty, ""] : [""];
      }
      
      // Update or add the item
      const newItems = [...nonEmpty];
      if (index < newItems.length) {
        newItems[index] = value;
      } else {
        newItems.push(value);
      }
      
      // Always add exactly one empty item at the end
      return [...newItems, ""];
    });
  };

  const handleHobbyChange = (index: number, value: string) => {
    setHobbies((prev) => {
      // Filter out all empty items first
      const nonEmpty = prev.filter(item => item.trim() !== "");
      
      if (value.trim() === "") {
        // If value is empty, just ensure we have one empty item
        return nonEmpty.length > 0 ? [...nonEmpty, ""] : [""];
      }
      
      // Update or add the item
      const newItems = [...nonEmpty];
      if (index < newItems.length) {
        newItems[index] = value;
      } else {
        newItems.push(value);
      }
      
      // Always add exactly one empty item at the end
      return [...newItems, ""];
    });
  };

  const renderSkillItem = (item: string, index: number) => {
    const isEmpty = item.trim() === "";

    return (
      <View
        key={`skill-${index}`}
        style={[
          formStyles.skillChip,
          {
            backgroundColor: isDark ? "rgba(79, 142, 247, 0.15)" : "rgba(25, 118, 210, 0.1)",
            borderColor: isDark ? "rgba(79, 142, 247, 0.3)" : "rgba(25, 118, 210, 0.2)",
          },
        ]}
      >
        <TextInput
          style={[formStyles.skillInput, { color: isDark ? "#FFF" : "#222" }]}
          placeholder={isEmpty ? "Add skill..." : "Skill"}
          value={item}
          onChangeText={(val) => {
            handleSkillChange(index, val);
            if (val.trim() !== "") {
              clearFieldError?.("skills");
            }
          }}
          placeholderTextColor={isDark ? "#888" : "#999"}
          multiline
          textAlignVertical="top"
        />
        {!isEmpty && (
          <TouchableOpacity
            style={formStyles.chipDeleteButton}
            onPress={() => {
              setSkills((prev) => {
                // Remove the item at this index, filter out all empty items, then add one empty
                const filtered = prev.filter((_, i) => i !== index).filter(item => item.trim() !== "");
                return filtered.length > 0 ? [...filtered, ""] : [""];
              });
            }}
          >
            <MaterialCommunityIcons name="close" size={18} color="#E53935" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderHobbyItem = (item: string, index: number) => {
    const isEmpty = item.trim() === "";

    return (
      <View
        key={`hobby-${index}`}
        style={[
          formStyles.skillChip,
          {
            backgroundColor: isDark ? "rgba(79, 142, 247, 0.15)" : "rgba(25, 118, 210, 0.1)",
            borderColor: isDark ? "rgba(79, 142, 247, 0.3)" : "rgba(25, 118, 210, 0.2)",
          },
        ]}
      >
        <TextInput
          style={[formStyles.skillInput, { color: isDark ? "#FFF" : "#222" }]}
          placeholder={isEmpty ? "Add hobby..." : "Hobby"}
          value={item}
          onChangeText={(val) => handleHobbyChange(index, val)}
          placeholderTextColor={isDark ? "#888" : "#999"}
          multiline
          textAlignVertical="top"
        />
        {!isEmpty && (
          <TouchableOpacity
            style={formStyles.chipDeleteButton}
            onPress={() => {
              setHobbies((prev) => {
                // Remove the item at this index, filter out all empty items, then add one empty
                const filtered = prev.filter((_, i) => i !== index).filter(item => item.trim() !== "");
                return filtered.length > 0 ? [...filtered, ""] : [""];
              });
            }}
          >
            <MaterialCommunityIcons name="close" size={18} color="#E53935" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={formStyles.container}>
      <Text style={styles.title}>Languages & Skills</Text>

      {/* Languages Section */}
      <View style={formStyles.section}>
        <View style={formStyles.sectionHeader}>
          <MaterialCommunityIcons
            name="translate"
            size={24}
            color={isDark ? "#4F8EF7" : "#1976D2"}
          />
          <Text style={[styles.label, formStyles.sectionTitle]}>Languages</Text>
        </View>

        {fieldErrors?.languages && (
          <View style={formStyles.fieldErrorBox}>
            <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#E53935" />
            <Text style={formStyles.fieldErrorText}>{fieldErrors.languages}</Text>
          </View>
        )}

        {languages.map((lang, idx) => {
          const isExpanded = expandedIndex === idx;
          const hasName = lang.name.trim() !== "";

          return (
            <View
              key={idx}
              style={[
                formStyles.languageCard,
                {
                  backgroundColor: isDark ? "rgba(79, 142, 247, 0.1)" : "rgba(25, 118, 210, 0.05)",
                  borderColor: fieldErrors?.[`language_${idx}`]
                    ? "#E53935"
                    : (isDark ? "rgba(79, 142, 247, 0.3)" : "rgba(25, 118, 210, 0.2)"),
                },
              ]}
            >
              {/* Collapsed header - always visible, tappable */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleExpand(idx)}
                style={formStyles.collapsibleHeader}
              >
                <View style={formStyles.collapsedInfo}>
                  <MaterialCommunityIcons
                    name="translate"
                    size={20}
                    color={isDark ? "#4F8EF7" : "#1976D2"}
                  />
                  <Text
                    style={[
                      formStyles.collapsedName,
                      { color: hasName ? (isDark ? "#FFF" : "#222") : (isDark ? "#666" : "#999") },
                    ]}
                    numberOfLines={1}
                  >
                    {hasName ? lang.name : "Untitled language"}
                  </Text>
                  {!isExpanded && hasName && (
                    <View style={formStyles.collapsedLevelBadge}>
                      <View style={formStyles.collapsedLevelDots}>
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <View
                            key={lvl}
                            style={[
                              formStyles.levelDot,
                              {
                                backgroundColor:
                                  lang.level >= lvl
                                    ? (isDark ? "#4F8EF7" : "#1976D2")
                                    : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"),
                              },
                            ]}
                          />
                        ))}
                      </View>
                      <Text style={[formStyles.collapsedLevelLabel, { color: isDark ? "#AAA" : "#666" }]}>
                        {levelLabelsMap[lang.level - 1] || ""}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={formStyles.collapsedActions}>
                  {!isExpanded && (
                    <TouchableOpacity
                      style={formStyles.deleteButton}
                      onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setLanguages((prev) => prev.filter((_, i) => i !== idx));
                        if (expandedIndex !== null && expandedIndex > idx) {
                          setExpandedIndex(expandedIndex - 1);
                        } else if (expandedIndex === idx) {
                          setExpandedIndex(null);
                        }
                      }}
                    >
                      <MaterialCommunityIcons name="delete-outline" size={20} color="#E53935" />
                    </TouchableOpacity>
                  )}
                  <MaterialCommunityIcons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={22}
                    color={isDark ? "#AAA" : "#666"}
                  />
                </View>
              </TouchableOpacity>

              {/* Expanded content */}
              {isExpanded && (
                <View style={formStyles.expandedContent}>
                  <View style={formStyles.languageHeader}>
                    <View style={formStyles.inputWithIcon}>
                      <MaterialCommunityIcons
                        name="translate"
                        size={20}
                        color={isDark ? "#4F8EF7" : "#1976D2"}
                        style={formStyles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, formStyles.languageInput]}
                        placeholder="Language name"
                        value={lang.name}
                        onChangeText={(name) => {
                          setLanguages((prev) => {
                            const newLangs = [...prev];
                            newLangs[idx] = { ...newLangs[idx], name };
                            return newLangs;
                          });
                          clearFieldError?.(`language_${idx}`);
                          clearFieldError?.("languages");
                        }}
                        placeholderTextColor={isDark ? "#888" : "#999"}
                      />
                    </View>
                    <TouchableOpacity
                      style={formStyles.deleteButton}
                      onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setLanguages((prev) => prev.filter((_, i) => i !== idx));
                        if (expandedIndex !== null && expandedIndex > idx) {
                          setExpandedIndex(expandedIndex - 1);
                        } else if (expandedIndex === idx) {
                          setExpandedIndex(null);
                        }
                      }}
                    >
                      <MaterialCommunityIcons name="delete-outline" size={22} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                  <LevelSelector
                    level={lang.level}
                    onLevelChange={(level) => {
                      setLanguages((prev) => {
                        const newLangs = [...prev];
                        newLangs[idx] = { ...newLangs[idx], level };
                        return newLangs;
                      });
                    }}
                    isDark={isDark}
                  />
                </View>
              )}
              {/* Per-language error */}
              {fieldErrors?.[`language_${idx}`] && !isExpanded && (
                <View style={[formStyles.fieldErrorBox, { marginHorizontal: 12, marginBottom: 8, marginTop: -4 }]}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={14} color="#E53935" />
                  <Text style={[formStyles.fieldErrorText, { fontSize: 12 }]}>{fieldErrors[`language_${idx}`]}</Text>
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity
          style={[
            formStyles.addButton,
            { backgroundColor: isDark ? "#4F8EF7" : "#1976D2" },
          ]}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setLanguages((prev) => [...prev, { name: "", level: 1 }]);
            setExpandedIndex(languages.length);
            clearFieldError?.("languages");
          }}
        >
          <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
          <Text style={formStyles.addButtonText}>Add Language</Text>
        </TouchableOpacity>
      </View>

      {/* Skills Section */}
      <View style={[formStyles.section, { marginTop: 32 }]}>
        <View style={formStyles.sectionHeader}>
          <MaterialCommunityIcons
            name="tools"
            size={24}
            color={isDark ? "#4F8EF7" : "#1976D2"}
          />
          <Text style={[styles.label, formStyles.sectionTitle]}>Skills</Text>
        </View>

        {fieldErrors?.skills && (
          <View style={formStyles.fieldErrorBox}>
            <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#E53935" />
            <Text style={formStyles.fieldErrorText}>{fieldErrors.skills}</Text>
          </View>
        )}

        <View style={formStyles.chipsContainer}>
          {skills.map((item, index) => {
            // Only render non-empty items, or the last item if it's empty
            if (item.trim() !== "" || index === skills.length - 1) {
              return renderSkillItem(item, index);
            }
            return null;
          })}
          {skills.length === 0 && renderSkillItem("", 0)}
        </View>
      </View>

      {/* Hobbies Section */}
      <View style={[formStyles.section, { marginTop: 32 }]}>
        <View style={formStyles.sectionHeader}>
          <MaterialCommunityIcons
            name="heart"
            size={24}
            color={isDark ? "#4F8EF7" : "#1976D2"}
          />
          <Text style={[styles.label, formStyles.sectionTitle]}>Hobbies</Text>
        </View>

        <View style={formStyles.chipsContainer}>
          {hobbies.map((item, index) => {
            // Only render non-empty items, or the last item if it's empty
            if (item.trim() !== "" || index === hobbies.length - 1) {
              return renderHobbyItem(item, index);
            }
            return null;
          })}
          {hobbies.length === 0 && renderHobbyItem("", 0)}
        </View>
      </View>
    </View>
  );
};

const formStyles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
    flexWrap: "wrap",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  hintText: {
    fontSize: 12,
    fontStyle: "italic",
    marginLeft: 8,
  },
  languageCard: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  collapsibleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  collapsedInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  collapsedName: {
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 1,
  },
  collapsedLevelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 4,
  },
  collapsedLevelDots: {
    flexDirection: "row",
    gap: 3,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  collapsedLevelLabel: {
    fontSize: 11,
    fontStyle: "italic",
  },
  collapsedActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  expandedContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  languageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  languageInput: {
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  levelSelector: {
    marginTop: 8,
  },
  levelButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  levelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(79, 142, 247, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  levelButtonActive: {
    borderColor: "#4F8EF7",
  },
  levelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888",
  },
  levelButtonTextActive: {
    color: "#FFF",
  },
  levelLabel: {
    fontSize: 12,
    fontStyle: "italic",
    marginLeft: 4,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 4,
    width: "100%",
  },
  skillChip: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  skillInput: {
    fontSize: 14,
    fontWeight: "500",
    padding: 0,
    minWidth: 40,
    flexShrink: 1,
  },
  chipDeleteButton: {
    marginLeft: 6,
    padding: 2,
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
  fieldErrorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(229, 57, 53, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  fieldErrorText: {
    color: "#E53935",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
});

export default LanguagesSkillsStep;
