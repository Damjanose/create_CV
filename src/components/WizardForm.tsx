import React, { useRef, useEffect } from "react";
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import RNFS from "react-native-fs";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import { FloatingAction } from "react-native-floating-action";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

import useWizardForm from "./hooks/useWizardForm";
import WelcomeStep from "./wizardSteps/WelcomeStep";
import AboutMeStep from "./wizardSteps/AboutMeStep";
import LanguagesSkillsStep from "./wizardSteps/LanguagesSkillsStep";
import ExperienceStep from "./wizardSteps/ExperienceStep";
import EducationStep from "./wizardSteps/EducationStep";
import TemplateSelectStep from "./wizardSteps/TemplateSelectStep";
import WizardPreviewStep from "./wizardSteps/WizardPreviewStep.tsx";

const stepLabels = [
  "Welcome",
  "Template",
  "About Me, Contact & Address",
  "Languages & Skills",
  "Experience",
  "Education",
  "Preview",
];
const steps = Array.from({ length: stepLabels.length }, (_, i) => i);

interface Template {
  id: string;
  preview: React.ReactNode;
}

const TEMPLATES: Template[] = [
  {
    id: "classic",
    preview: (
      <Image
        source={require("../assets/images/templates/classicTemplate.jpg")}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
      />
    ),
  },
  {
    id: "modern",
    preview: (
      <Image
        source={require("../assets/images/templates/modernTemplate.jpg")}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
      />
    ),
  },
  {
    id: "minimal",
    preview: (
      <Image
        source={require("../assets/images/templates/simpleTemplate.png")}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
      />
    ),
  },
];

