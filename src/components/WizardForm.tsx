import React from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import RNFS from "react-native-fs";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { FloatingAction } from "react-native-floating-action";

import useWizardForm from "./hooks/useWizardForm";
import AboutMeStep from "./wizardSteps/AboutMeStep";
import LanguagesSkillsStep from "./wizardSteps/LanguagesSkillsStep";
import ExperienceStep from "./wizardSteps/ExperienceStep";
import EducationStep from "./wizardSteps/EducationStep";
import TemplateSelectStep from "./wizardSteps/TemplateSelectStep";
import WizardPreviewStep from "./wizardSteps/WizardPreviewStep.tsx";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const stepLabels = [
  "About Me, Contact & Address",
  "Languages & Skills",
  "Experience",
  "Education",
  "Template",
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
  const {
    step,
    setStep,
    fadeAnim,
    isDark,
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
    errorMsg,
    selectedTemplate,
    setSelectedTemplate,
    canGoNext,
    handleNext,
    handleBack,
    handleDownloadPDF,
    animateTo,
  } = useWizardForm();

  const handleLaunchImageLibrary = async () => {
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

  const renderStepContent = () => {
    switch (step) {
      case 0:
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
      case 1:
        return (
          <LanguagesSkillsStep
            languages={languages}
            setLanguages={setLanguages}
            skills={skills}
            setSkills={setSkills}
            styles={styles}
            isDark={isDark}
          />
        );
      case 2:
        return (
          <ExperienceStep
            experience={experience}
            setExperience={setExperience}
            styles={styles}
            isDark={isDark}
          />
        );
      case 3:
        return (
          <EducationStep
            education={education}
            setEducation={setEducation}
            styles={styles}
            isDark={isDark}
          />
        );
      case 4:
        return (
          <TemplateSelectStep
            templates={TEMPLATES}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        );
      case 5:
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
            styles={styles}
          />
        );
      default:
        return null;
    }
  };

  return (
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

            {step < steps.length - 2 ? (
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
                  styles.buttonPrimary,
                  !selectedTemplate && styles.buttonDisabled,
                ]}
                onPress={handleNext}
                disabled={!selectedTemplate}
              >
                <Text style={styles.buttonText}>Preview</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>

        <View style={[styles.stepperContainerBottom, { paddingBottom: 20 }]}>
          {steps.map((idx) => {
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
                  <Text style={styles.circleText}>{idx + 1}</Text>
                </TouchableOpacity>
                {idx < steps.length - 1 && (
                  <View style={[styles.line, done && styles.lineDone]} />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>

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
    </KeyboardAvoidingView>
  );
};

export default WizardForm;
