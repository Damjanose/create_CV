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
  TextInput,
  Image,
} from 'react-native';

// @ts-ignore: No types for react-native-html-to-pdf
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import AboutMeScreen from '../screens/AboutMeScreen';
import ExperienceScreen from '../screens/ExperienceScreen';
import EducationScreen from '../screens/EducationScreen';
import SkillsScreen from '../screens/SkillsScreen';
import ReviewGenerateScreen from '../screens/ReviewGenerateScreen';
import TemplateSelectScreen from '../screens/TemplateSelectScreen';
import ClassicTemplate from '../screens/templates/ClassicTemplate';
import ModernTemplate from '../screens/templates/ModernTemplate';
import MinimalTemplate from '../screens/templates/MinimalTemplate';

const stepLabels = [
  'About Me, Contact & Address',
  'Languages & Skills',
  'Experience',
  'Education',
  'Template',
  'Preview',
];
const steps = Array.from({ length: stepLabels.length }, (_, i) => i);

interface Contact {
  name: string;
  lastname: string;
  phone: string;
  email: string;
}
interface Address {
  countryName: string;
  cityName: string;
  address1: string;
  address2: string;
}
interface Language {
  name: string;
  level: number;
}
interface AboutMe {
  summary: string;
  image?: string;
  imageBase64?: string;
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

interface AboutMeErrors {
  [key: string]: boolean;
}

interface ExperienceErrors {
  [index: number]: Partial<Record<keyof Experience, boolean>>;
}

interface EducationErrors {
  [index: number]: Partial<Record<keyof Education, boolean>>;
}

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

