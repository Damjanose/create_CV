import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

// @ts-ignore: No types for react-native-html-to-pdf
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

import AboutMeScreen from '../screens/AboutMeScreen';
import ExperienceScreen from '../screens/ExperienceScreen';
import EducationScreen from '../screens/EducationScreen';
import SkillsScreen from '../screens/SkillsScreen';
import ReviewGenerateScreen from '../screens/ReviewGenerateScreen';
import TemplateSelectScreen from '../screens/TemplateSelectScreen';
import ClassicTemplate from '../screens/templates/ClassicTemplate';
import ModernTemplate from '../screens/templates/ModernTemplate';
import MinimalTemplate from '../screens/templates/MinimalTemplate';

const steps = [0, 1, 2, 3, 4, 5]; // 0: AboutMe, 1: Experience, 2: Education, 3: Skills, 4: TemplateSelect, 5: TemplatePreview

// Type definitions for form data
interface AboutMe {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
}

interface Experience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Error types
interface AboutMeErrors {
  [key: string]: boolean;
}

interface ExperienceErrors {
  [index: number]: Partial<Record<keyof Experience, boolean>>;
}

interface EducationErrors {
  [index: number]: Partial<Record<keyof Education, boolean>>;
}

// Template type and list
interface Template {
  id: string;
  name: string;
  description: string;
}

