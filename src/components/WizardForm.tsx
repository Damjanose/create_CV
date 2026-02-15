import React, { useRef, useEffect, useState } from "react";
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
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { WebView } from "react-native-webview";

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
  const [uploadProgress, setUploadProgress] = useState(false);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
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
    fieldErrors,
    validateField,
    clearFieldError,
    selectedTemplate,
    setSelectedTemplate,
    canGoNext,
    handleNext,
    handleBack,
    handleDownloadPDF,
    animateTo,
    // New features
    isGeneratingPdf,
    showPdfPreview,
    setShowPdfPreview,
    pdfPreviewHtml,
    handleConfirmDownload,
    hasDraft,
    loadDraft,
    clearDraft,
    lastSaved,
  } = useWizardForm();

  // Show draft prompt when app loads and draft exists
  useEffect(() => {
    if (hasDraft && step === 0) {
      setShowDraftPrompt(true);
    }
  }, [hasDraft]);

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

  const normalizeKey = (key: string): string =>
    key
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  const KEY_ALIASES: Record<string, string[]> = {
    "contact.name": ["name", "first_name", "firstname", "first", "given_name", "givenname"],
    "contact.lastname": ["lastname", "last_name", "surname", "family_name", "familyname", "last"],
    "contact.email": ["email", "mail", "email_address", "emailaddress"],
    "contact.phone": ["phone", "phone_number", "phonenumber", "mobile", "telephone", "tel"],
    "address.countryName": ["country", "country_name", "countryname"],
    "address.cityName": ["city", "city_name", "cityname", "town"],
    "address.address1": ["address", "address1", "street", "street_address", "streetaddress"],
    "address.address2": ["address2", "apartment", "apt", "unit"],
    "aboutMe.summary": ["summary", "about", "about_me", "aboutme", "profile", "objective", "professional_summary"],
  };

  const aliasToCanonical = Object.entries(KEY_ALIASES).reduce<Record<string, string>>((acc, [canonical, aliases]) => {
    for (const alias of aliases) {
      acc[normalizeKey(alias)] = canonical;
    }
    return acc;
  }, {});

  const toLanguageLevel = (rawLevel?: string): number => {
    const level = (rawLevel || "").toLowerCase().trim();
    if (!level) return 3;
    if (["native", "c2"].includes(level)) return 5;
    if (["fluent", "c1", "advanced", "b2", "proficient"].includes(level)) return 4;
    if (["intermediate", "upper_intermediate", "upper intermediate", "b1"].includes(level)) return 3;
    if (["basic", "elementary", "a2", "pre_intermediate", "pre intermediate"].includes(level)) return 2;
    if (["beginner", "a1"].includes(level)) return 1;
    return 3;
  };

  const decodeBase64ToBinary = (base64: string): string => {
    if (typeof globalThis.atob === "function") {
      return globalThis.atob(base64);
    }

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    let buffer = 0;
    let accumulatedBits = 0;

    for (let index = 0; index < base64.length; index++) {
      const char = base64.charAt(index);
      if (char === "=") break;
      const value = chars.indexOf(char);
      if (value < 0) continue;

      buffer = (buffer << 6) | value;
      accumulatedBits += 6;

      if (accumulatedBits >= 8) {
        accumulatedBits -= 8;
        output += String.fromCharCode((buffer >> accumulatedBits) & 0xff);
      }
    }

    return output;
  };

  const isLikelyHumanText = (value: string, minLength: number = 8): boolean => {
    const text = (value || "").trim();
    if (text.length < minLength) return false;

    const withoutSpaces = text.replace(/\s+/g, "");
    if (!withoutSpaces) return false;

    const letters = (withoutSpaces.match(/[A-Za-z]/g) || []).length;
    const digits = (withoutSpaces.match(/[0-9]/g) || []).length;
    const allowedSymbols = (withoutSpaces.match(/[.,;:()@+\-/'&]/g) || []).length;
    const unknownSymbols = Math.max(withoutSpaces.length - letters - digits - allowedSymbols, 0);

    const alphaRatio = letters / withoutSpaces.length;
    const noiseRatio = unknownSymbols / withoutSpaces.length;

    const words = text.split(/\s+/).filter(Boolean);
    const wordLike = words.filter(word => /[A-Za-z]{2,}/.test(word)).length;
    const wordRatio = wordLike / Math.max(words.length, 1);

    return alphaRatio >= 0.45 && noiseRatio <= 0.08 && wordRatio >= 0.45;
  };

  // Function to parse CV text and extract information
  const parseCVText = (text: string) => {
    const parsedData: any = {
      contact: { name: "", lastname: "", phone: "", email: "" },
      address: { countryName: "", cityName: "", address1: "", address2: "" },
      aboutMe: { summary: "" },
      experience: [],
      education: [],
      skills: [],
      languages: [],
    };

    // Preserve line structure to improve section/key parsing reliability
    const normalizedText = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map(line => line.replace(/[\t ]+/g, " ").trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const lines = normalizedText.split("\n").map(line => line.trim()).filter(Boolean);
    const flatText = lines.join(" ");

    console.log("Normalized text for parsing:", normalizedText.substring(0, 1000));

    // ========== DIRECT KEY:VALUE MAPPING ==========
    for (const line of lines) {
      const keyValueMatch = line.match(/^([A-Za-z][A-Za-z\s_\-/]{1,40})\s*[:\-–—]\s*(.+)$/);
      if (!keyValueMatch) continue;
      const rawKey = normalizeKey(keyValueMatch[1]);
      const value = keyValueMatch[2].trim();
      if (!value) continue;

      const canonical = aliasToCanonical[rawKey];
      if (!canonical) continue;

      if (canonical === "contact.name") parsedData.contact.name = value;
      if (canonical === "contact.lastname") parsedData.contact.lastname = value;
      if (canonical === "contact.email") parsedData.contact.email = value.toLowerCase();
      if (canonical === "contact.phone") parsedData.contact.phone = value;
      if (canonical === "address.countryName") parsedData.address.countryName = value;
      if (canonical === "address.cityName") parsedData.address.cityName = value;
      if (canonical === "address.address1") parsedData.address.address1 = value;
      if (canonical === "address.address2") parsedData.address.address2 = value;
      if (canonical === "aboutMe.summary" && isLikelyHumanText(value, 20)) {
        parsedData.aboutMe.summary = value;
      }
    }

    // ========== EXTRACT EMAIL ==========
    const emailMatch = flatText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i);
    if (emailMatch) {
      if (!parsedData.contact.email) {
        parsedData.contact.email = emailMatch[0].toLowerCase();
      }
      console.log("Found email:", parsedData.contact.email);
    }

    // ========== EXTRACT PHONE ==========
    // Match various phone formats including international
    const phonePatterns = [
      /\+\d{1,3}[\s\-]?\(?\d{2,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{3,4}/g, // International format
      /\(\+\d{1,3}\)\s*\d{6,}/g, // (+355) 696243358 format
      /\+\d{10,15}/g, // +355696243358 format
      /\d{3}[\s\-]?\d{3}[\s\-]?\d{4}/g, // US format
      /\d{10,}/g, // Plain digits
    ];
    
    for (const pattern of phonePatterns) {
      const phoneMatch = flatText.match(pattern);
      if (phoneMatch) {
        // Clean the phone number
        let phone = phoneMatch[0].replace(/[^\d+\-\(\)\s]/g, '').trim();
        if (phone.length >= 7) {
          if (!parsedData.contact.phone) {
            parsedData.contact.phone = phone;
          }
          console.log("Found phone:", parsedData.contact.phone);
          break;
        }
      }
    }

    // ========== EXTRACT NAME ==========
    // Strategy 1: Look for name patterns at the beginning
    // Common section headers to skip
    const sectionHeaders = /^(contact|about|summary|profile|experience|work|education|skills|languages|hobbies|interests|objective|curriculum vitae|cv|resume)/i;
    
    // Try to find name in first few meaningful lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      
      // Skip if it looks like a section header
      if (sectionHeaders.test(line)) continue;
      
      // Skip if it contains email or phone
      if (line.includes('@') || /\d{5,}/.test(line)) continue;
      
      // Skip if it's too short or too long
      if (line.length < 3 || line.length > 50) continue;
      
      // Check if it looks like a name (2-4 words, capitalized)
      const words = line.split(/\s+/).filter(w => w.length > 0);
      if (words.length >= 2 && words.length <= 4) {
        // Check if words look like names (start with capital, mostly letters)
        const looksLikeName = words.every(word => 
          /^[A-Z][a-z]*$/.test(word) || /^[A-Z]+$/.test(word)
        );
        
        if (looksLikeName || i === 0) {
          if (!parsedData.contact.name) {
            parsedData.contact.name = words[0];
          }
          if (!parsedData.contact.lastname) {
            parsedData.contact.lastname = words.slice(1).join(' ');
          }
          console.log("Found name:", parsedData.contact.name, parsedData.contact.lastname);
          break;
        }
      }
    }

    // Strategy 2: If no name found, look near email
    if (!parsedData.contact.name && emailMatch) {
      const emailIndex = flatText.indexOf(emailMatch[0]);
      const textBeforeEmail = flatText.substring(Math.max(0, emailIndex - 100), emailIndex);
      const nameCandidate = textBeforeEmail.match(/([A-Z][a-z]+)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
      if (nameCandidate) {
        parsedData.contact.name = nameCandidate[1];
        parsedData.contact.lastname = nameCandidate[2];
        console.log("Found name near email:", parsedData.contact.name, parsedData.contact.lastname);
      }
    }

    // ========== EXTRACT ADDRESS/LOCATION ==========
    // Look for location patterns
    const locationPatterns = [
      /(?:location|address|based in|living in|residing in)[:\s]*([A-Za-z\s,]+)/i,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g, // City, Country pattern
    ];
    
    // Common country names to help identify locations
    const countries = ['Albania', 'USA', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Poland', 'Czech', 'Romania', 'Bulgaria', 'Greece', 'Turkey', 'Russia', 'Ukraine', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland', 'Portugal', 'Hungary', 'Croatia', 'Serbia', 'Slovenia', 'Slovakia', 'Kosovo', 'North Macedonia', 'Montenegro', 'Bosnia'];
    
    for (const country of countries) {
      const countryRegex = new RegExp(`([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)?)[,\\s]+${country}`, 'i');
      const match = flatText.match(countryRegex);
      if (match) {
        if (!parsedData.address.cityName) {
          parsedData.address.cityName = match[1].trim();
        }
        if (!parsedData.address.countryName) {
          parsedData.address.countryName = country;
        }
        console.log("Found location:", parsedData.address.cityName, parsedData.address.countryName);
        break;
      }
    }

    // ========== EXTRACT SUMMARY/ABOUT ME ==========
    // Look for summary section
    const summaryPatterns = [
      /(?:summary|about me|profile|objective|professional summary)[:\s]*\n?([^]*?)(?=\n(?:experience|work|education|skills|languages|$))/i,
      /(?:summary|about me|profile|objective)[:\s]*([^]*?)(?=\n[A-Z])/i,
    ];
    
    for (const pattern of summaryPatterns) {
      const summaryMatch = normalizedText.match(pattern);
      if (summaryMatch && summaryMatch[1]) {
        let summary = summaryMatch[1]
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Take first 500 characters max
        if (summary.length > 500) {
          summary = summary.substring(0, 500) + '...';
        }
        
        if (summary.length > 20) {
          if (!parsedData.aboutMe.summary && isLikelyHumanText(summary, 30)) {
            parsedData.aboutMe.summary = summary;
          }
          console.log("Found summary:", summary.substring(0, 100));
          break;
        }
      }
    }

    // ========== EXTRACT EXPERIENCE ==========
    const experienceSection = normalizedText.match(
      /(?:experience|work experience|employment|professional experience|work history)[:\s]*\n?([^]*?)(?=\n(?:education|skills|languages|hobbies|interests|$))/i
    );
    
    if (experienceSection && experienceSection[1]) {
      const expText = experienceSection[1];
      console.log("Experience section found:", expText.substring(0, 300));
      
      // Pattern to match job entries
      // Look for patterns like: "Job Title at Company" or "Job Title - Company" or date ranges
      const dateRangePattern = /(\d{1,2}\/\d{4}|\w+\s+\d{4}|\d{4})\s*(?:-|–|—|to)\s*(\d{1,2}\/\d{4}|\w+\s+\d{4}|\d{4}|present|current|now)/gi;
      
      // Split by date ranges to find job entries
      let currentExp: any = null;
      
      // Simpler approach: look for lines with dates and extract job info
      const expLines = expText.split(/\n/).filter(l => l.trim());
      let jobBuffer: string[] = [];
      
      for (let i = 0; i < expLines.length; i++) {
        const line = expLines[i].trim();
        const hasDate = /\d{4}/.test(line) || /present|current/i.test(line);
        
        if (hasDate && line.length > 10) {
          // This might be a job entry header
          if (currentExp && (currentExp.jobTitle || currentExp.company)) {
            currentExp.description = jobBuffer.join('\n').trim();
            if (currentExp.jobTitle || currentExp.company) {
              parsedData.experience.push(currentExp);
            }
            jobBuffer = [];
          }
          
          // Parse the job line
          const dateMatch = line.match(/(\d{1,2}\/\d{4}|\w+\s+\d{4}|\d{4})\s*(?:-|–|—|to)\s*(\d{1,2}\/\d{4}|\w+\s+\d{4}|\d{4}|present|current|now)/i);
          
          // Remove dates from line to get job title and company
          let jobInfo = line.replace(dateRangePattern, '').trim();
          jobInfo = jobInfo.replace(/[-–—•]/g, ' ').trim();
          
          const jobParts = jobInfo.split(/\s+at\s+|\s+@\s+|\s+-\s+|\s+,\s+/i);
          
          currentExp = {
            jobTitle: jobParts[0]?.trim() || '',
            company: jobParts[1]?.trim() || jobParts[0]?.trim() || '',
            startDate: dateMatch ? dateMatch[1] : "",
            endDate: dateMatch ? dateMatch[2] : "Present",
            ongoing: dateMatch ? /present|current|now/i.test(dateMatch[2]) : false,
            description: '',
          };
        } else if (currentExp && line.length > 5) {
          // This is description content
          jobBuffer.push(line);
        }
      }
      
      // Don't forget the last job
      if (currentExp && (currentExp.jobTitle || currentExp.company)) {
        currentExp.description = jobBuffer.join('\n').trim();
        parsedData.experience.push(currentExp);
      }
      
      console.log("Parsed experience entries:", parsedData.experience.length);
    }

    // ========== EXTRACT EDUCATION ==========
    const educationSection = normalizedText.match(
      /(?:education|academic|qualifications|academic background)[:\s]*\n?([^]*?)(?=\n(?:experience|skills|languages|hobbies|interests|work|$))/i
    );
    
    if (educationSection && educationSection[1]) {
      const eduText = educationSection[1];
      console.log("Education section found:", eduText.substring(0, 300));
      
      const eduLines = eduText.split(/\n/).filter(l => l.trim());
      let currentEdu: any = null;
      let eduBuffer: string[] = [];
      
      for (let i = 0; i < eduLines.length; i++) {
        const line = eduLines[i].trim();
        const hasDate = /\d{4}/.test(line) || /present|current/i.test(line);
        
        if (hasDate && line.length > 10) {
          if (currentEdu && (currentEdu.degree || currentEdu.school)) {
            currentEdu.description = eduBuffer.join('\n').trim();
            parsedData.education.push(currentEdu);
            eduBuffer = [];
          }
          
          const dateMatch = line.match(/(\d{1,2}\/\d{4}|\w+\s+\d{4}|\d{4})\s*(?:-|–|—|to)\s*(\d{1,2}\/\d{4}|\w+\s+\d{4}|\d{4}|present|current|now)/i);
          
          let eduInfo = line.replace(/(\d{1,2}\/\d{4}|\w+\s+\d{4}|\d{4})\s*[-–—to]+\s*(\d{1,2}\/\d{4}|\w+\s+\d{4}|\d{4}|present|current|now)/gi, '').trim();
          eduInfo = eduInfo.replace(/[-–—•]/g, ' ').trim();
          
          const eduParts = eduInfo.split(/\s+at\s+|\s+@\s+|\s+-\s+|\s+,\s+/i);
          
          currentEdu = {
            degree: eduParts[0]?.trim() || '',
            school: eduParts[1]?.trim() || eduParts[0]?.trim() || '',
            startDate: dateMatch ? dateMatch[1] : "",
            endDate: dateMatch ? dateMatch[2] : "Present",
            ongoing: dateMatch ? /present|current|now/i.test(dateMatch[2]) : false,
            description: '',
          };
        } else if (currentEdu && line.length > 5) {
          eduBuffer.push(line);
        }
      }
      
      if (currentEdu && (currentEdu.degree || currentEdu.school)) {
        currentEdu.description = eduBuffer.join('\n').trim();
        parsedData.education.push(currentEdu);
      }
      
      console.log("Parsed education entries:", parsedData.education.length);
    }

    // ========== EXTRACT SKILLS ==========
    const skillsSection = normalizedText.match(
      /(?:skills|technical skills|core skills|competencies|expertise)[:\s]*\n?([^]*?)(?=\n(?:experience|education|languages|hobbies|interests|$))/i
    );
    
    if (skillsSection && skillsSection[1]) {
      const skillsText = skillsSection[1];
      console.log("Skills section found:", skillsText.substring(0, 200));
      
      // Extract skills - they can be comma-separated, bullet points, or newline-separated
      const skillMatches = skillsText
        .replace(/[•\-\*]/g, ',')
        .split(/[,\n]/)
        .map(s => s.trim())
        .filter(s => {
          // Must be a reasonable skill (not too short, not a section header)
          return s.length >= 2 && 
                 s.length <= 50 && 
                 !/^(skills|technical|core|competencies)$/i.test(s) &&
                 /[A-Za-z]/.test(s);
        });
      
      if (skillMatches.length > 0) {
        parsedData.skills = skillMatches.slice(0, 20); // Limit to 20 skills
        console.log("Parsed skills:", parsedData.skills);
      }
    }

    // ========== EXTRACT LANGUAGES ==========
    const languagesSection = normalizedText.match(
      /(?:languages|language skills)[:\s]*\n?([^]*?)(?=\n(?:experience|education|skills|hobbies|interests|$))/i
    );
    
    if (languagesSection && languagesSection[1]) {
      const langText = languagesSection[1];
      console.log("Languages section found:", langText.substring(0, 200));
      
      // Common language levels
      // Common languages to look for
      const commonLanguages = ['English', 'Albanian', 'Italian', 'German', 'French', 'Spanish', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Arabic', 'Turkish', 'Greek', 'Dutch', 'Polish', 'Romanian', 'Serbian', 'Croatian', 'Macedonian', 'Bulgarian'];
      
      for (const lang of commonLanguages) {
        const langRegex = new RegExp(`${lang}[:\\s]*[-–—]?\\s*(native|fluent|advanced|proficient|intermediate|elementary|beginner|basic|a1|a2|b1|b2|c1|c2)?`, 'i');
        const match = langText.match(langRegex);
        if (match) {
          const level = match[1]?.toLowerCase() || 'intermediate';
          parsedData.languages.push({
            name: lang,
            level: toLanguageLevel(level),
          });
        }
      }

      // Additional line-based language parsing for formats like: "English - C1"
      for (const line of langText.split(/\n|,/).map(item => item.trim()).filter(Boolean)) {
        const lineMatch = line.match(/^([A-Za-z][A-Za-z\s]{1,20})\s*[:\-–—]?\s*(native|fluent|advanced|proficient|upper intermediate|intermediate|pre-intermediate|elementary|beginner|basic|a1|a2|b1|b2|c1|c2)?$/i);
        if (!lineMatch) continue;
        const languageName = lineMatch[1].trim();
        const alreadyAdded = parsedData.languages.some((item: any) => item.name.toLowerCase() === languageName.toLowerCase());
        if (!alreadyAdded) {
          parsedData.languages.push({
            name: languageName,
            level: toLanguageLevel(lineMatch[2]),
          });
        }
      }
      
      console.log("Parsed languages:", parsedData.languages);
    }

    // Fallback: if summary missing, use first meaningful paragraph
    if (!parsedData.aboutMe.summary) {
      const fallbackSummary = lines
        .filter(line => line.length > 30 && line.length < 260)
        .find(line => !sectionHeaders.test(line) && !line.includes("@") && !/\d{5,}/.test(line));
      if (fallbackSummary && isLikelyHumanText(fallbackSummary, 30)) {
        parsedData.aboutMe.summary = fallbackSummary;
      }
    }

    if (parsedData.aboutMe.summary && !isLikelyHumanText(parsedData.aboutMe.summary, 30)) {
      parsedData.aboutMe.summary = "";
    }

    // Fallback: infer first/last name from email prefix if still missing
    if ((!parsedData.contact.name || !parsedData.contact.lastname) && parsedData.contact.email) {
      const emailPrefix = parsedData.contact.email.split("@")[0] || "";
      const nameParts = emailPrefix
        .replace(/[._-]+/g, " ")
        .split(" ")
        .map((part: string) => part.trim())
        .filter(Boolean)
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1));

      if (!parsedData.contact.name && nameParts[0]) {
        parsedData.contact.name = nameParts[0];
      }
      if (!parsedData.contact.lastname && nameParts.length > 1) {
        parsedData.contact.lastname = nameParts.slice(1).join(" ");
      }
    }

    // Remove duplicates from arrays
    parsedData.skills = Array.from(new Set(parsedData.skills.map((skill: string) => skill.trim()).filter(Boolean)));
    parsedData.languages = parsedData.languages.filter((lang: any, index: number, arr: any[]) => {
      return arr.findIndex(item => item.name.toLowerCase() === lang.name.toLowerCase()) === index;
    });

    return parsedData;
  };

  const handleUploadResume = async () => {
    Alert.alert(
      "Coming Soon",
      "Upload CV is temporarily disabled while we improve parsing quality."
    );
    return;

    try {
      // Request storage permission for Android
      if (Platform.OS === "android") {
        const version =
          typeof Platform.Version === "string"
            ? parseInt(Platform.Version as string, 10)
            : Platform.Version as number;
        let permission;
        if ((version as number) >= 33) {
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

      console.log("DocumentPicker result:", JSON.stringify(result, null, 2));

      // DocumentPicker returns an array or single object depending on version
      let file: any;
      const resultArr: any[] = (Array.isArray(result) ? result : [result]) as any[];
      if (resultArr.length === 0) {
        Alert.alert("Error", "No file selected.");
        return;
      }
      file = resultArr[0];
      
      console.log("Selected file:", JSON.stringify(file, null, 2));

      // Show upload progress
      setUploadProgress(true);

      try {
        // Get file URI - ALWAYS prioritize fileCopyUri since we set copyTo: "cachesDirectory"
        // On Android, fileCopyUri should contain the actual file path after copying
        // If fileCopyUri exists and is not a content URI, use it directly
        let fileUri: string;
        
        if (file.fileCopyUri && !file.fileCopyUri.startsWith("content://")) {
          fileUri = file.fileCopyUri;
          console.log("Using fileCopyUri (not content URI):", fileUri);
        } else {
          const uri = file.uri || (file as any).fileUri || file.path;
          if (!uri) {
            throw new Error("Could not access the selected file. No URI found.");
          }
          fileUri = uri;
          console.log("Using original URI:", fileUri);
        }
        
        console.log("file.fileCopyUri:", file.fileCopyUri);
        console.log("file.uri:", file.uri);

        // Handle Android content URIs - RNFS cannot read content:// URIs directly
        if (Platform.OS === "android" && fileUri.startsWith("content://")) {
          console.log("Detected content URI, attempting to handle...");
          
          // If we have fileCopyUri, use that (it should be the copied file path)
          if (file.fileCopyUri && !file.fileCopyUri.startsWith("content://")) {
            fileUri = file.fileCopyUri;
            console.log("Using fileCopyUri:", fileUri);
          } else {
            // Copy content URI to cache directory manually
            const fileName = file.name || `uploaded_${Date.now()}.pdf`;
            const cachePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
            console.log("Copying content URI to cache:", cachePath);
            
            try {
              // For Android content URIs, we need to read the file and write it to cache
              // First, try to use copyFileAssets if available, otherwise read and write
              try {
                // Try direct copy first
                await RNFS.copyFile(fileUri, cachePath);
                fileUri = cachePath;
                console.log("Successfully copied file to cache:", fileUri);
              } catch (directCopyError: any) {
                // If direct copy fails, read the file content and write it
                console.log("Direct copy failed, trying read/write method...");
                const fileContent = await RNFS.readFile(fileUri, "base64");
                await RNFS.writeFile(cachePath, fileContent, "base64");
                fileUri = cachePath;
                console.log("Successfully wrote file to cache:", fileUri);
              }
            } catch (copyError: any) {
              console.error("Failed to copy file:", copyError);
              throw new Error(`Could not access the selected file: ${copyError?.message || "Unknown error"}. Please try selecting the file again.`);
            }
          }
        }
        
        // Remove file:// prefix if present for RNFS operations
        let cleanUri = fileUri.replace(/^file:\/\//, "");
        console.log("Clean URI for RNFS:", cleanUri);
        
        // Check if file exists
        let fileExists = await RNFS.exists(cleanUri);
        console.log("File exists:", fileExists, "at path:", cleanUri);
        
        if (!fileExists) {
          // Try with file:// prefix
          const withPrefix = `file://${cleanUri}`;
          fileExists = await RNFS.exists(withPrefix);
          console.log("File exists with prefix:", fileExists, "at path:", withPrefix);
          
          if (fileExists) {
            cleanUri = withPrefix.replace(/^file:\/\//, "");
          } else {
            throw new Error(`File does not exist at path: ${cleanUri}`);
          }
        }
        
        fileUri = cleanUri;
        
        if (!fileUri) {
          throw new Error("Could not determine file path.");
        }
          
        // Simulate upload/parsing progress
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Read PDF file as base64
        // Remove file:// prefix if present for readFile
        const readUri = fileUri.replace(/^file:\/\//, "");
        console.log("Reading PDF file from:", readUri);
        const base64Content = await RNFS.readFile(readUri, "base64");
        console.log("PDF file read successfully, size:", base64Content.length);
        
        // Extract text from PDF
        // For text-based PDFs, we can try to extract text from the content
        let extractedText = "";
        try {
          // Convert base64 to binary string and try to extract text
          // Uses fallback decoder for environments where atob is unavailable
          const binaryString = decodeBase64ToBinary(base64Content);
          
          console.log("PDF binary size:", binaryString.length);
          
          // Method 1: Extract text from BT/ET blocks (PDF text objects)
          // PDF text is often in format: BT ... (text) Tj ... ET
          const textBlocks: string[] = [];
          const btEtRegex = /BT[\s\S]*?ET/g;
          let btMatch;
          while ((btMatch = btEtRegex.exec(binaryString)) !== null) {
            const block = btMatch[0];
            // Extract text from Tj and TJ operators
            const tjMatches = block.match(/\((.*?)\)\s*Tj/g);
            const tjArrayMatches = block.match(/\[(.*?)\]\s*TJ/g);
            
            if (tjMatches) {
              tjMatches.forEach((m: string) => {
                const text = m.match(/\((.*?)\)/)?.[1] || '';
                if (text && text.length > 0) {
                  const decoded = decodesPdfString(text);
                  if (isLikelyHumanText(decoded, 2)) {
                    textBlocks.push(decoded);
                  }
                }
              });
            }
            
            if (tjArrayMatches) {
              tjArrayMatches.forEach((m: string) => {
                // TJ arrays contain text strings and positioning numbers
                const arrayContent = m.match(/\[(.*?)\]/)?.[1] || '';
                const texts = arrayContent.match(/\((.*?)\)/g);
                if (texts) {
                  const combinedText = texts.map((t: string) => decodesPdfString(t.replace(/[()]/g, ''))).join('');
                  if (isLikelyHumanText(combinedText, 2)) textBlocks.push(combinedText);
                }
              });
            }
          }
          
          // Helper function to decode PDF string escape sequences
          function decodesPdfString(str: string): string {
            return str
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '\r')
              .replace(/\\t/g, '\t')
              .replace(/\\\(/g, '(')
              .replace(/\\\)/g, ')')
              .replace(/\\\\/g, '\\')
              .replace(/\\(\d{3})/g, (match, octal) => String.fromCharCode(parseInt(octal, 8)));
          }
          
          if (textBlocks.length > 0) {
            extractedText = textBlocks.join(' ');
            console.log("Method 1 (BT/ET blocks) extracted:", textBlocks.length, "blocks");
          }
          
          // Method 2: Extract text between parentheses (simpler PDF text objects)
          if (extractedText.length < 100) {
            const textMatches = binaryString.match(/\(([^()\\]|\\.){2,}\)/g);
            if (textMatches && textMatches!.length > 0) {
              const extractedParts = textMatches!
                .map(match => {
                  let text = match.replace(/[()]/g, '');
                  text = decodesPdfString(text);
                  return text;
                })
                .filter(text => {
                  const trimmed = text.trim();
                  // Must have letters and be readable
                      return isLikelyHumanText(trimmed, 2);
                });
              
              if (extractedParts.length > 0) {
                const methodTwoText = extractedParts.join(' ');
                if (methodTwoText.length > extractedText.length) {
                  extractedText = methodTwoText;
                  console.log("Method 2 (parentheses) extracted:", extractedParts.length, "parts");
                }
              }
            }
          }
          
          // Method 3: Look for UTF-16BE encoded strings (common in PDFs)
          if (extractedText.length < 100) {
            // UTF-16BE strings start with FEFF BOM
            const utf16Matches = binaryString.match(/\xFE\xFF[\x00-\xFF]{4,}/g);
            if (utf16Matches) {
              utf16Matches!.forEach(match => {
                try {
                  // Skip BOM and decode UTF-16BE
                  let decoded = '';
                  for (let i = 2; i < match.length - 1; i += 2) {
                    const charCode = (match.charCodeAt(i) << 8) + match.charCodeAt(i + 1);
                    if (charCode >= 32 && charCode < 127) {
                      decoded += String.fromCharCode(charCode);
                    } else if (charCode === 0) {
                      decoded += ' ';
                    }
                  }
                  if (isLikelyHumanText(decoded, 3)) {
                    extractedText += ' ' + decoded;
                  }
                } catch (e) {
                  // Ignore decode errors
                }
              });
              console.log("Method 3 (UTF-16BE) applied");
            }
          }
          
          // Method 4: Extract from stream objects (for compressed content)
          if (extractedText.length < 100) {
            // Look for uncompressed streams
            const streamMatches = binaryString.match(/stream[\r\n]+([\s\S]{10,}?)[\r\n]+endstream/g);
            if (streamMatches) {
              streamMatches!.forEach(stream => {
                // Try to find readable text sequences
                const readable = stream.match(/[A-Za-z][A-Za-z\s@.\-+(),]{10,}/g);
                if (readable) {
                  const qualityReadable = readable.filter(item => isLikelyHumanText(item, 10));
                  if (qualityReadable.length > 0) {
                    extractedText += ' ' + qualityReadable.join(' ');
                  }
                }
              });
              console.log("Method 4 (streams) checked:", streamMatches!.length, "streams");
            }
          }
          
          // Method 5: Fallback - extract any readable ASCII sequences
          if (extractedText.length < 50) {
            // Look for email pattern specifically
            const emailInBinary = binaryString.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
            if (emailInBinary) {
              extractedText += ' ' + emailInBinary!.join(' ');
              console.log("Found emails in binary:", emailInBinary);
            }
            
            // Look for phone patterns
            const phoneInBinary = binaryString.match(/\+?\d[\d\s\-()]{7,}/g);
            if (phoneInBinary) {
              extractedText += ' ' + phoneInBinary!.join(' ');
              console.log("Found phones in binary:", phoneInBinary);
            }
            
            // Look for long readable sequences
            const readableText = binaryString.match(/[A-Za-z][A-Za-z\s]{15,}/g);
            if (readableText) {
              const filtered = readableText!
                .filter(text => isLikelyHumanText(text, 10))
                .join(' ');
              if (filtered) {
                extractedText += ' ' + filtered;
                console.log("Method 5 (fallback readable) added");
              }
            }
          }
          
          // Clean up extracted text while preserving line structure for section parsing
          extractedText = extractedText
            .replace(/[^\x20-\x7E\n\r@.+\-]/g, " ")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .split("\n")
            .map(line => line.replace(/[\t ]+/g, " ").trim())
            .join("\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

          const qualityLines = extractedText
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean)
            .filter(line => isLikelyHumanText(line, 2) || /@|\+?\d[\d\s\-()]{6,}/.test(line));

          if (qualityLines.length > 0) {
            extractedText = qualityLines.join("\n");
          }
          
          console.log("=== FINAL EXTRACTED TEXT ===");
          console.log("Length:", extractedText.length);
          console.log("Preview (first 1000 chars):", extractedText.substring(0, 1000));
          console.log("============================");
          
          if (extractedText.length === 0) {
            console.warn("No text could be extracted from PDF. The PDF might be image-based or encrypted.");
            Alert.alert(
              "Limited PDF Support",
              "This PDF appears to be image-based or uses a format we can't fully parse. Some information may not be extracted automatically. You can still fill in the form manually."
            );
          }
        } catch (extractError: any) {
          console.error("Error extracting text from PDF:", extractError);
          // Continue with empty text - parser will still try to extract what it can
        }
        
        // Parse extracted text and extract CV data
        const parsedData = parseCVText(extractedText);
          
          console.log("Parsed data:", parsedData);
          
          // Auto-fill form fields with parsed data (prefer existing values if user already typed)
          setContact((prev) => ({
            ...prev,
            name: prev.name || parsedData.contact.name || prev.name,
            lastname: prev.lastname || parsedData.contact.lastname || prev.lastname,
            email: prev.email || parsedData.contact.email || prev.email,
            phone: prev.phone || parsedData.contact.phone || prev.phone,
          }));

          setAddress((prev) => ({
            ...prev,
            cityName: prev.cityName || parsedData.address.cityName || prev.cityName,
            countryName: prev.countryName || parsedData.address.countryName || prev.countryName,
            address1: prev.address1 || parsedData.address.address1 || prev.address1,
            address2: prev.address2 || parsedData.address.address2 || prev.address2,
          }));

          setAboutMe((prev) => ({
            ...prev,
            summary: (() => {
              const prevIsValid = isLikelyHumanText(prev.summary || "", 30);
              const nextIsValid = isLikelyHumanText(parsedData.aboutMe.summary || "", 30);

              if (!prevIsValid && nextIsValid) return parsedData.aboutMe.summary;
              if (!prevIsValid && !nextIsValid) return "";
              return prev.summary || (nextIsValid ? parsedData.aboutMe.summary : prev.summary);
            })(),
          }));

          if (parsedData.experience.length > 0) {
            setExperience((prev) => (prev.length > 0 ? prev : parsedData.experience));
          }
          if (parsedData.education.length > 0) {
            setEducation((prev) => (prev.length > 0 ? prev : parsedData.education));
          }
          if (parsedData.skills.length > 0) {
            setSkills((prev) => {
              const existing = prev.filter((item: string) => item.trim() !== "");
              if (existing.length > 0) return prev;
              return parsedData.skills.filter((s: string) => s.trim() !== "");
            });
          }
          if (parsedData.languages.length > 0) {
            setLanguages((prev) => (prev.length > 0 ? prev : parsedData.languages));
          }
          
          console.log("=== AUTO-FILL SUMMARY ===");
          console.log("Contact:", parsedData.contact);
          console.log("Address:", parsedData.address);
          console.log("Summary:", parsedData.aboutMe.summary ? "Found" : "Not found");
          console.log("Experience entries:", parsedData.experience.length);
          console.log("Education entries:", parsedData.education.length);
          console.log("Skills:", parsedData.skills.length);
          console.log("Languages:", parsedData.languages.length);
          console.log("=========================");
          
          console.log("Upload complete, navigating to template selection");
          setUploadProgress(false);
          
          // Small delay to ensure state updates are processed
          await new Promise((resolve) => setTimeout(resolve, 100));
          
          // Navigate to template selection step
          animateTo(1);
        
        } catch (readError: any) {
          setUploadProgress(false);
          console.error("PDF upload error:", readError);
          console.error("Error details:", JSON.stringify(readError, null, 2));
          Alert.alert(
            "Error",
            `Could not read the PDF file: ${readError?.message || "Unknown error"}. Please make sure it's a valid PDF document.`
          );
        }
    } catch (err: any) {
      setUploadProgress(false);
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
            uploadComingSoon={true}
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
            fieldErrors={fieldErrors}
            validateField={validateField}
            clearFieldError={clearFieldError}
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
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: styles.container.backgroundColor }}>
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
          style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: styles.container.backgroundColor }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
        <View style={styles.container}>
          <Animated.View style={[styles.card, { opacity: fadeAnim, flex: 1 }]}>            
            {errorMsg ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <ScrollView
              style={{ flex: 1, width: "100%" }}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.content}>{renderStepContent()}</View>
            </ScrollView>

            {step > 0 && (
              <View style={[styles.buttonRow, { marginTop: 16 }]}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.buttonSecondary,
                    step === 0 && styles.buttonDisabled,
                  ]}
                  onPress={handleBack}
                  disabled={step === 0}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={18}
                    color={isDark ? "#AAA" : "#555"}
                  />
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
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        !selectedTemplate && styles.textDisabled,
                      ]}
                    >
                      Next
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={18}
                      color={!selectedTemplate ? (isDark ? "#666" : "#AAA") : "#FFF"}
                    />
                  </TouchableOpacity>
                ) : step < steps.length - 2 ? (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.buttonPrimary,
                    ]}
                    onPress={handleNext}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.buttonText}>Next</Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={18}
                      color="#FFF"
                    />
                  </TouchableOpacity>
                ) : step === steps.length - 2 ? (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.buttonPrimary,
                    ]}
                    onPress={handleNext}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="eye-outline"
                      size={18}
                      color="#FFF"
                    />
                    <Text style={styles.buttonText}>Preview</Text>
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
          </View>
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

      {/* Upload Progress Modal */}
      <Modal
        visible={uploadProgress}
        transparent={true}
        animationType="fade"
      >
        <View style={uploadStyles.modalOverlay}>
          <View style={[uploadStyles.modalContent, { backgroundColor: isDark ? "#2A2D35" : "#FFF" }]}>
            <ActivityIndicator size="large" color={isDark ? "#4F8EF7" : "#1976D2"} />
            <Text style={[uploadStyles.progressText, { color: isDark ? "#FFF" : "#222" }]}>
              Uploading and parsing CV...
            </Text>
            <Text style={[uploadStyles.progressSubtext, { color: isDark ? "#AAA" : "#666" }]}>
              Please wait
            </Text>
          </View>
        </View>
      </Modal>

      {/* PDF Generation Loading Modal */}
      <Modal
        visible={isGeneratingPdf && !showPdfPreview}
        transparent={true}
        animationType="fade"
      >
        <View style={uploadStyles.modalOverlay}>
          <View style={[uploadStyles.modalContent, { backgroundColor: isDark ? "#2A2D35" : "#FFF" }]}>
            <ActivityIndicator size="large" color={isDark ? "#4F8EF7" : "#1976D2"} />
            <Text style={[uploadStyles.progressText, { color: isDark ? "#FFF" : "#222" }]}>
              Generating your CV...
            </Text>
            <Text style={[uploadStyles.progressSubtext, { color: isDark ? "#AAA" : "#666" }]}>
              This may take a moment
            </Text>
          </View>
        </View>
      </Modal>

      {/* PDF Preview Modal */}
      <Modal
        visible={showPdfPreview}
        animationType="slide"
        onRequestClose={() => setShowPdfPreview(false)}
      >
        <View style={[previewStyles.container, { backgroundColor: isDark ? "#181A20" : "#f2f4f8" }]}>
          <View style={[previewStyles.header, { backgroundColor: isDark ? "#23262F" : "#FFF", paddingTop: insets.top + 12 }]}>
            <TouchableOpacity
              style={previewStyles.closeButton}
              onPress={() => setShowPdfPreview(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color={isDark ? "#FFF" : "#222"} />
            </TouchableOpacity>
            <Text style={[previewStyles.headerTitle, { color: isDark ? "#FFF" : "#222" }]}>
              Preview Your CV
            </Text>
            <View style={{ width: 40 }} />
          </View>
          
          <View style={previewStyles.webviewContainer}>
            <WebView
              source={{ html: pdfPreviewHtml }}
              style={previewStyles.webview}
              scalesPageToFit={true}
              showsVerticalScrollIndicator={true}
            />
          </View>
          
          <View style={[previewStyles.footer, { backgroundColor: isDark ? "#23262F" : "#FFF", paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity
              style={[previewStyles.footerButton, previewStyles.cancelButton, { borderColor: isDark ? "#4F8EF7" : "#1976D2" }]}
              onPress={() => setShowPdfPreview(false)}
            >
              <Text style={[previewStyles.cancelButtonText, { color: isDark ? "#4F8EF7" : "#1976D2" }]}>
                Edit CV
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[previewStyles.footerButton, previewStyles.downloadButton, { backgroundColor: isDark ? "#4F8EF7" : "#1976D2" }]}
              onPress={handleConfirmDownload}
            >
              <MaterialCommunityIcons name="download" size={20} color="#FFF" />
              <Text style={previewStyles.downloadButtonText}>Download PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Draft Restore Prompt Modal */}
      <Modal
        visible={showDraftPrompt}
        transparent={true}
        animationType="fade"
      >
        <View style={uploadStyles.modalOverlay}>
          <View style={[draftStyles.modalContent, { backgroundColor: isDark ? "#2A2D35" : "#FFF" }]}>
            <MaterialCommunityIcons 
              name="file-restore" 
              size={48} 
              color={isDark ? "#4F8EF7" : "#1976D2"} 
            />
            <Text style={[draftStyles.title, { color: isDark ? "#FFF" : "#222" }]}>
              Resume Draft Found
            </Text>
            <Text style={[draftStyles.subtitle, { color: isDark ? "#AAA" : "#666" }]}>
              Would you like to continue where you left off?
            </Text>
            <View style={draftStyles.buttonRow}>
              <TouchableOpacity
                style={[draftStyles.button, draftStyles.discardButton, { borderColor: isDark ? "#E53935" : "#D32F2F" }]}
                onPress={async () => {
                  await clearDraft();
                  setShowDraftPrompt(false);
                }}
              >
                <Text style={[draftStyles.discardText, { color: isDark ? "#E53935" : "#D32F2F" }]}>
                  Start Fresh
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[draftStyles.button, draftStyles.restoreButton, { backgroundColor: isDark ? "#4F8EF7" : "#1976D2" }]}
                onPress={async () => {
                  setShowDraftPrompt(false);
                  await loadDraft();
                }}
              >
                <Text style={draftStyles.restoreText}>Restore Draft</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

const uploadStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    minWidth: 250,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  progressSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});

const previewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  webviewContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  webview: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  footerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  downloadButton: {
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  downloadButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

const draftStyles = StyleSheet.create({
  modalContent: {
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    minWidth: 300,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  discardButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  discardText: {
    fontSize: 14,
    fontWeight: "600",
  },
  restoreButton: {
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  restoreText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

const autoSaveStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default WizardForm;
