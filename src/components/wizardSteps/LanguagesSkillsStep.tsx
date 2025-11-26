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
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
}) => {
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
    return [...items, ""];
  };

  const handleSkillChange = (index: number, value: string) => {
    const itemsWithEmpty = getItemsWithEmpty(skills);
    const newItems = [...itemsWithEmpty];
    newItems[index] = value;
    
    // Remove empty items except the last one
    const filtered = newItems.filter((item, idx) => item.trim() !== "" || idx === newItems.length - 1);
    setSkills(filtered.length > 0 && filtered[filtered.length - 1] === "" 
      ? filtered.slice(0, -1) 
      : filtered.length > 0 
        ? [...filtered, ""] 
        : [""]);
  };

  const handleHobbyChange = (index: number, value: string) => {
    const itemsWithEmpty = getItemsWithEmpty(hobbies);
    const newItems = [...itemsWithEmpty];
    newItems[index] = value;
    
    // Remove empty items except the last one
    const filtered = newItems.filter((item, idx) => item.trim() !== "" || idx === newItems.length - 1);
    setHobbies(filtered.length > 0 && filtered[filtered.length - 1] === "" 
      ? filtered.slice(0, -1) 
      : filtered.length > 0 
        ? [...filtered, ""] 
        : [""]);
  };

  const handleSkillDragEnd = ({ data }: { data: string[] }) => {
    // Remove empty item if it exists, then add it back at the end
    const filtered = data.filter(item => item.trim() !== "");
    setSkills([...filtered, ""]);
  };

  const handleHobbyDragEnd = ({ data }: { data: string[] }) => {
    // Remove empty item if it exists, then add it back at the end
    const filtered = data.filter(item => item.trim() !== "");
    setHobbies([...filtered, ""]);
  };

  const renderSkillItem = ({ item, index, drag, isActive }: RenderItemParams<string>) => {
    const isLast = index === skills.length;
    const isEmpty = item.trim() === "";

    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={!isEmpty ? drag : undefined}
          disabled={isActive || isEmpty}
          style={[
            formStyles.skillChip,
            {
              backgroundColor: isDark ? "rgba(79, 142, 247, 0.15)" : "rgba(25, 118, 210, 0.1)",
              borderColor: isDark ? "rgba(79, 142, 247, 0.3)" : "rgba(25, 118, 210, 0.2)",
              opacity: isActive ? 0.8 : 1,
            },
          ]}
        >
          {!isEmpty && (
            <TouchableOpacity
              onLongPress={drag}
              style={formStyles.dragHandle}
            >
              <MaterialCommunityIcons
                name="drag"
                size={18}
                color={isDark ? "#4F8EF7" : "#1976D2"}
              />
            </TouchableOpacity>
          )}
          <TextInput
            style={[formStyles.skillInput, { color: isDark ? "#FFF" : "#222" }]}
            placeholder={isEmpty ? "Add skill..." : "Skill"}
            value={item}
            onChangeText={(val) => handleSkillChange(index, val)}
            placeholderTextColor={isDark ? "#888" : "#999"}
            editable={!isActive}
          />
          {!isEmpty && (
            <TouchableOpacity
              style={formStyles.chipDeleteButton}
              onPress={() => {
                const newSkills = skills.filter((_, i) => i !== index);
                setSkills(newSkills.length > 0 ? [...newSkills, ""] : [""]);
              }}
            >
              <MaterialCommunityIcons name="close" size={18} color="#E53935" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const renderHobbyItem = ({ item, index, drag, isActive }: RenderItemParams<string>) => {
    const isLast = index === hobbies.length;
    const isEmpty = item.trim() === "";

    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={!isEmpty ? drag : undefined}
          disabled={isActive || isEmpty}
          style={[
            formStyles.skillChip,
            {
              backgroundColor: isDark ? "rgba(79, 142, 247, 0.15)" : "rgba(25, 118, 210, 0.1)",
              borderColor: isDark ? "rgba(79, 142, 247, 0.3)" : "rgba(25, 118, 210, 0.2)",
              opacity: isActive ? 0.8 : 1,
            },
          ]}
        >
          {!isEmpty && (
            <TouchableOpacity
              onLongPress={drag}
              style={formStyles.dragHandle}
            >
              <MaterialCommunityIcons
                name="drag"
                size={18}
                color={isDark ? "#4F8EF7" : "#1976D2"}
              />
            </TouchableOpacity>
          )}
          <TextInput
            style={[formStyles.skillInput, { color: isDark ? "#FFF" : "#222" }]}
            placeholder={isEmpty ? "Add hobby..." : "Hobby"}
            value={item}
            onChangeText={(val) => handleHobbyChange(index, val)}
            placeholderTextColor={isDark ? "#888" : "#999"}
            editable={!isActive}
          />
          {!isEmpty && (
            <TouchableOpacity
              style={formStyles.chipDeleteButton}
              onPress={() => {
                const newHobbies = hobbies.filter((_, i) => i !== index);
                setHobbies(newHobbies.length > 0 ? [...newHobbies, ""] : [""]);
              }}
            >
              <MaterialCommunityIcons name="close" size={18} color="#E53935" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </ScaleDecorator>
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

        {languages.map((lang, idx) => (
          <View
            key={idx}
            style={[
              formStyles.languageCard,
              {
                backgroundColor: isDark ? "rgba(79, 142, 247, 0.1)" : "rgba(25, 118, 210, 0.05)",
                borderColor: isDark ? "rgba(79, 142, 247, 0.3)" : "rgba(25, 118, 210, 0.2)",
              },
            ]}
          >
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
                  placeholder="Language name (e.g., English, Spanish)"
                  value={lang.name}
                  onChangeText={(name) => {
                    setLanguages((prev) => {
                      const newLangs = [...prev];
                      newLangs[idx] = { ...newLangs[idx], name };
                      return newLangs;
                    });
                  }}
                  placeholderTextColor={isDark ? "#888" : "#999"}
                />
              </View>
              <TouchableOpacity
                style={formStyles.deleteButton}
                onPress={() =>
                  setLanguages((prev) => prev.filter((_, i) => i !== idx))
                }
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
        ))}

        <TouchableOpacity
          style={[
            formStyles.addButton,
            { backgroundColor: isDark ? "#4F8EF7" : "#1976D2" },
          ]}
          onPress={() => setLanguages((prev) => [...prev, { name: "", level: 1 }])}
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
          <Text style={[formStyles.hintText, { color: isDark ? "#888" : "#666" }]}>
            (Long press to reorder)
          </Text>
        </View>

        <DraggableFlatList
          data={getItemsWithEmpty(skills)}
          onDragEnd={handleSkillDragEnd}
          keyExtractor={(item, index) => `skill-${index}`}
          renderItem={renderSkillItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={formStyles.draggableContainer}
        />
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
          <Text style={[formStyles.hintText, { color: isDark ? "#888" : "#666" }]}>
            (Long press to reorder)
          </Text>
        </View>

        <DraggableFlatList
          data={getItemsWithEmpty(hobbies)}
          onDragEnd={handleHobbyDragEnd}
          keyExtractor={(item, index) => `hobby-${index}`}
          renderItem={renderHobbyItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={formStyles.draggableContainer}
        />
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
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
  draggableContainer: {
    paddingVertical: 4,
  },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 100,
    marginRight: 8,
    marginBottom: 8,
  },
  dragHandle: {
    marginRight: 6,
    padding: 2,
  },
  skillInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    padding: 0,
    minWidth: 60,
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
});

export default LanguagesSkillsStep;