const TEMPLATES: Template[] = [
  { id: 'classic', name: 'Classic', description: 'A clean, traditional layout.' },
  { id: 'modern', name: 'Modern', description: 'A stylish, contemporary look.' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant.' },
];

const WizardForm = () => {
  const [step, setStep] = useState(0);
  const [fadeAnim] = useState(() => new Animated.Value(1));
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  // Replace these with your real state/hooks
  const [aboutMe, setAboutMe] = useState<AboutMe>({
    name: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
  });
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  // errors can be AboutMeErrors | ExperienceErrors | EducationErrors
  const [errors, setErrors] = useState<AboutMeErrors | ExperienceErrors | EducationErrors>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');
  const [showPreview, setShowPreview] = useState(false);

  // Validation per step
  const validateStep = () => {
    setErrorMsg('');
    let valid = true;
    let newErrors: any = {};
    if (step === 0) {
      // About Me required fields
      const required: (keyof AboutMe)[] = ['name', 'email', 'phone', 'address', 'summary'];
      required.forEach((field) => {
        if (!aboutMe[field] || aboutMe[field].trim() === '') {
          newErrors[field] = true;
          valid = false;
        }
      });
      setErrors(newErrors);
      if (!valid) setErrorMsg('Please fill all required fields.');
      return valid;
    }
    // TODO: Add validation for other steps
    return true;
  };

  const canGoNext = () => {
    if (step === 0) {
      const required: (keyof AboutMe)[] = ['name', 'email', 'phone', 'address', 'summary'];
      return required.every((field) => aboutMe[field] && aboutMe[field].trim() !== '');
    }
    // TODO: Add canGoNext logic for other steps
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

  // Helper to render the selected template as HTML
  const renderTemplateHtml = () => {
    let html = '';
    if (selectedTemplate === 'classic') {
      html = `
        <h1>${aboutMe.name}</h1>
        <p>${aboutMe.email} | ${aboutMe.phone} | ${aboutMe.address}</p>
        <h2>Summary</h2>
        <p>${aboutMe.summary}</p>
        <h2>Experience</h2>
        ${experience.map(exp => `
          <div><b>${exp.jobTitle} at ${exp.company}</b><br/>
          <i>${exp.startDate} - ${exp.endDate}</i><br/>
          <span>${exp.description}</span></div>
        `).join('')}
        <h2>Education</h2>
        ${education.map(edu => `
          <div><b>${edu.degree}, ${edu.school}</b><br/>
          <i>${edu.startDate} - ${edu.endDate}</i><br/>
          <span>${edu.description}</span></div>
        `).join('')}
        <h2>Skills</h2>
        <p>${skills.join(', ')}</p>
      `;
    } else if (selectedTemplate === 'modern') {
      html = `
        <div style="color:#1976D2;"><h1>${aboutMe.name}</h1></div>
        <p>${aboutMe.email} | ${aboutMe.phone} | ${aboutMe.address}</p>
        <h2 style="color:#1976D2;">Summary</h2>
        <p>${aboutMe.summary}</p>
        <h2 style="color:#1976D2;">Experience</h2>
        ${experience.map(exp => `
          <div><b>${exp.jobTitle} <span style='color:#1976D2;'>@</span> ${exp.company}</b><br/>
          <i>${exp.startDate} - ${exp.endDate}</i><br/>
          <span>${exp.description}</span></div>
        `).join('')}
        <h2 style="color:#1976D2;">Education</h2>
        ${education.map(edu => `
          <div><b>${edu.degree}, ${edu.school}</b><br/>
          <i>${edu.startDate} - ${edu.endDate}</i><br/>
          <span>${edu.description}</span></div>
        `).join('')}
        <h2 style="color:#1976D2;">Skills</h2>
        <p>${skills.map(skill => `<span style='background:#e3eafc;color:#1976D2;padding:2px 8px;border-radius:10px;margin-right:4px;'>${skill}</span>`).join('')}</p>
      `;
    } else {
      html = `
        <div style="color:#444;"><h1>${aboutMe.name}</h1></div>
        <p style="color:#888;">${aboutMe.email} | ${aboutMe.phone} | ${aboutMe.address}</p>
        <h2 style="color:#b0b0b0;">Summary</h2>
        <p>${aboutMe.summary}</p>
        <h2 style="color:#b0b0b0;">Experience</h2>
        ${experience.map(exp => `
          <div><b>${exp.jobTitle} at ${exp.company}</b><br/>
          <i>${exp.startDate} - ${exp.endDate}</i><br/>
          <span>${exp.description}</span></div>
        `).join('')}
        <h2 style="color:#b0b0b0;">Education</h2>
        ${education.map(edu => `
          <div><b>${edu.degree}, ${edu.school}</b><br/>
          <i>${edu.startDate} - ${edu.endDate}</i><br/>
          <span>${edu.description}</span></div>
        `).join('')}
        <h2 style="color:#b0b0b0;">Skills</h2>
        <p>${skills.join(', ')}</p>
      `;
    }
    return `<html><body style='font-family:sans-serif;padding:24px;'>${html}</body></html>`;
  };

  const handleDownloadPDF = async () => {
    try {
      const html = renderTemplateHtml();
      const safeName = (aboutMe.name || 'CV').replace(/\s+/g, '_');
      const file = await RNHTMLtoPDF.convert({
        html,
        fileName: `CV_${safeName}`,
        directory: 'Documents',
      });
      // Optionally move to Download folder (Android)
      let destPath = file.filePath;
      if (!destPath) throw new Error('PDF file path not found');
      if (Platform.OS === 'android') {
        const downloadDir = `${RNFS.DownloadDirectoryPath}/CV_${safeName}.pdf`;
        await RNFS.moveFile(destPath, downloadDir);
        destPath = downloadDir;
      }
      Alert.alert('Success', `CV PDF saved to: ${destPath}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to generate or save PDF.');
    }
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
          <TemplateSelectScreen selected={selectedTemplate} setSelected={setSelectedTemplate} isWizard />
        );
      case 5:
        let TemplateComponent;
        if (selectedTemplate === 'classic') TemplateComponent = ClassicTemplate;
        else if (selectedTemplate === 'modern') TemplateComponent = ModernTemplate;
        else TemplateComponent = MinimalTemplate;
        return (
          <View style={{ alignItems: 'center', width: '100%' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Preview</Text>
            <TemplateComponent
              aboutMe={aboutMe}
              experience={experience}
              education={education}
              skills={skills}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary, { marginTop: 24 }]}
              onPress={handleDownloadPDF}
            >
              <Text style={styles.buttonText}>Confirm & Download</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Card */}
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
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Preview</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>
        {/* Stepper at the bottom, numbers only */}
        <View style={styles.stepperContainerBottom}>
          {steps.map((idx) => {
            const done = idx < step;
            const current = idx === step;
            return (
              <React.Fragment key={idx}>
                <View
                  style={[
                    styles.circle,
                    current && styles.circleCurrent,
                    done && styles.circleDone,
                  ]}
                >
                  <Text style={styles.circleText}>{idx + 1}</Text>
                </View>
                {idx < steps.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      done && styles.lineDone,
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
      display: 'none', // Hide the old stepper
    },
    stepperContainerBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 24,
      width: '90%',
      maxWidth: 400,
      justifyContent: 'center',
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
    templateCard: {
      width: 140,
      height: 180,
      backgroundColor: isDark ? '#181A20' : '#f7f9fa',
      borderRadius: 12,
      marginHorizontal: 8,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      shadowColor: isDark ? '#000' : '#aaa',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    selectedTemplate: {
      borderColor: primary,
      shadowOpacity: 0.18,
      elevation: 4,
    },
    templateName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#222',
      marginBottom: 8,
    },
    selectedLabel: {
      color: primary,
      fontWeight: 'bold',
      marginTop: 8,
    },
    templateDesc: {
      fontSize: 14,
      color: isDark ? '#aaa' : '#555',
      textAlign: 'center',
      marginBottom: 12,
    },
  });
};

export default WizardForm;
