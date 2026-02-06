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
  const [uploadProgress, setUploadProgress] = useState(false);
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

    // Extract email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
      parsedData.contact.email = emailMatch[0];
    }

    // Extract phone (various formats)
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10,}/);
    if (phoneMatch) {
      parsedData.contact.phone = phoneMatch[0].trim();
    }

    // Extract name (usually first line or before email)
    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // If first line doesn't contain email/phone, it's likely the name
      if (!firstLine.includes("@") && !firstLine.match(/\d{10,}/)) {
        const nameParts = firstLine.split(/\s+/);
        if (nameParts.length >= 2) {
          parsedData.contact.name = nameParts[0];
          parsedData.contact.lastname = nameParts.slice(1).join(" ");
        } else {
          parsedData.contact.name = firstLine;
        }
      }
    }

    // Try to find name near email/phone
    if (!parsedData.contact.name && emailMatch) {
      const emailIndex = text.indexOf(emailMatch[0]);
      const beforeEmail = text.substring(Math.max(0, emailIndex - 200), emailIndex);
      const nameLines = beforeEmail.split("\n").filter((line) => line.trim().length > 0);
      if (nameLines.length > 0) {
        const nameLine = nameLines[nameLines.length - 1].trim();
        const nameParts = nameLine.split(/\s+/);
        if (nameParts.length >= 2 && nameParts.length <= 4) {
          parsedData.contact.name = nameParts[0];
          parsedData.contact.lastname = nameParts.slice(1).join(" ");
        }
      }
    }

    // Extract summary/about me (text before Experience/Education sections)
    const experienceIndex = text.search(/\b(Experience|Work Experience|Employment|Professional Experience)\b/i);
    const educationIndex = text.search(/\b(Education|Academic|Qualifications)\b/i);
    const summaryEnd = Math.min(
      experienceIndex > 0 ? experienceIndex : text.length,
      educationIndex > 0 ? educationIndex : text.length
    );
    if (summaryEnd > 100) {
      const summaryText = text.substring(0, summaryEnd).trim();
      // Remove name, email, phone from summary
      let cleanSummary = summaryText
        .replace(new RegExp(parsedData.contact.name, "gi"), "")
        .replace(new RegExp(parsedData.contact.lastname, "gi"), "")
        .replace(new RegExp(parsedData.contact.email, "gi"), "")
        .replace(new RegExp(parsedData.contact.phone, "gi"), "");
      // Take first 2-3 sentences
      const sentences = cleanSummary.match(/[^.!?]+[.!?]+/g);
      if (sentences && sentences.length > 0) {
        parsedData.aboutMe.summary = sentences.slice(0, 3).join(" ").trim();
      }
    }

    // Extract experience entries
    const experienceSection = text.match(/\b(Experience|Work Experience|Employment|Professional Experience)\b[\s\S]*?(?=\b(Education|Skills|Languages|$)\b)/i);
    if (experienceSection) {
      const expText = experienceSection[0];
      // Try to find job entries (common patterns)
      const jobPatterns = [
        /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*[-–—]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*[\(]?([^\)]+)[\)]?\s*([0-9]{4}|[A-Z][a-z]+\s+[0-9]{4})/gi,
        /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      ];
      
      // Simple extraction: look for lines with dates
      const datePattern = /([0-9]{4}|[A-Z][a-z]+\s+[0-9]{4})\s*[-–—]\s*([0-9]{4}|Present|Current)/gi;
      const lines = expText.split("\n");
      let currentExp: any = null;
      
      lines.forEach((line) => {
        const dateMatch = line.match(datePattern);
        if (dateMatch && line.length > 10) {
          if (currentExp) {
            parsedData.experience.push(currentExp);
          }
          const parts = line.split(/[-–—]/);
          currentExp = {
            jobTitle: parts[0]?.trim() || "",
            company: parts[1]?.trim() || "",
            startDate: dateMatch[0].split(/[-–—]/)[0]?.trim() || "",
            endDate: dateMatch[0].split(/[-–—]/)[1]?.trim() || "Present",
            ongoing: dateMatch[0].includes("Present") || dateMatch[0].includes("Current"),
            description: "",
          };
        } else if (currentExp && line.trim().length > 5) {
          currentExp.description += (currentExp.description ? "\n" : "") + line.trim();
        }
      });
      if (currentExp) {
        parsedData.experience.push(currentExp);
      }
    }

    // Extract education entries
    const educationSection = text.match(/\b(Education|Academic|Qualifications)\b[\s\S]*?(?=\b(Experience|Skills|Languages|$)\b)/i);
    if (educationSection) {
      const eduText = educationSection[0];
      const datePattern = /([0-9]{4}|[A-Z][a-z]+\s+[0-9]{4})\s*[-–—]\s*([0-9]{4}|Present|Current)/gi;
      const lines = eduText.split("\n");
      let currentEdu: any = null;
      
      lines.forEach((line) => {
        const dateMatch = line.match(datePattern);
        if (dateMatch && line.length > 10) {
          if (currentEdu) {
            parsedData.education.push(currentEdu);
          }
          const parts = line.split(/[-–—]/);
          currentEdu = {
            degree: parts[0]?.trim() || "",
            school: parts[1]?.trim() || "",
            startDate: dateMatch[0].split(/[-–—]/)[0]?.trim() || "",
            endDate: dateMatch[0].split(/[-–—]/)[1]?.trim() || "Present",
            ongoing: dateMatch[0].includes("Present") || dateMatch[0].includes("Current"),
            description: "",
          };
        } else if (currentEdu && line.trim().length > 5) {
          currentEdu.description += (currentEdu.description ? "\n" : "") + line.trim();
        }
      });
      if (currentEdu) {
        parsedData.education.push(currentEdu);
      }
    }

    // Extract skills (look for Skills section)
    const skillsSection = text.match(/\b(Skills|Technical Skills|Core Skills)\b[\s\S]*?(?=\b(Experience|Education|Languages|$)\b)/i);
    if (skillsSection) {
      const skillsText = skillsSection[0];
      // Extract comma or bullet-separated skills
      const skillMatches = skillsText.match(/(?:[•\-\*]\s*)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g);
      if (skillMatches) {
        parsedData.skills = skillMatches
          .map((s) => s.replace(/[•\-\*]\s*/, "").trim())
          .filter((s) => s.length > 2 && !s.match(/^(Skills|Technical|Core)$/i));
      }
    }

    return parsedData;
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

      console.log("DocumentPicker result:", JSON.stringify(result, null, 2));

      // DocumentPicker returns an array or single object depending on version
      let file: any;
      if (Array.isArray(result)) {
        if (result.length === 0) {
          Alert.alert("Error", "No file selected.");
          return;
        }
        file = result[0];
      } else if (result) {
        file = result;
      } else {
        Alert.alert("Error", "No file selected.");
        return;
      }
      
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
          // This is a basic approach - for production, use a proper PDF parsing library like pdf-parse
          const binaryString = atob(base64Content);
          
          // Method 1: Extract text between parentheses (PDF text objects)
          const textMatches = binaryString.match(/\((.*?)\)/g);
          if (textMatches && textMatches.length > 0) {
            extractedText = textMatches
              .map(match => {
                // Remove parentheses and decode escape sequences
                let text = match.replace(/[()]/g, '');
                // Handle PDF escape sequences
                text = text.replace(/\\([nrtbf()\\])/g, (match, char) => {
                  const escapes: any = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f' };
                  return escapes[char] || char;
                });
                return text;
              })
              .filter(text => {
                // Filter out very short strings, pure numbers, and non-readable content
                const trimmed = text.trim();
                return trimmed.length > 2 && 
                       !trimmed.match(/^\d+$/) && 
                       trimmed.match(/[A-Za-z]/); // Must contain at least one letter
              })
              .join(' ');
          }
          
          // Method 2: Extract text from stream objects (compressed text)
          if (extractedText.length < 100) {
            const streamMatches = binaryString.match(/stream[\s\S]{0,5000}?endstream/g);
            if (streamMatches) {
              streamMatches.forEach(stream => {
                // Try to extract readable text from stream
                // Look for text patterns
                const textInStream = stream.match(/[A-Za-z][A-Za-z\s]{10,}/g);
                if (textInStream) {
                  extractedText += ' ' + textInStream.join(' ');
                }
              });
            }
          }
          
          // Method 3: Fallback - extract any readable ASCII text
          if (extractedText.length < 50) {
            // Look for sequences of readable characters
            const readableText = binaryString.match(/[A-Za-z0-9\s@.\-+()]{15,}/g);
            if (readableText) {
              const filtered = readableText
                .filter(text => {
                  const trimmed = text.trim();
                  // Must have letters and be reasonably long
                  return trimmed.length > 10 && trimmed.match(/[A-Za-z]{3,}/);
                })
                .join(' ')
                .substring(0, 10000); // Limit to first 10000 chars
              
              if (filtered.length > extractedText.length) {
                extractedText = filtered;
              }
            }
          }
          
          // Clean up extracted text
          extractedText = extractedText
            .replace(/\s+/g, ' ') // Normalize whitespace
            .replace(/[^\x20-\x7E\n\r]/g, '') // Remove non-printable chars except newlines
            .trim();
          
          console.log("Extracted text length:", extractedText.length);
          if (extractedText.length > 0) {
            console.log("Extracted text preview:", extractedText.substring(0, 500));
          } else {
            console.warn("No text could be extracted from PDF. The PDF might be image-based or use a format we can't parse.");
          }
        } catch (extractError: any) {
          console.error("Error extracting text from PDF:", extractError);
          // Continue with empty text - parser will still try to extract what it can
        }
        
        // Parse extracted text and extract CV data
        const parsedData = parseCVText(extractedText);
          
          console.log("Parsed data:", parsedData);
          
          // Auto-fill form fields with parsed data
          if (parsedData.contact.name) {
            setContact((prev) => ({ ...prev, name: parsedData.contact.name }));
          }
          if (parsedData.contact.lastname) {
            setContact((prev) => ({ ...prev, lastname: parsedData.contact.lastname }));
          }
          if (parsedData.contact.email) {
            setContact((prev) => ({ ...prev, email: parsedData.contact.email }));
          }
          if (parsedData.contact.phone) {
            setContact((prev) => ({ ...prev, phone: parsedData.contact.phone }));
          }
          if (parsedData.address.cityName) {
            setAddress((prev) => ({ ...prev, cityName: parsedData.address.cityName }));
          }
          if (parsedData.address.countryName) {
            setAddress((prev) => ({ ...prev, countryName: parsedData.address.countryName }));
          }
          if (parsedData.aboutMe.summary) {
            setAboutMe((prev) => ({ ...prev, summary: parsedData.aboutMe.summary }));
          }
          if (parsedData.experience.length > 0) {
            setExperience(parsedData.experience);
          }
          if (parsedData.education.length > 0) {
            setEducation(parsedData.education);
          }
          if (parsedData.skills.length > 0) {
            setSkills(parsedData.skills.filter((s: string) => s.trim() !== ""));
          }
          
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

export default WizardForm;
