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

interface Language {
  name: string;
  level: number;
}

interface LanguagesSkillsStepProps {
  languages: Language[];
  setLanguages: (cb: (prev: Language[]) => Language[]) => void;
  skills: string[];
  setSkills: (cb: (prev: string[]) => string[]) => void;
  styles: { [key: string]: StyleProp<ViewStyle | TextStyle> };
  isDark: boolean;
}

const LanguagesSkillsStep: React.FC<LanguagesSkillsStepProps> = ({
  languages,
  setLanguages,
  skills,
  setSkills,
  styles,
  isDark,
}) => (
  <View style={{ padding: 24 }}>
    <Text style={styles.title}>Languages & Skills</Text>
    <Text style={styles.label}>Languages</Text>
    {languages.map((lang, idx) => (
      <View
        key={idx}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <TextInput
          style={[styles.input, { flex: 2, marginRight: 8 }]}
          placeholder="Language"
          value={lang.name}
          onChangeText={(name) => {
            setLanguages((prev) => {
              const newLangs = [...prev];
              newLangs[idx] = { ...newLangs[idx], name };
              return newLangs;
            });
          }}
        />
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          placeholder="Level (1-5)"
          value={lang.level ? String(lang.level) : ""}
          onChangeText={(level) => {
            setLanguages((prev) => {
              const newLangs = [...prev];
              newLangs[idx] = { ...newLangs[idx], level: Number(level) };
              return newLangs;
            });
          }}
          keyboardType="numeric"
          maxLength={1}
        />
        <TouchableOpacity
          onPress={() =>
            setLanguages((prev) => prev.filter((_, i) => i !== idx))
          }
        >
          <Text style={{ color: "#E53935", fontWeight: "bold", fontSize: 18 }}>
            ×
          </Text>
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
      onPress={() => setLanguages((prev) => [...prev, { name: "", level: 1 }])}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Add Language</Text>
    </TouchableOpacity>
    <Text style={[styles.label, { marginTop: 24 }]}>Skills</Text>
    {skills.map((skill, idx) => (
      <View
        key={idx}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          placeholder="Skill"
          value={skill}
          onChangeText={(val) => {
            setSkills((prev) => {
              const newSkills = [...prev];
              newSkills[idx] = val;
              return newSkills;
            });
          }}
        />
        <TouchableOpacity
          onPress={() => setSkills((prev) => prev.filter((_, i) => i !== idx))}
        >
          <Text style={{ color: "#E53935", fontWeight: "bold", fontSize: 18 }}>
            ×
          </Text>
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
      onPress={() => setSkills((prev) => [...prev, ""])}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Add Skill</Text>
    </TouchableOpacity>
  </View>
);

export default LanguagesSkillsStep;
