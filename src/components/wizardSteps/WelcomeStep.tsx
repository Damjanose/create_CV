import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface WelcomeStepProps {
  styles: { [key: string]: any };
  isDark: boolean;
  onCreateResume: () => void;
  onUploadResume: () => void;
  toggleDarkMode: () => void;
  toggleAnim: Animated.Value;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({
  styles,
  isDark,
  onCreateResume,
  onUploadResume,
  toggleDarkMode,
  toggleAnim,
}) => {
  return (
    <View style={[welcomeStyles.container, { backgroundColor: styles.card.backgroundColor }]}>
      <View style={welcomeStyles.toggleContainer}>
        <TouchableOpacity
          style={[
            welcomeStyles.toggleButton,
            {
              backgroundColor: isDark ? "#2A2D35" : "#E8E8E8",
            },
          ]}
          onPress={toggleDarkMode}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              welcomeStyles.toggleSwitch,
              {
                transform: [
                  {
                    translateX: toggleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [2, 22],
                    }),
                  },
                ],
                backgroundColor: isDark ? "#4F8EF7" : "#FFD700",
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isDark ? "weather-night" : "weather-sunny"}
              size={18}
              color={isDark ? "#FFF" : "#333"}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      <View style={welcomeStyles.content}>
        <View style={welcomeStyles.iconContainer}>
          <Text style={[welcomeStyles.icon, { color: isDark ? "#4F8EF7" : "#1976D2" }]}>
            📄
          </Text>
        </View>
        
        <Text style={[welcomeStyles.title, { color: isDark ? "#FFF" : "#222" }]}>
          Welcome to CV Creator
        </Text>
        
        <Text style={[welcomeStyles.subtitle, { color: isDark ? "#AAA" : "#666" }]}>
          Create a professional CV in minutes with AI
        </Text>
        
        <View style={welcomeStyles.featuresContainer}>
          <View style={welcomeStyles.feature}>
            <Text style={[welcomeStyles.featureIcon, { color: isDark ? "#4F8EF7" : "#1976D2" }]}>
              ✨
            </Text>
            <Text style={[welcomeStyles.featureText, { color: isDark ? "#DDD" : "#444" }]}>
              Choose from beautiful templates
            </Text>
          </View>
          
          <View style={welcomeStyles.feature}>
            <Text style={[welcomeStyles.featureIcon, { color: isDark ? "#4F8EF7" : "#1976D2" }]}>
              📝
            </Text>
            <Text style={[welcomeStyles.featureText, { color: isDark ? "#DDD" : "#444" }]}>
              Fill in your information easily
            </Text>
          </View>
          
          <View style={welcomeStyles.feature}>
            <Text style={[welcomeStyles.featureIcon, { color: isDark ? "#4F8EF7" : "#1976D2" }]}>
              📥
            </Text>
            <Text style={[welcomeStyles.featureText, { color: isDark ? "#DDD" : "#444" }]}>
              Download as PDF instantly
            </Text>
          </View>
        </View>
        
        <View style={welcomeStyles.actionsContainer}>
          <TouchableOpacity
            style={[
              welcomeStyles.actionButton,
              welcomeStyles.primaryButton,
              { backgroundColor: isDark ? "#4F8EF7" : "#1976D2" },
            ]}
            onPress={onCreateResume}
          >
            <Text style={welcomeStyles.actionButtonText}>Create CV</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              welcomeStyles.actionButton,
              welcomeStyles.secondaryButton,
              {
                backgroundColor: isDark ? "#23262F" : "#FFFFFF",
                borderWidth: 2,
                borderColor: isDark ? "#4F8EF7" : "#1976D2",
              },
            ]}
            onPress={onUploadResume}
          >
            <Text
              style={[
                welcomeStyles.secondaryButtonText,
                { color: isDark ? "#4F8EF7" : "#1976D2" },
              ]}
            >
              Upload CV
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  toggleContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  toggleButton: {
    width: 56,
    height: 32,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  toggleSwitch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 40,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  actionsContainer: {
    width: "100%",
    gap: 16,
  },
  actionButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButton: {
    // Styles applied via backgroundColor prop
  },
  secondaryButton: {
    // Styles applied via borderColor prop
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default WelcomeStep;

