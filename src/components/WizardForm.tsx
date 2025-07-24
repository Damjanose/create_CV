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
  image?: string; // Added for image URI
  imageBase64?: string; // Added for image base64
  languages?: string[]; // Added for languages
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
        if (
          typeof aboutMe[field] !== 'string' ||
          !aboutMe[field] ||
          (typeof aboutMe[field] === 'string' && (aboutMe[field] as string).trim() === '')
        ) {
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
      return required.every((field) =>
        typeof aboutMe[field] === 'string' && aboutMe[field] && (aboutMe[field] as string).trim() !== ''
      );
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
  const renderTemplateHtml = (imageBase64?: string) => {
    let html = '';
    let imageHtml = '';
    if (imageBase64) {
      imageHtml = `<div style='text-align:center;margin-bottom:16px;'><img src='data:image/jpeg;base64,${imageBase64}' style='width:100px;height:100px;border-radius:50px;object-fit:cover;background:#eee;'/></div>`;
    }
    if (selectedTemplate === 'classic') {
      html = `
        <div style="max-width:800px;margin:auto;font-family:sans-serif;background:#fff;border-radius:12px;border:1px solid #e0e0e0;overflow:hidden;">
          ${imageHtml}
          <h1 style="font-size:32px;font-weight:bold;text-align:center;color:#222;margin:12px 0 0 0;">${aboutMe.name}</h1>
          <div style="display:flex;flex-direction:row;gap:24px;margin-top:24px;">
            <div style="flex:1;padding-right:12px;">
              <div style="margin-bottom:20px;">
                <div style="font-size:20px;font-weight:600;color:#1976D2;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px;">Contact</div>
                <div style="font-size:14px;font-weight:600;margin-top:6px;">Email</div>
                <div style="font-size:14px;color:#555;">${aboutMe.email}</div>
                <div style="font-size:14px;font-weight:600;margin-top:6px;">Phone</div>
                <div style="font-size:14px;color:#555;">${aboutMe.phone}</div>
                <div style="font-size:14px;font-weight:600;margin-top:6px;">Address</div>
                <div style="font-size:14px;color:#555;">${aboutMe.address}</div>
              </div>
              <div style="margin-bottom:20px;">
                <div style="font-size:20px;font-weight:600;color:#1976D2;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px;">Skills</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  ${skills.map(skill => `<span style='background:#e0e0e0;padding:4px 8px;border-radius:4px;font-size:12px;color:#333;margin-bottom:6px;'>${skill}</span>`).join('')}
                </div>
              </div>
            </div>
            <div style="flex:2;padding-left:12px;">
              <div style="margin-bottom:20px;">
                <div style="font-size:20px;font-weight:600;color:#1976D2;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px;">Summary</div>
                <div style="font-size:14px;color:#555;line-height:20px;">${aboutMe.summary}</div>
              </div>
              <div style="margin-bottom:20px;">
                <div style="font-size:20px;font-weight:600;color:#1976D2;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px;">Experience</div>
                ${experience.map(exp => `
                  <div style='margin-bottom:12px;'>
                    <div style='font-size:16px;font-weight:600;color:#333;'>${exp.jobTitle}</div>
                    <div style='font-size:14px;color:#777;margin-bottom:4px;'>${exp.company} | ${exp.startDate} – ${exp.endDate}</div>
                    <div style='font-size:14px;color:#555;line-height:20px;'>${exp.description}</div>
                  </div>
                `).join('')}
              </div>
              <div style="margin-bottom:20px;">
                <div style="font-size:20px;font-weight:600;color:#1976D2;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px;">Education</div>
                ${education.map(edu => `
                  <div style='margin-bottom:12px;'>
                    <div style='font-size:16px;font-weight:600;color:#333;'>${edu.degree}</div>
                    <div style='font-size:14px;color:#777;margin-bottom:4px;'>${edu.school} | ${edu.startDate} – ${edu.endDate}</div>
                    <div style='font-size:14px;color:#555;line-height:20px;'>${edu.description}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (selectedTemplate === 'modern') {
      html = `
        <div style="max-width:800px;margin:auto;font-family:sans-serif;background:#f7f9fa;border-radius:14px;overflow:hidden;border:1px solid #e0e0e0;display:flex;flex-direction:row;">
          <div style="width:16px;background:#1976D2;"></div>
          <div style="flex:1;padding:24px;">
            ${imageHtml}
            <div style='font-size:30px;font-weight:bold;color:#1976D2;margin-bottom:4px;text-align:center;'>${aboutMe.name}</div>
            <div style='font-size:14px;color:#555;margin-bottom:18px;text-align:center;'>${aboutMe.email} | ${aboutMe.phone} | ${aboutMe.address}</div>
            <div style="margin-bottom:18px;">
              <div style="font-size:18px;font-weight:bold;color:#1976D2;margin-bottom:6px;letter-spacing:1px;text-transform:uppercase;">Summary</div>
              <div style="font-size:14px;color:#222;line-height:20px;">${aboutMe.summary}</div>
            </div>
            <div style="margin-bottom:18px;">
              <div style="font-size:18px;font-weight:bold;color:#1976D2;margin-bottom:6px;letter-spacing:1px;text-transform:uppercase;">Experience</div>
              ${experience.map(exp => `
                <div style='margin-bottom:10px;'>
                  <div style='font-size:15px;font-weight:600;color:#333;'>${exp.jobTitle} <span style='color:#1976D2;font-weight:bold;'>@</span> ${exp.company}</div>
                  <div style='font-size:13px;color:#888;margin-bottom:2px;'>${exp.startDate} - ${exp.endDate}</div>
                  <div style='font-size:14px;color:#222;'>${exp.description}</div>
                </div>
              `).join('')}
            </div>
            <div style="margin-bottom:18px;">
              <div style="font-size:18px;font-weight:bold;color:#1976D2;margin-bottom:6px;letter-spacing:1px;text-transform:uppercase;">Education</div>
              ${education.map(edu => `
                <div style='margin-bottom:10px;'>
                  <div style='font-size:15px;font-weight:600;color:#333;'>${edu.degree}, ${edu.school}</div>
                  <div style='font-size:13px;color:#888;margin-bottom:2px;'>${edu.startDate} - ${edu.endDate}</div>
                  <div style='font-size:14px;color:#222;'>${edu.description}</div>
                </div>
              `).join('')}
            </div>
            <div style="margin-bottom:18px;">
              <div style="font-size:18px;font-weight:bold;color:#1976D2;margin-bottom:6px;letter-spacing:1px;text-transform:uppercase;">Skills</div>
              <div style='display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;'>
                ${skills.map(skill => `<span style='background:#e3eafc;color:#1976D2;padding:2px 8px;border-radius:10px;margin-right:6px;margin-bottom:6px;font-weight:bold;font-size:13px;'>${skill}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Minimal template: match MinimalTemplate.tsx design
      html = `
        <div style="max-width:900px;margin:auto;font-family:sans-serif;background:#FFF;border-radius:16px;border:1px solid #f0f0f0;overflow:hidden;">
          <!-- Header -->
          <div style='display:flex;flex-direction:row;align-items:center;background:#3DF8C8;padding:24px;'>
            <div style='width:100px;height:100px;margin-right:24px;'>
              ${imageBase64 ? `<img src='data:image/jpeg;base64,${imageBase64}' style='width:100px;height:100px;border-radius:50px;background:#EEE;'/>` : ''}
            </div>
            <div style='flex:1;'>
              <div style='font-size:26px;font-weight:700;color:#000;'>${aboutMe.name}</div>
              <div style='font-size:16px;font-weight:500;margin:4px 0;color:#222;'>${aboutMe.summary}</div>
              <div style='font-size:12px;color:#111;line-height:18px;'>${aboutMe.address}</div>
              <div style='font-size:12px;color:#111;line-height:18px;'>${aboutMe.phone} | <span style='text-decoration:underline;color:#000;'>${aboutMe.email}</span></div>
            </div>
          </div>
          <!-- Body -->
          <div style='display:flex;flex-direction:row;padding:32px 24px 0 24px;'>
            <!-- Sidebar -->
            <div style='width:120px;'>
              <div style='font-size:13px;font-weight:600;letter-spacing:1px;color:#444;margin-bottom:8px;text-transform:uppercase;'>Skills</div>
              ${skills.map(s => `<div style='font-size:13px;padding:4px 0;border-bottom:1px solid #DDD;color:#555;'>${s}</div>`).join('')}
              <div style='font-size:13px;font-weight:600;letter-spacing:1px;color:#444;margin-bottom:8px;text-transform:uppercase;margin-top:24px;'>Languages</div>
              ${(aboutMe.languages || []).map(l => `<div style='font-size:13px;padding:4px 0;border-bottom:1px solid #DDD;color:#555;'>${l}</div>`).join('')}
            </div>
            <!-- Main -->
            <div style='flex:1;padding-left:32px;'>
              <div style='margin-bottom:28px;'>
                <div style='font-size:14px;font-weight:600;color:#666;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;'>Profile</div>
                <div style='font-size:13px;color:#333;line-height:20px;margin-bottom:16px;'>${aboutMe.summary}</div>
              </div>
              <div style='margin-bottom:28px;'>
                <div style='font-size:14px;font-weight:600;color:#666;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;'>Employment History</div>
                ${experience.map(exp => `
                  <div style='margin-bottom:16px;'>
                    <div style='font-size:14px;font-weight:500;color:#444;'>${exp.jobTitle} at ${exp.company}</div>
                    <div style='font-size:12px;color:#888;margin-bottom:4px;'>${exp.startDate} – ${exp.endDate}</div>
                    <div style='font-size:13px;color:#333;line-height:20px;margin-bottom:16px;'>${exp.description}</div>
                  </div>
                `).join('')}
              </div>
              <div style='margin-bottom:28px;'>
                <div style='font-size:14px;font-weight:600;color:#666;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;'>Education</div>
                ${education.map(edu => `
                  <div style='margin-bottom:16px;'>
                    <div style='font-size:14px;font-weight:500;color:#444;'>${edu.degree}, ${edu.school}</div>
                    <div style='font-size:12px;color:#888;margin-bottom:4px;'>${edu.startDate} – ${edu.endDate}</div>
                    <div style='font-size:13px;color:#333;line-height:20px;margin-bottom:16px;'>${edu.description}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }
    return `<html><body style='font-family:sans-serif;padding:24px;background:#f2f4f8;'>${html}</body></html>`;
  };

  const handleDownloadPDF = async () => {
    let imageBase64 = aboutMe.imageBase64;
    // If imageBase64 is not present but image URI is, try to convert it
    if (!imageBase64 && aboutMe.image) {
      try {
        imageBase64 = await RNFS.readFile(aboutMe.image, 'base64');
      } catch (e) {
        // ignore, fallback to no image
      }
    }
    try {
      const html = renderTemplateHtml(imageBase64);
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
        let templateProps = {};
        if (selectedTemplate === 'classic') {
          TemplateComponent = ClassicTemplate;
          // Map experience to TimelineEntry[]
          const timelineExperience = experience.map(exp => ({
            company: exp.company,
            location: '',
            startDate: exp.startDate,
            endDate: exp.endDate,
            position: exp.jobTitle,
            bullets: exp.description ? exp.description.split('\n').filter(Boolean) : [],
          }));
          // Map education to EduEntry[]
          const timelineEducation = education.map(edu => ({
            institution: edu.school,
            location: '',
            year: `${edu.startDate} – ${edu.endDate}`,
            degree: edu.degree,
            bullets: edu.description ? edu.description.split('\n').filter(Boolean) : [],
          }));
          templateProps = {
            aboutMeText: aboutMe.summary,
            imageUri: aboutMe.image,
            links: [],
            reference: { name: '', title: '', phone: '', email: '' },
            hobbies: [],
            name: aboutMe.name,
            jobTitle: '',
            contact: {
              address: aboutMe.address,
              phone: aboutMe.phone,
              email: aboutMe.email,
            },
            experience: timelineExperience,
            education: timelineEducation,
            skills,
            languages: [],
          };
        } else if (selectedTemplate === 'modern') {
          TemplateComponent = ModernTemplate;
          // Map aboutMe
          const modernAboutMe = {
            name: aboutMe.name,
            role: '',
            summary: aboutMe.summary,
            email: aboutMe.email,
            location: aboutMe.address,
            phone: aboutMe.phone,
            imageUri: aboutMe.image,
          };
          // Map skills
          const modernSkills = { hard: skills, soft: [] };
          // Map experience
          const modernExperience = experience.map(exp => ({
            period: `${exp.startDate} – ${exp.endDate}`,
            company: exp.company,
            role: exp.jobTitle,
            bullets: exp.description ? exp.description.split('\n').filter(Boolean) : [],
          }));
          // Map education
          const modernEducation = education.map(edu => ({
            period: `${edu.startDate} – ${edu.endDate}`,
            location: '',
            degree: edu.degree,
            school: edu.school,
          }));
          // Map languages (empty for now)
          const modernLanguages: { label: string; level: number }[] = [];
          templateProps = {
            aboutMe: modernAboutMe,
            skills: modernSkills,
            experience: modernExperience,
            education: modernEducation,
            languages: modernLanguages,
          };
        } else if (selectedTemplate === 'minimal') {
          TemplateComponent = MinimalTemplate;
          templateProps = { aboutMe, experience, education, skills };
        } else {
          TemplateComponent = ClassicTemplate;
          templateProps = {
            aboutMeText: '',
            imageUri: '',
            links: [],
            reference: { name: '', title: '', phone: '', email: '' },
            hobbies: [],
            name: '',
            jobTitle: '',
            contact: { address: '', phone: '', email: '' },
            experience: [],
            education: [],
            skills: [],
            languages: [],
          };
        }
        return (
          <View style={{ flex: 1, backgroundColor: '#f2f4f8' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch', padding: 0 }} style={{ flex: 1 }}>
              <TemplateComponent {...templateProps} />
            </ScrollView>
            <View style={{ padding: 16, backgroundColor: '#f2f4f8' }}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, { marginTop: 0 }, !selectedTemplate && styles.buttonDisabled]}
                onPress={handleDownloadPDF}
                disabled={!selectedTemplate}
              >
                <Text style={styles.buttonText}>Confirm & Download</Text>
              </TouchableOpacity>
            </View>
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
                style={[styles.button, styles.buttonPrimary, !selectedTemplate && styles.buttonDisabled]}
                onPress={handleNext}
                disabled={!selectedTemplate}
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
