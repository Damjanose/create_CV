import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';

import RNFS from 'react-native-fs';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import ClassicTemplate from '../screens/templates/ClassicTemplate';
import ModernTemplate from '../screens/templates/ModernTemplate';
import MinimalTemplate from '../screens/templates/MinimalTemplate';
import useWizardForm from './hooks/useWizardForm';
import AboutMeStep from './wizardSteps/AboutMeStep';
import LanguagesSkillsStep from './wizardSteps/LanguagesSkillsStep';
import ExperienceStep from './wizardSteps/ExperienceStep';
import EducationStep from './wizardSteps/EducationStep';
import TemplateSelectStep from './wizardSteps/TemplateSelectStep';

const stepLabels = [
  'About Me, Contact & Address',
  'Languages & Skills',
  'Experience',
  'Education',
  'Template',
  'Preview',
];
const steps = Array.from({ length: stepLabels.length }, (_, i) => i);

interface Template {
  id: string;
  preview: React.ReactNode;
}

const TEMPLATES: Template[] = [
  {
    id: 'classic',
    preview: (
      <Image
        source={require('../assets/images/templates/clasictemplate.jpg')}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
        />
    ),
  },
  {
    id: 'modern',
    preview: (
      <Image
        source={require('../assets/images/templates/moderntemplate.jpg')}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
        />
    ),
  },
  {
    id: 'minimal',
    preview: (
      <Image
        source={require('../assets/images/templates/simpletemplate.png')}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      />
    ),
  },
];

const WizardForm = () => {
  const {
    step,
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
  } = useWizardForm();

  const handleLaunchImageLibrary = async () => {
    const response = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    if (response.assets && response.assets[0]?.uri) {
      const uri = response.assets[0].uri;
      let base64 = '';
      try { base64 = await RNFS.readFile(uri, 'base64'); } catch {}
      setAboutMe(prev => ({ ...prev, image: uri, imageBase64: base64 }));
    }
  };
  const handleLaunchCamera = async () => {
    const response = await launchCamera({ mediaType: 'photo', quality: 0.7 });
    if (response.assets && response.assets[0]?.uri) {
      const uri = response.assets[0].uri;
      let base64 = '';
      try { base64 = await RNFS.readFile(uri, 'base64'); } catch {}
      setAboutMe(prev => ({ ...prev, image: uri, imageBase64: base64 }));
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
            styles={styles}
            isDark={isDark}
          />
        );
      case 5:
        let TemplateComponent;
        let templateProps = {};
        if (selectedTemplate === 'classic') {
          TemplateComponent = ClassicTemplate;
          const timelineExperience = experience.map(exp => ({
            company: exp.company,
            location: '',
            startDate: exp.startDate,
            endDate: exp.endDate,
            position: exp.jobTitle,
            bullets: exp.description ? exp.description.split('\n').filter(Boolean) : [],
          }));
          const timelineEducation = education.map(edu => ({
            institution: edu.school,
            location: '',
            year: `${edu.startDate} – ${edu.endDate}`,
            degree: edu.degree,
            bullets: edu.description ? edu.description.split('\n').filter(Boolean) : [],
          }));
          templateProps = {
            cvName: `${contact.name} ${contact.lastname}`,
            aboutMeText: aboutMe.summary,
            imageUri: aboutMe.image,
            links: [],
            reference: { name: '', title: '', phone: '', email: '' },
            hobbies: [],
            name: contact.name,
            lastname: contact.lastname,
            jobTitle: '',
            contact,
            address,
            experience: timelineExperience,
            education: timelineEducation,
            skills,
            languages,
          };
        } else if (selectedTemplate === 'modern') {
          TemplateComponent = ModernTemplate;
          const modernAboutMe = {
            cvName: `${contact.name} ${contact.lastname}`,
            name: contact.name,
            lastname: contact.lastname,
            summary: aboutMe.summary,
            email: contact.email,
            location: `${address.countryName}, ${address.cityName}, ${address.address1} ${address.address2}`,
            phone: contact.phone,
            imageUri: aboutMe.image,
          };
          const modernSkills = { hard: skills, soft: [] };
          const modernExperience = experience.map(exp => ({
            period: `${exp.startDate} – ${exp.endDate}`,
            company: exp.company,
            role: exp.jobTitle,
            bullets: exp.description ? exp.description.split('\n').filter(Boolean) : [],
          }));
          const modernEducation = education.map(edu => ({
            period: `${edu.startDate} – ${edu.endDate}`,
            location: '',
            degree: edu.degree,
            school: edu.school,
          }));
          const modernLanguages = languages.map(l => ({ label: l.name, level: l.level }));
          templateProps = {
            cvName: `${contact.name} ${contact.lastname}`,
            aboutMe: modernAboutMe,
            skills: modernSkills,
            experience: modernExperience,
            education: modernEducation,
            languages: modernLanguages,
            contact,
            address,
          };
        } else if (selectedTemplate === 'minimal') {
          TemplateComponent = MinimalTemplate;
          templateProps = {
            cvName: `${contact.name} ${contact.lastname}`,
            aboutMe: {
              ...aboutMe,
              name: contact.name,
              lastname: contact.lastname,
              email: contact.email,
              phone: contact.phone,
              address: `${address.countryName}, ${address.cityName}, ${address.address1} ${address.address2}`,
              languages: languages.map(l => l.name),
            },
            experience,
            education,
            skills,
            contact,
            address,
          };
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
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                padding: 0,
                paddingBottom: 100,
              }}
              style={{ flex: 1 }}
            >
              <TemplateComponent {...templateProps} />
            </ScrollView>
            {/* Floating Download Button - OUTSIDE the ScrollView */}
            <View
              pointerEvents="box-none"
              style={{ position: 'absolute', right: 20, bottom: 20, zIndex: 100 }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 32,
                  width: 64,
                  height: 64,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 8,
                  shadowColor: '#000',
                  shadowOpacity: 0.18,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  backgroundColor: styles.buttonPrimary.backgroundColor,
                }}
                onPress={handleDownloadPDF}
                activeOpacity={0.85}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 28 }}>↓</Text>
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
      display: 'none',
    },
    stepperContainerBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 24,
      width: '100%',
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
      maxWidth: 400,
      borderRadius: 16,
      shadowColor: isDark ? '#000' : '#AAA',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 6,
      alignItems: 'center',
    },
    title: {
      fontSize: 22,
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
    input: {
      width: '100%',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? '#555' : '#CCC',
      backgroundColor: isDark ? '#333' : '#FFF',
      color: isDark ? '#FFF' : '#222',
      fontSize: 16,
      fontWeight: '500',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#AAA' : '#555',
      marginBottom: 8,
    },
  });
};

export default WizardForm;