const WizardForm = () => {
  const insets = useSafeAreaInsets();
  const {
    step,
    setStep,
    fadeAnim,
    isDark,
    toggleDarkMode,
    styles,
    aboutMe,
    setAboutMe,
    contact,
    setContact,
    address,
    setAddress,
    languages,
    setLanguages,
    experience,
    setExperience,
    education,
    setEducation,
    skills,
    setSkills,
    hobbies,
    setHobbies,
    errorMsg,
    selectedTemplate,
    setSelectedTemplate,
    canGoNext,
    handleNext,
    handleBack,
    handleDownloadPDF,
    animateTo,
  } = useWizardForm();

  // Animation for toggle switch
  const toggleAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDark]);

  const requestPhotoPermission = async (): Promise<boolean> => {
    let permission;
    if (Platform.OS === "ios") {
      permission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (permission !== RESULTS.GRANTED) {
        permission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      }
    } else {
      const version =
        typeof Platform.Version === "string"
          ? parseInt(Platform.Version, 10)
          : Platform.Version;
      if (version >= 33) {
        permission = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        if (permission !== RESULTS.GRANTED) {
          permission = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        }
      } else {
        permission = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        if (permission !== RESULTS.GRANTED) {
          permission = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        }
      }
    }
    if (permission !== RESULTS.GRANTED) {
      Alert.alert(
        "Permission Required",
        "Please grant photo library access to upload a photo."
      );
      return false;
    }
    return true;
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    let permission;
    if (Platform.OS === "ios") {
      permission = await check(PERMISSIONS.IOS.CAMERA);
      if (permission !== RESULTS.GRANTED) {
        permission = await request(PERMISSIONS.IOS.CAMERA);
      }
    } else {
      permission = await check(PERMISSIONS.ANDROID.CAMERA);
      if (permission !== RESULTS.GRANTED) {
        permission = await request(PERMISSIONS.ANDROID.CAMERA);
      }
    }
    if (permission !== RESULTS.GRANTED) {
      Alert.alert(
        "Permission Required",
        "Please grant camera access to take a photo."
      );
      return false;
    }
    return true;
  };

  const handleLaunchImageLibrary = async () => {
    const hasPermission = await requestPhotoPermission();
    if (!hasPermission) return;

    const response = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.7,
    });
    if (response.assets && response.assets[0]?.uri) {
      const uri = response.assets[0].uri;
      let base64 = "";
      try {
        base64 = await RNFS.readFile(uri, "base64");
      } catch {}
      setAboutMe((prev) => ({ ...prev, image: uri, imageBase64: base64 }));
    }
  };

  const handleLaunchCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const response = await launchCamera({ mediaType: "photo", quality: 0.7 });
    if (response.assets && response.assets[0]?.uri) {
      const uri = response.assets[0].uri;
      let base64 = "";
      try {
        base64 = await RNFS.readFile(uri, "base64");
      } catch {}
      setAboutMe((prev) => ({ ...prev, image: uri, imageBase64: base64 }));
    }
  };

  const handleUploadResume = async () => {
    try {
      // Request storage permission for Android
      if (Platform.OS === "android") {
        const version =
          typeof Platform.Version === "string"
            ? parseInt(Platform.Version, 10)
            : Platform.Version;
        let permission;
        if (version >= 33) {
          permission = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
          if (permission !== RESULTS.GRANTED) {
            permission = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
          }
        } else {
          permission = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
          if (permission !== RESULTS.GRANTED) {
            permission = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
          }
        }
        if (permission !== RESULTS.GRANTED) {
          Alert.alert(
            "Permission Required",
            "Please grant storage access to upload a resume."
          );
          return;
        }
      }

      // Pick PDF document
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        copyTo: "cachesDirectory",
      });

      if (result && result[0]) {
        const file = result[0];
        Alert.alert(
          "Resume Uploaded",
          `File: ${file.name}\n\nNote: PDF parsing is not yet implemented. You can proceed to fill in your information manually, or we'll add automatic data extraction in a future update.`,
          [
            {
              text: "OK",
              onPress: () => {
                // Proceed to template selection step
                animateTo(1);
              },
            },
          ]
        );
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        return;
      } else {
        Alert.alert("Error", "Failed to upload resume. Please try again.");
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <WelcomeStep
            styles={styles}
            isDark={isDark}
            onCreateResume={handleNext}
            onUploadResume={handleUploadResume}
            toggleDarkMode={toggleDarkMode}
            toggleAnim={toggleAnim}
          />
        );
      case 1:
        return (
          <TemplateSelectStep
            templates={TEMPLATES}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        );
      case 2:
        return (
          <AboutMeStep
            aboutMe={aboutMe}
            contact={contact}
            address={address}
            setAboutMe={setAboutMe}
            setContact={setContact}
            setAddress={setAddress}
            styles={styles}
            isDark={isDark}
            launchImageLibrary={handleLaunchImageLibrary}
            launchCamera={handleLaunchCamera}
          />
        );
      case 3:
        return (
          <LanguagesSkillsStep
            languages={languages}
            setLanguages={setLanguages}
            skills={skills}
            setSkills={setSkills}
            hobbies={hobbies}
            setHobbies={setHobbies}
            styles={styles}
            isDark={isDark}
          />
        );
      case 4:
        return (
          <ExperienceStep
            experience={experience}
            setExperience={setExperience}
            styles={styles}
            isDark={isDark}
          />
        );
      case 5:
        return (
          <EducationStep
            education={education}
            setEducation={setEducation}
            styles={styles}
            isDark={isDark}
          />
        );
      case 6:
        return (
          <WizardPreviewStep
            selectedTemplate={selectedTemplate}
            experience={experience}
            education={education}
            aboutMe={aboutMe}
            contact={contact}
            address={address}
            skills={skills}
            languages={languages}
            hobbies={hobbies}
            styles={styles}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {step === steps.length - 1 ? (
        // Preview step - render without KeyboardAvoidingView and ScrollView to allow proper scrolling
        <View style={{ flex: 1 }}>
          <View style={[styles.buttonRow, { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 }]}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonSecondary,
              ]}
              onPress={handleBack}
            >
              <Text
                style={[
                  styles.buttonText,
                  styles.textSecondary,
                ]}
              >
                Back
              </Text>
            </TouchableOpacity>
          </View>
          {renderStepContent()}
          
          {/* Stepper indicators for preview step - show all steps 1-7 */}
          <View style={[styles.stepperContainerBottom, { paddingBottom: 20 }]}>
            {steps.map((idx, displayIndex) => {
              const done = idx < step;
              const current = idx === step;
              const isAccessible = idx <= step;
              
              return (
                <React.Fragment key={idx}>
                  <TouchableOpacity
                    onPress={() => {
                      if (isAccessible) {
                        animateTo(idx);
                      }
                    }}
                    style={[
                      styles.circle,
                      current && styles.circleCurrent,
                      done && styles.circleDone,
                      !isAccessible && { opacity: 0.5 },
                    ]}
                    disabled={!isAccessible}
                  >
                    <Text style={styles.circleText}>{displayIndex + 1}</Text>
                  </TouchableOpacity>
                  {idx < steps.length - 1 && (
                    <View style={[styles.line, done && styles.lineDone]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            {errorMsg ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.content}>{renderStepContent()}</View>

            {step > 0 && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.buttonSecondary,
                    step === 0 && styles.buttonDisabled,
                  ]}
                  onPress={handleBack}
                  disabled={step === 0}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      styles.textSecondary,
                      step === 0 && styles.textDisabled,
                    ]}
                  >
                    Back
                  </Text>
                </TouchableOpacity>

                {step === 1 ? (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.buttonPrimary,
                      !selectedTemplate && styles.buttonDisabled,
                    ]}
                    onPress={handleNext}
                    disabled={!selectedTemplate}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        !selectedTemplate && styles.textDisabled,
                      ]}
                    >
                      Next
                    </Text>
                  </TouchableOpacity>
                ) : step < steps.length - 2 ? (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      canGoNext() ? styles.buttonPrimary : styles.buttonDisabled,
                    ]}
                    onPress={handleNext}
                    disabled={!canGoNext()}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        !canGoNext() && styles.textDisabled,
                      ]}
                    >
                      Next
                    </Text>
                  </TouchableOpacity>
                ) : step === steps.length - 2 ? (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      canGoNext() ? styles.buttonPrimary : styles.buttonDisabled,
                    ]}
                    onPress={handleNext}
                    disabled={!canGoNext()}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        !canGoNext() && styles.textDisabled,
                      ]}
                    >
                      Preview
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </Animated.View>

          {step > 0 && (
            <View style={[styles.stepperContainerBottom, { paddingBottom: 20 }]}>
              {steps.map((idx, displayIndex) => {
                const done = idx < step;
                const current = idx === step;
                const isAccessible = idx <= step || (idx === step + 1 && canGoNext());
                
                return (
                  <React.Fragment key={idx}>
                    <TouchableOpacity
                      onPress={() => {
                        if (isAccessible) {
                          animateTo(idx);
                        }
                      }}
                      style={[
                        styles.circle,
                        current && styles.circleCurrent,
                        done && styles.circleDone,
                        !isAccessible && { opacity: 0.5 },
                      ]}
                      disabled={!isAccessible}
                    >
                      <Text style={styles.circleText}>{displayIndex + 1}</Text>
                    </TouchableOpacity>
                    {idx < steps.length - 1 && (
                      <View style={[styles.line, done && styles.lineDone]} />
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          )}
        </ScrollView>
        </KeyboardAvoidingView>
      )}

      {step === steps.length - 1 && (
        <FloatingAction
          color={styles.buttonPrimary.backgroundColor}
          showBackground={false}
          onPressMain={handleDownloadPDF}
          floatingIcon={
            <MaterialCommunityIcons name="download" size={24} color="#fff" />
          }
          position="right"
          distanceToEdge={{ vertical: 82, horizontal: 20 }}
        />
      )}
    </>
  );
};

const headerStyles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1000,
    paddingRight: 20,
    paddingBottom: 10,
  },
  toggleContainer: {
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
});

export default WizardForm;