  const [aboutMe, setAboutMe] = useState<AboutMe>({
    summary: '',
    image: '',
    imageBase64: '',
  });
  const [contact, setContact] = useState<Contact>({
    name: '',
    lastname: '',
    phone: '',
    email: '',
  });
  const [address, setAddress] = useState<Address>({
    countryName: '',
    cityName: '',
    address1: '',
    address2: '',
  });
  const [languages, setLanguages] = useState<Language[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [errors, setErrors] = useState<AboutMeErrors | ExperienceErrors | EducationErrors>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');
  const [showPreview, setShowPreview] = useState(false);

  const validateStep = () => {
    setErrorMsg('');
    let valid = true;
    let newErrors: any = {};
    if (step === 0) {
      if (!aboutMe.summary || aboutMe.summary.trim() === '') valid = false;
      if (!contact.name || !contact.lastname || !contact.phone || !contact.email) valid = false;
      if (!address.countryName || !address.cityName || !address.address1) valid = false;
      if (!valid) setErrorMsg('Please fill all required fields.');
      return valid;
    }
    if (step === 1) {
      if (languages.length === 0 || skills.length === 0) {
        setErrorMsg('Please add at least one language and one skill.');
        return false;
      }
    }
    return true;
  };

  const canGoNext = () => {
    if (step === 0) {
      return aboutMe.summary.trim() !== '' && contact.name && contact.lastname && contact.phone && contact.email && address.countryName && address.cityName && address.address1;
    }
    if (step === 1) {
      return languages.length > 0 && skills.length > 0;
    }
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
          <h1 style="font-size:32px;font-weight:bold;text-align:center;color:#222;margin:12px 0 0 0;">${contact.name} ${contact.lastname}</h1>
          <div style="display:flex;flex-direction:row;gap:24px;margin-top:24px;">
            <div style="flex:1;padding-right:12px;">
              <div style="margin-bottom:20px;">
                <div style="font-size:20px;font-weight:600;color:#1976D2;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px;">Contact</div>
                <div style="font-size:14px;font-weight:600;margin-top:6px;">Email</div>
                <div style="font-size:14px;color:#555;">${contact.email}</div>
                <div style="font-size:14px;font-weight:600;margin-top:6px;">Phone</div>
                <div style="font-size:14px;color:#555;">${contact.phone}</div>
                <div style="font-size:14px;font-weight:600;margin-top:6px;">Address</div>
                <div style="font-size:14px;color:#555;">${address.address1}, ${address.cityName}, ${address.countryName}</div>
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
            <div style='font-size:30px;font-weight:bold;color:#1976D2;margin-bottom:4px;text-align:center;'>${contact.name} ${contact.lastname}</div>
            <div style='font-size:14px;color:#555;margin-bottom:18px;text-align:center;'>${contact.email} | ${contact.phone} | ${address.address1}, ${address.cityName}, ${address.countryName}</div>
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
      html = `
        <div style="max-width:900px;margin:auto;font-family:sans-serif;background:#FFF;border-radius:16px;border:1px solid #f0f0f0;overflow:hidden;">
          <!-- Header -->
          <div style='display:flex;flex-direction:row;align-items:center;background:#3DF8C8;padding:24px;'>
            <div style='width:100px;height:100px;margin-right:24px;'>
              ${imageBase64 ? `<img src='data:image/jpeg;base64,${imageBase64}' style='width:100px;height:100px;border-radius:50px;background:#EEE;'/>` : ''}
            </div>
            <div style='flex:1;'>
              <div style='font-size:26px;font-weight:700;color:#000;'>${contact.name} ${contact.lastname}</div>
              <div style='font-size:16px;font-weight:500;margin:4px 0;color:#222;'>${aboutMe.summary}</div>
              <div style='font-size:12px;color:#111;line-height:18px;'>${address.address1}, ${address.cityName}, ${address.countryName}</div>
              <div style='font-size:12px;color:#111;line-height:18px;'>${contact.phone} | <span style='text-decoration:underline;color:#000;'>${contact.email}</span></div>
            </div>
          </div>
          <!-- Body -->
          <div style='display:flex;flex-direction:row;padding:32px 24px 0 24px;'>
            <!-- Sidebar -->
            <div style='width:120px;'>
              <div style='font-size:13px;font-weight:600;letter-spacing:1px;color:#444;margin-bottom:8px;text-transform:uppercase;'>Skills</div>
              ${skills.map(s => `<div style='font-size:13px;padding:4px 0;border-bottom:1px solid #DDD;color:#555;'>${s}</div>`).join('')}
              <div style='font-size:13px;font-weight:600;letter-spacing:1px;color:#444;margin-bottom:8px;text-transform:uppercase;margin-top:24px;'>Languages</div>
              ${languages.map(l => `<div style='font-size:13px;padding:4px 0;border-bottom:1px solid #DDD;color:#555;'>${l.name} (${l.level})</div>`).join('')}
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
    if (!imageBase64 && aboutMe.image) {
      try {
        imageBase64 = await RNFS.readFile(aboutMe.image, 'base64');
      } catch (e) {
      }
    }
    try {
      const html = renderTemplateHtml(imageBase64);
      const safeName = `${contact.name}_${contact.lastname}_cv`.replace(/\s+/g, '_');
      const file = await RNHTMLtoPDF.convert({
        html,
        fileName: safeName,
        directory: 'Documents',
      });
      let destPath = file.filePath;
      if (!destPath) throw new Error('PDF file path not found');
      if (Platform.OS === 'android') {
        const downloadDir = `${RNFS.DownloadDirectoryPath}/${safeName}.pdf`;
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
          <View >
            <Text style={styles.title}>About Me, Contact & Address</Text>
            <View style={{ alignItems: 'center', marginVertical: 16 }}>
              <Image
                source={aboutMe.image ? { uri: aboutMe.image } : require('../assets/images/user.png')}
                style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#eee', marginBottom: 8 }}
              />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={{ backgroundColor: isDark ? '#4F8EF7' : '#1976D2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 8 }}
                  onPress={async () => {
                    const response = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
                    if (response.assets && response.assets[0]?.uri) {
                      const uri = response.assets[0].uri;
                      let base64 = '';
                      try { base64 = await RNFS.readFile(uri, 'base64'); } catch {}
                      setAboutMe(prev => ({ ...prev, image: uri, imageBase64: base64 }));
                    }
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Upload Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: isDark ? '#4F8EF7' : '#1976D2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                  onPress={async () => {
                    const response = await launchCamera({ mediaType: 'photo', quality: 0.7 });
                    if (response.assets && response.assets[0]?.uri) {
                      const uri = response.assets[0].uri;
                      let base64 = '';
                      try { base64 = await RNFS.readFile(uri, 'base64'); } catch {}
                      setAboutMe(prev => ({ ...prev, image: uri, imageBase64: base64 }));
                    }
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={contact.name}
              onChangeText={name => setContact(prev => ({ ...prev, name }))}
            />
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={contact.lastname}
              onChangeText={lastname => setContact(prev => ({ ...prev, lastname }))}
            />
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={contact.phone}
              onChangeText={phone => setContact(prev => ({ ...prev, phone }))}
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={contact.email}
              onChangeText={email => setContact(prev => ({ ...prev, email }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              placeholder="Country"
              value={address.countryName}
              onChangeText={countryName => setAddress(prev => ({ ...prev, countryName }))}
            />
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="City"
              value={address.cityName}
              onChangeText={cityName => setAddress(prev => ({ ...prev, cityName }))}
            />
            <Text style={styles.label}>Address Line 1</Text>
            <TextInput
              style={styles.input}
              placeholder="Address Line 1"
              value={address.address1}
              onChangeText={address1 => setAddress(prev => ({ ...prev, address1 }))}
            />
            <Text style={styles.label}>Address Line 2 (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Address Line 2 (optional)"
              value={address.address2}
              onChangeText={address2 => setAddress(prev => ({ ...prev, address2 }))}
            />
            {/* Move summary to the end */}
            <Text style={styles.label}>Summary</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Write something about yourself..."
              value={aboutMe.summary}
              onChangeText={summary => setAboutMe(prev => ({ ...prev, summary }))}
              multiline
            />
          </View>
        );
      case 1:
        return (
          <View style={{ padding: 24 }}>
            <Text style={styles.title}>Languages & Skills</Text>
            <Text style={styles.label}>Languages</Text>
            {languages.map((lang, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <TextInput
                  style={[styles.input, { flex: 2, marginRight: 8 }]}
                  placeholder="Language"
                  value={lang.name}
                  onChangeText={name => {
                    const newLangs = [...languages];
                    newLangs[idx] = { ...newLangs[idx], name };
                    setLanguages(newLangs);
                  }}
                />
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  placeholder="Level (1-5)"
                  value={lang.level ? String(lang.level) : ''}
                  onChangeText={level => {
                    const newLangs = [...languages];
                    newLangs[idx] = { ...newLangs[idx], level: Number(level) };
                    setLanguages(newLangs);
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                />
                <TouchableOpacity onPress={() => setLanguages(languages.filter((_, i) => i !== idx))}>
                  <Text style={{ color: '#E53935', fontWeight: 'bold', fontSize: 18 }}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={{ marginTop: 8, alignSelf: 'flex-start', backgroundColor: isDark ? '#4F8EF7' : '#1976D2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
              onPress={() => setLanguages([...languages, { name: '', level: 1 }])}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Add Language</Text>
            </TouchableOpacity>
            <Text style={[styles.label, { marginTop: 24 }]}>Skills</Text>
            {skills.map((skill, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  placeholder="Skill"
                  value={skill}
                  onChangeText={val => {
                    const newSkills = [...skills];
                    newSkills[idx] = val;
                    setSkills(newSkills);
                  }}
                />
                <TouchableOpacity onPress={() => setSkills(skills.filter((_, i) => i !== idx))}>
                  <Text style={{ color: '#E53935', fontWeight: 'bold', fontSize: 18 }}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={{ marginTop: 8, alignSelf: 'flex-start', backgroundColor: isDark ? '#4F8EF7' : '#1976D2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
              onPress={() => setSkills([...skills, ''])}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Add Skill</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View style={{ padding: 24 }}>
            <Text style={styles.title}>Experience</Text>
            {experience.map((exp, idx) => (
              <View key={idx} style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: isDark ? '#333' : '#EEE', paddingBottom: 16 }}>
                <Text style={styles.label}>Job Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Job Title"
                  value={exp.jobTitle}
                  onChangeText={jobTitle => {
                    const newExp = [...experience];
                    newExp[idx] = { ...newExp[idx], jobTitle };
                    setExperience(newExp);
                  }}
                />
                <Text style={styles.label}>Company</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Company"
                  value={exp.company}
                  onChangeText={company => {
                    const newExp = [...experience];
                    newExp[idx] = { ...newExp[idx], company };
                    setExperience(newExp);
                  }}
                />
                <Text style={styles.label}>Start Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChangeText={startDate => {
                    const newExp = [...experience];
                    newExp[idx] = { ...newExp[idx], startDate };
                    setExperience(newExp);
                  }}
                />
                <Text style={styles.label}>End Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="End Date"
                  value={exp.endDate}
                  onChangeText={endDate => {
                    const newExp = [...experience];
                    newExp[idx] = { ...newExp[idx], endDate };
                    setExperience(newExp);
                  }}
                />
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="Description"
                  value={exp.description}
                  onChangeText={description => {
                    const newExp = [...experience];
                    newExp[idx] = { ...newExp[idx], description };
                    setExperience(newExp);
                  }}
                  multiline
                />
                <TouchableOpacity
                  style={{ marginTop: 8, alignSelf: 'flex-end', backgroundColor: '#E53935', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                  onPress={() => setExperience(experience.filter((_, i) => i !== idx))}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={{ marginTop: 8, alignSelf: 'flex-start', backgroundColor: isDark ? '#4F8EF7' : '#1976D2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
              onPress={() => setExperience([...experience, { jobTitle: '', company: '', startDate: '', endDate: '', description: '' }])}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Add Experience</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={{ padding: 24 }}>
            <Text style={styles.title}>Education</Text>
            {education.map((edu, idx) => (
              <View key={idx} style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: isDark ? '#333' : '#EEE', paddingBottom: 16 }}>
                <Text style={styles.label}>School</Text>
                <TextInput
                  style={styles.input}
                  placeholder="School"
                  value={edu.school}
                  onChangeText={school => {
                    const newEdu = [...education];
                    newEdu[idx] = { ...newEdu[idx], school };
                    setEducation(newEdu);
                  }}
                />
                <Text style={styles.label}>Degree</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Degree"
                  value={edu.degree}
                  onChangeText={degree => {
                    const newEdu = [...education];
                    newEdu[idx] = { ...newEdu[idx], degree };
                    setEducation(newEdu);
                  }}
                />
                <Text style={styles.label}>Start Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Start Date"
                  value={edu.startDate}
                  onChangeText={startDate => {
                    const newEdu = [...education];
                    newEdu[idx] = { ...newEdu[idx], startDate };
                    setEducation(newEdu);
                  }}
                />
                <Text style={styles.label}>End Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="End Date"
                  value={edu.endDate}
                  onChangeText={endDate => {
                    const newEdu = [...education];
                    newEdu[idx] = { ...newEdu[idx], endDate };
                    setEducation(newEdu);
                  }}
                />
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="Description"
                  value={edu.description}
                  onChangeText={description => {
                    const newEdu = [...education];
                    newEdu[idx] = { ...newEdu[idx], description };
                    setEducation(newEdu);
                  }}
                  multiline
                />
                <TouchableOpacity
                  style={{ marginTop: 8, alignSelf: 'flex-end', backgroundColor: '#E53935', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                  onPress={() => setEducation(education.filter((_, i) => i !== idx))}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={{ marginTop: 8, alignSelf: 'flex-start', backgroundColor: isDark ? '#4F8EF7' : '#1976D2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
              onPress={() => setEducation([...education, { school: '', degree: '', startDate: '', endDate: '', description: '' }])}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Add Education</Text>
            </TouchableOpacity>
          </View>
        );
      case 4:
        return (
          <View style={{ padding: 24 }}>
            <Text style={styles.title}>Select Template</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
              {TEMPLATES.map(template => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateCard,
                    selectedTemplate === template.id && styles.selectedTemplate,
                  ]}
                  onPress={() => setSelectedTemplate(template.id)}
                >
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateDesc}>{template.description}</Text>
                  {selectedTemplate === template.id && (
                    <Text style={styles.selectedLabel}>Selected</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
              languages,
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
            <View
              style={{
                position: 'absolute',
                right: 20,
                bottom: 20,
                zIndex: 10,
              }}
              pointerEvents="box-none"
            >
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.buttonPrimary,
                  {
                    borderRadius: 32,
                    width: 64,
                    height: 64,
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 6,
                  },
                  !selectedTemplate && styles.buttonDisabled,
                ]}
                onPress={handleDownloadPDF}
                disabled={!selectedTemplate}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 24 }}>↓</Text>
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
