import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Animated,
} from 'react-native';

import AboutMeScreen from '../screens/AboutMeScreen';
import ExperienceScreen from '../screens/ExperienceScreen';
import EducationScreen from '../screens/EducationScreen';
import SkillsScreen from '../screens/SkillsScreen';
import ReviewGenerateScreen from '../screens/ReviewGenerateScreen';

const steps = ['About Me', 'Experience', 'Education', 'Skills', 'Review'];

const WizardForm = () => {
  const [step, setStep] = useState(0);
  const [fadeAnim] = useState(() => new Animated.Value(1));
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  // Replace these with your real state/hooks
  const [aboutMe, setAboutMe] = useState<any>({});
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [errorMsg, setErrorMsg] = useState('');

  // Validation per step (simplified—copy your real logic)
  const validateStep = () => {
    // for brevity, assume always valid
    setErrorMsg('');
    return true;
  };

  const canGoNext = () => {
    // for brevity, always enable
    return true;
  };

  const animateTo = (next: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setStep(next);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = () => {
    if (!validateStep()) return;
    animateTo(step + 1);
  };
  const handleBack = () => {
    setErrorMsg('');
    animateTo(step - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <AboutMeScreen
            data={aboutMe}
            setData={setAboutMe}
            errors={errors}
            setErrors={setErrors}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
            isWizard
          />
        );
      case 1:
        return (
          <ExperienceScreen
            data={experience}
            setData={setExperience}
            errors={errors}
            setErrors={setErrors}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
            isWizard
          />
        );
      case 2:
        return (
          <EducationScreen
            data={education}
            setData={setEducation}
            errors={errors}
            setErrors={setErrors}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
            isWizard
          />
        );
      case 3:
        return (
          <SkillsScreen
            data={skills}
            setData={setSkills}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
            isWizard
          />
        );
      case 4:
        return (
          <ReviewGenerateScreen
            aboutMe={aboutMe}
            experience={experience}
            education={education}
            skills={skills}
            isWizard
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Stepper */}
      <View style={styles.stepperContainer}>
        {steps.map((label, idx) => {
          const done = idx < step;
          const current = idx === step;
          return (
            <View key={label} style={styles.stepWrapper}>
              <View
                style={[
                  styles.circle,
                  current && styles.circleCurrent,
                  done && styles.circleDone,
                ]}
              >
                <Text style={styles.circleText}>{idx + 1}</Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  current && styles.stepLabelCurrent,
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
              {idx < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    done && styles.lineDone,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Card */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.title}>
          {`Step ${step + 1} of ${steps.length}: ${steps[step]}`}
        </Text>

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

          {step < steps.length - 1 ? (
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
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => {/* finalize */}}
            >
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const getStyles = (isDark: boolean) => {
  const primary = isDark ? '#4F8EF7' : '#1976D2';
  const secondary = isDark ? '#888' : '#CCC';
  const bg = isDark ? '#181A20' : '#f2f4f8';
  const cardBg = isDark ? '#23262F' : '#FFFFFF';
  const errorBg = isDark ? '#2d1a1a' : '#ffeaea';
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: bg,
      alignItems: 'center',
      paddingVertical: 24,
    },
    stepperContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      width: '90%',
      maxWidth: 400,
    },
    stepWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    circle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: secondary,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    circleCurrent: {
      backgroundColor: primary,
    },
    circleDone: {
      backgroundColor: primary,
    },
    circleText: {
      color: '#fff',
      fontWeight: '600',
    },
    stepLabel: {
      marginHorizontal: 4,
      fontSize: 12,
      color: isDark ? '#AAA' : '#555',
      flexShrink: 1,
    },
    stepLabelCurrent: {
      color: primary,
      fontWeight: '600',
    },
    line: {
      height: 2,
      flex: 1,
      backgroundColor: secondary,
      marginHorizontal: 4,
      zIndex: 1,
    },
    lineDone: {
      backgroundColor: primary,
    },
    card: {
      width: '90%',
      maxWidth: 400,
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 20,
      shadowColor: isDark ? '#000' : '#AAA',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 6,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#FFF' : '#222',
      marginBottom: 12,
      textAlign: 'center',
    },
    errorBox: {
      backgroundColor: errorBg,
      padding: 8,
      borderRadius: 8,
      marginBottom: 12,
      width: '100%',
    },
    errorText: {
      color: '#E53935',
      textAlign: 'center',
      fontWeight: '600',
    },
    content: {
      width: '100%',
      marginBottom: 16,
    },
    buttonRow: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    buttonPrimary: {
      backgroundColor: primary,
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: secondary,
    },
    buttonDisabled: {
      backgroundColor: secondary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
    },
    textSecondary: {
      color: isDark ? '#888' : '#555',
    },
    textDisabled: {
      color: isDark ? '#666' : '#AAA',
    },
  });
};

export default WizardForm;
