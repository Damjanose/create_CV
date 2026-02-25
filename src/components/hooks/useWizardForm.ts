// Type definitions
export interface Contact {
  name: string;
  lastname: string;
  phone: string;
  email: string;
}
export interface Address {
  countryName: string;
  cityName: string;
  address1: string;
  address2: string;
}
export interface Language {
  name: string;
  level: number;
}
export interface AboutMe {
  summary: string;
  image?: string;
  imageBase64?: string;
}
export interface Experience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  ongoing?: boolean;
}
export interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
  ongoing?: boolean;
}
export interface AboutMeErrors {
  [key: string]: boolean;
}
export interface ExperienceErrors {
  [index: number]: Partial<Record<keyof Experience, boolean>>;
}
export interface EducationErrors {
  [index: number]: Partial<Record<keyof Education, boolean>>;
}
export interface Template {
  id: string;
  name: string;
  description: string;
}

import { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Animated,
  ColorSchemeName,
  Platform,
  StyleSheet,
  useColorScheme,
} from "react-native";
// @ts-ignore: No types for react-native-html-to-pdf
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CV_DRAFT_KEY = "CV_DRAFT_DATA";
const CV_GENERATED_PREFIX = "CV_GENERATED_";
const AUTO_SAVE_DEBOUNCE = 1000; // 1 second debounce
const VALID_TEMPLATE_IDS = ["classic", "modern", "minimal"] as const;

const normalizeTemplateId = (value?: string): string => {
  const normalized = (value || "").trim().toLowerCase();
  return VALID_TEMPLATE_IDS.includes(normalized as (typeof VALID_TEMPLATE_IDS)[number])
    ? normalized
    : "";
};

const stepLabels = [
  "Welcome",
  "Template",
  "About Me, Contact & Address",
  "Languages & Skills",
  "Experience",
  "Education",
  "Preview",
];
function getStyles(isDark: boolean) {
  const primary = isDark ? "#4F8EF7" : "#1976D2";
  const secondary = isDark ? "#888" : "#CCC";
  const bg = isDark ? "#181A20" : "#f2f4f8";
  const cardBg = isDark ? "#23262F" : "#FFFFFF";
  const errorBg = isDark ? "#2d1a1a" : "#ffeaea";
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: bg,
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 8,
    },
    stepperContainer: {
      display: "none",
    },
    stepperContainerBottom: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 24,
      width: "100%",
      maxWidth: 400,
      justifyContent: "center",
      paddingHorizontal: 10,
      paddingBottom: 20
    },
    stepWrapper: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    circle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: secondary,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
    },
    circleCurrent: {
      backgroundColor: primary,
    },
    circleDone: {
      backgroundColor: primary,
    },
    circleText: {
      color: "#fff",
      fontWeight: "600",
    },
    stepLabel: {
      marginHorizontal: 4,
      fontSize: 12,
      color: isDark ? "#AAA" : "#555",
      flexShrink: 1,
    },
    stepLabelCurrent: {
      color: primary,
      fontWeight: "600",
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
      width: "100%",
      maxWidth: 400,
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 14,
      overflow: "hidden",
      shadowColor: isDark ? "#000" : "#AAA",
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 6,
      alignItems: "center",
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: isDark ? "#FFF" : "#222",
      marginBottom: 12,
      textAlign: "center",
    },
    errorBox: {
      backgroundColor: errorBg,
      padding: 8,
      borderRadius: 8,
      marginBottom: 12,
      width: "100%",
    },
    errorText: {
      color: "#E53935",
      textAlign: "center",
      fontWeight: "600",
    },
    content: {
      width: "100%",
      marginBottom: 16,
    },
    buttonRow: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      gap: 10,
    },
    button: {
      flex: 1,
      flexDirection: "row",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    buttonPrimary: {
      backgroundColor: primary,
      shadowColor: primary,
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 6,
      elevation: 4,
    },
    buttonSecondary: {
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      borderWidth: 0,
    },
    buttonDisabled: {
      backgroundColor: isDark ? "#333" : "#E0E0E0",
      shadowOpacity: 0,
      elevation: 0,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFF",
      letterSpacing: 0.3,
    },
    textSecondary: {
      color: isDark ? "#AAA" : "#555",
    },
    textDisabled: {
      color: isDark ? "#666" : "#AAA",
    },
    templateCard: {
      width: 140,
      height: 180,
      backgroundColor: isDark ? "#181A20" : "#f7f9fa",
      borderRadius: 12,
      marginHorizontal: 8,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "transparent",
      shadowColor: isDark ? "#000" : "#aaa",
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
      fontWeight: "bold",
      color: isDark ? "#fff" : "#222",
      marginBottom: 8,
    },
    selectedLabel: {
      color: primary,
      fontWeight: "bold",
      marginTop: 8,
    },
    templateDesc: {
      fontSize: 14,
      color: isDark ? "#aaa" : "#555",
      textAlign: "center",
      marginBottom: 12,
    },
    input: {
      width: "100%",
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDark ? "#555" : "#CCC",
      backgroundColor: isDark ? "#333" : "#FFF",
      color: isDark ? "#FFF" : "#222",
      fontSize: 16,
      fontWeight: "500",
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#f2f2f2" : "#555",
      marginBottom: 8,
    },
  });
}

type UseWizardFormReturn = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  fadeAnim: Animated.Value;
  colorScheme: ColorSchemeName;
  isDark: boolean;
  toggleDarkMode: () => void;
  styles: ReturnType<typeof getStyles>;
  aboutMe: AboutMe;
  setAboutMe: React.Dispatch<React.SetStateAction<AboutMe>>;
  contact: Contact;
  setContact: React.Dispatch<React.SetStateAction<Contact>>;
  address: Address;
  setAddress: React.Dispatch<React.SetStateAction<Address>>;
  languages: Language[];
  setLanguages: React.Dispatch<React.SetStateAction<Language[]>>;
  experience: Experience[];
  setExperience: React.Dispatch<React.SetStateAction<Experience[]>>;
  education: Education[];
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>;
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
  hobbies: string[];
  setHobbies: React.Dispatch<React.SetStateAction<string[]>>;
  errors: AboutMeErrors | ExperienceErrors | EducationErrors;
  setErrors: React.Dispatch<
    React.SetStateAction<AboutMeErrors | ExperienceErrors | EducationErrors>
  >;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  fieldErrors: Record<string, string>;
  clearFieldError: (field: string) => void;
  validateField: (field: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>;
  showPreview: boolean;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  validateStep: () => boolean;
  canGoNext: () => boolean;
  animateTo: (next: number) => void;
  handleNext: () => void;
  handleBack: () => void;
  renderTemplateHtml: (imageBase64?: string) => string;
  handleDownloadPDF: () => Promise<void>;
  // New features
  isGeneratingPdf: boolean;
  showPdfPreview: boolean;
  setShowPdfPreview: React.Dispatch<React.SetStateAction<boolean>>;
  pdfPreviewHtml: string;
  handlePreviewPdf: () => Promise<void>;
  handleConfirmDownload: () => Promise<void>;
  clearDraft: () => Promise<void>;
  resetForm: () => Promise<void>;
  hasDraft: boolean;
  loadDraft: () => Promise<void>;
  lastSaved: Date | null;
};

const useWizardForm = (): UseWizardFormReturn => {
  const [step, setStep] = useState<number>(0);
  const [fadeAnim] = useState<Animated.Value>(() => new Animated.Value(1));
  const systemColorScheme = useColorScheme();
  const [manualDarkMode, setManualDarkMode] = useState<boolean | null>(null);

  // Determine if dark mode should be used - default to system theme
  const isDark = manualDarkMode !== null ? manualDarkMode : systemColorScheme === "dark";
  const styles = getStyles(isDark);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setManualDarkMode(newDarkMode);
  };

  const [aboutMe, setAboutMe] = useState<AboutMe>({
    summary:
      "",
    image: "",
    imageBase64: "",
  });
  const [contact, setContact] = useState<Contact>({
    name: "",
    lastname: "",
    phone: "",
    email: "",
  });
  const [address, setAddress] = useState<Address>({
    countryName: "",
    cityName: "",
    address1: "",
    address2: "",
  });
  const [languages, setLanguages] = useState<Language[]>([]);
  const [experience, setExperience] = useState<Experience[]>([
    { jobTitle: "", company: "", startDate: "", endDate: "", description: "", ongoing: false },
  ]);
  const [education, setEducation] = useState<Education[]>([
    { school: "", degree: "", startDate: "", endDate: "", description: "", ongoing: false },
  ]);
  const [skills, setSkills] = useState<string[]>([""]);
  const [hobbies, setHobbies] = useState<string[]>([""]);
  const [errors, setErrors] = useState<
    AboutMeErrors | ExperienceErrors | EducationErrors
  >({});
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  // New state for loading, PDF preview, and auto-save
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [showPdfPreview, setShowPdfPreview] = useState<boolean>(false);
  const [pdfPreviewHtml, setPdfPreviewHtml] = useState<string>("");
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const resolvedTemplate = normalizeTemplateId(selectedTemplate);

  // ============ AUTO-SAVE FUNCTIONALITY ============
  
  // Check for existing draft on mount
  useEffect(() => {
    const checkForDraft = async () => {
      try {
        const draftData = await AsyncStorage.getItem(CV_DRAFT_KEY);
        if (draftData) {
          setHasDraft(true);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Error checking for draft:", error);
        setIsInitialized(true);
      }
    };
    checkForDraft();
  }, []);

  // Auto-save when form data changes (debounced)
  useEffect(() => {
    if (!isInitialized) return; // Don't save during initial load
    if (step === 0) return; // Don't auto-save on welcome screen (would overwrite real draft with empty data)
    
    const saveTimeout = setTimeout(async () => {
      try {
        const draftData = {
          contact,
          address,
          aboutMe: { summary: aboutMe.summary, image: aboutMe.image },
          languages,
          experience,
          education,
          skills: skills.filter(s => s.trim() !== ""),
          hobbies: hobbies.filter(h => h.trim() !== ""),
          selectedTemplate,
          step,
          savedAt: new Date().toISOString(),
        };
        
        // Only save if there's meaningful data (actual content, not just empty default entries)
        const hasContent = !!(
          contact.name || contact.email ||
          experience.some(e => e.jobTitle || e.company) ||
          education.some(e => e.school || e.degree)
        );
        if (hasContent) {
          await AsyncStorage.setItem(CV_DRAFT_KEY, JSON.stringify(draftData));
          setLastSaved(new Date());
          setHasDraft(true);
          console.log("Draft auto-saved");
        }
      } catch (error) {
        console.error("Error auto-saving draft:", error);
      }
    }, AUTO_SAVE_DEBOUNCE);

    return () => clearTimeout(saveTimeout);
  }, [contact, address, aboutMe.summary, languages, experience, education, skills, hobbies, selectedTemplate, step, isInitialized]);

  // Load draft function
  const loadDraft = async (): Promise<void> => {
    try {
      const draftData = await AsyncStorage.getItem(CV_DRAFT_KEY);
      if (draftData) {
        const parsed = JSON.parse(draftData);
        
        if (parsed.contact) setContact(parsed.contact);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.aboutMe) setAboutMe(prev => ({ ...prev, ...parsed.aboutMe }));
        if (parsed.languages) setLanguages(parsed.languages);
        if (parsed.experience) setExperience(parsed.experience);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.skills && parsed.skills.length > 0) setSkills([...parsed.skills, ""]);
        if (parsed.hobbies && parsed.hobbies.length > 0) setHobbies([...parsed.hobbies, ""]);
        const restoredTemplate = normalizeTemplateId(parsed.selectedTemplate);
        if (restoredTemplate) setSelectedTemplate(restoredTemplate);
        
        // Navigate to the saved step or template selection if data exists
        const targetStep = restoredTemplate ? Math.min(parsed.step || 1, 6) : 1;
        setStep(targetStep);
      }
    } catch (error) {
      console.error("Error loading draft:", error);
      Alert.alert("Error", "Could not restore your draft.");
    }
  };

  // Clear draft function
  const clearDraft = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(CV_DRAFT_KEY);
      setHasDraft(false);
      setLastSaved(null);
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  };

  // Reset all form state to defaults AND clear persisted draft
  const resetForm = async (): Promise<void> => {
    await clearDraft();
    setAboutMe({ summary: "", image: "", imageBase64: "" });
    setContact({ name: "", lastname: "", phone: "", email: "" });
    setAddress({ countryName: "", cityName: "", address1: "", address2: "" });
    setLanguages([]);
    setExperience([
      { jobTitle: "", company: "", startDate: "", endDate: "", description: "", ongoing: false },
    ]);
    setEducation([
      { school: "", degree: "", startDate: "", endDate: "", description: "", ongoing: false },
    ]);
    setSkills([""]);
    setHobbies([""]);
    setSelectedTemplate("");
    setErrors({});
    setErrorMsg("");
    setFieldErrors({});
    setStep(0);
  };

  // ============ END AUTO-SAVE ============

  // Validation helpers
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Allow various phone formats: +1234567890, 123-456-7890, (123) 456-7890, etc.
    const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  // Clear a single field error (called on change)
  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // Validate a single field on blur
  const validateField = (field: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      switch (field) {
        case "name":
          if (!contact.name || contact.name.trim() === "") {
            next.name = "First name is required";
          } else {
            delete next.name;
          }
          break;
        case "lastname":
          if (!contact.lastname || contact.lastname.trim() === "") {
            next.lastname = "Last name is required";
          } else {
            delete next.lastname;
          }
          break;
        case "phone":
          if (!contact.phone || contact.phone.trim() === "") {
            next.phone = "Phone number is required";
          } else if (!validatePhone(contact.phone)) {
            next.phone = "Enter a valid phone number (e.g. +1234567890)";
          } else {
            delete next.phone;
          }
          break;
        case "email":
          if (!contact.email || contact.email.trim() === "") {
            next.email = "Email is required";
          } else if (!validateEmail(contact.email)) {
            next.email = "Enter a valid email address";
          } else {
            delete next.email;
          }
          break;
        case "countryName":
          if (!address.countryName) {
            next.countryName = "Please select a country";
          } else {
            delete next.countryName;
          }
          break;
        case "cityName":
          if (!address.cityName) {
            next.cityName = "Please select a city";
          } else {
            delete next.cityName;
          }
          break;
        case "address1":
          if (!address.address1 || address.address1.trim() === "") {
            next.address1 = "Address is required";
          } else {
            delete next.address1;
          }
          break;
        case "summary":
          if (!aboutMe.summary || aboutMe.summary.trim() === "") {
            next.summary = "Please write something about yourself";
          } else {
            delete next.summary;
          }
          break;
      }
      return next;
    });
  };

  const validateStep = (): boolean => {
    setErrorMsg("");
    setFieldErrors({});
    let valid = true;
    const newFieldErrors: Record<string, string> = {};
    if (step === 0) {
      // Welcome step - always allow to proceed
      return true;
    }
    if (step === 1) {
      // Template selection step - must have a template selected
      if (!resolvedTemplate) {
        setErrorMsg("Please select a template to continue.");
        return false;
      }
      return true;
    }
    if (step === 2) {
      // About Me step - validate all fields with inline errors
      if (!contact.name || contact.name.trim() === "") {
        newFieldErrors.name = "First name is required";
        valid = false;
      }
      if (!contact.lastname || contact.lastname.trim() === "") {
        newFieldErrors.lastname = "Last name is required";
        valid = false;
      }
      if (!contact.phone || contact.phone.trim() === "") {
        newFieldErrors.phone = "Phone number is required";
        valid = false;
      } else if (!validatePhone(contact.phone)) {
        newFieldErrors.phone = "Enter a valid phone number (e.g. +1234567890)";
        valid = false;
      }
      if (!contact.email || contact.email.trim() === "") {
        newFieldErrors.email = "Email is required";
        valid = false;
      } else if (!validateEmail(contact.email)) {
        newFieldErrors.email = "Enter a valid email address";
        valid = false;
      }
      if (!address.countryName) {
        newFieldErrors.countryName = "Please select a country";
        valid = false;
      }
      if (!address.cityName) {
        newFieldErrors.cityName = "Please select a city";
        valid = false;
      }
      if (!address.address1 || address.address1.trim() === "") {
        newFieldErrors.address1 = "Address is required";
        valid = false;
      }
      if (!aboutMe.summary || aboutMe.summary.trim() === "") {
        newFieldErrors.summary = "Please write something about yourself";
        valid = false;
      }
      
      if (!valid) {
        setFieldErrors(newFieldErrors);
        const count = Object.keys(newFieldErrors).length;
        setErrorMsg(`Please fix ${count} error${count > 1 ? "s" : ""} below.`);
      }
      return valid;
    }
    if (step === 3) {
      // Languages & Skills step - per-field validation
      const hasLanguages = languages.length > 0 && languages.some(l => l.name && l.name.trim() !== "");
      const hasSkills = skills.length > 0 && skills.some(s => s && s.trim() !== "");
      const newFieldErrors: Record<string, string> = {};

      if (!hasLanguages) {
        newFieldErrors.languages = "Please add at least one language.";
      }
      if (!hasSkills) {
        newFieldErrors.skills = "Please add at least one skill.";
      }
      // Check for languages with empty names
      languages.forEach((l, i) => {
        if (!l.name || l.name.trim() === "") {
          newFieldErrors[`language_${i}`] = "Language name is required.";
        }
      });

      if (Object.keys(newFieldErrors).length > 0) {
        setFieldErrors(newFieldErrors);
        const count = Object.keys(newFieldErrors).length;
        setErrorMsg(`Please fix ${count} error${count > 1 ? "s" : ""} below.`);
        return false;
      }
    }
    return true;
  };

  const canGoNext = (): boolean => {
    if (step === 0) {
      // Welcome step - always allow to proceed
      return true;
    }
    if (step === 1) {
      // Template selection step
      return !!resolvedTemplate;
    }
    if (step === 2) {
      // About Me step - check all required fields including valid email/phone
      const hasRequiredFields = !!(
        aboutMe.summary.trim() !== "" &&
        contact.name &&
        contact.name.trim() !== "" &&
        contact.lastname &&
        contact.lastname.trim() !== "" &&
        contact.phone &&
        contact.phone.trim() !== "" &&
        contact.email &&
        contact.email.trim() !== "" &&
        address.countryName &&
        address.cityName &&
        address.address1 &&
        address.address1.trim() !== ""
      );
      if (!hasRequiredFields) return false;
      // Also check email and phone format
      return validateEmail(contact.email) && validatePhone(contact.phone);
    }
    if (step === 3) {
      // Languages & Skills step - ensure at least one valid entry each
      const hasLanguages = languages.length > 0 && languages.some(l => l.name && l.name.trim() !== "");
      const hasSkills = skills.length > 0 && skills.some(s => s && s.trim() !== "");
      return hasLanguages && hasSkills;
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
    setErrorMsg("");
    setFieldErrors({});
    animateTo(step - 1);
  };

  const renderTemplateHtml = (imageBase64?: string): string => {
    const templateId = normalizeTemplateId(selectedTemplate);
    if (!templateId) {
      throw new Error("Unknown template selected. Please reselect a template.");
    }

    let html = "";
    let imageHtml = "";
    if (imageBase64) {
      imageHtml = `<img src='data:image/jpeg;base64,${imageBase64}' style='width:40px;height:40px;border-radius:20px;object-fit:cover;background:#eee;display:block;margin:0 auto 5px;'/>`;
    }
    if (templateId === "classic") {
      // ClassicTemplate: Dark sidebar with white text, light content area - matching preview exactly
      html = `
        <div style="width:210mm;min-height:297mm;margin:auto;font-family:sans-serif;background:#fff;display:flex;flex-direction:row;">
          <!-- Sidebar -->
          <div style="width:25mm;background:#232323;padding:5px;color:#fff;">
            ${imageHtml}
            <div style="font-size:8pt;font-weight:bold;text-align:center;margin-bottom:5px;color:#fff;">${contact.name} ${contact.lastname}</div>
            <div style="font-size:6pt;text-align:center;color:#ccc;margin-bottom:6px;"></div>
            
            <div style="font-weight:600;color:#fff;font-size:6.5pt;margin-top:7px;margin-bottom:3px;">Contact</div>
            <div style="font-size:5.5pt;color:#ddd;margin-bottom:2px;">${contact.email}</div>
            <div style="font-size:5.5pt;color:#ddd;margin-bottom:2px;">${contact.phone}</div>
            <div style="font-size:5.5pt;color:#ddd;margin-bottom:2px;">${address.cityName}, ${address.countryName}</div>
            
            <div style="font-weight:600;color:#fff;font-size:6.5pt;margin-top:7px;margin-bottom:3px;">Skills</div>
            ${skills.filter((skill) => skill && skill.trim() !== "").map((skill) => `<div style="font-size:5.5pt;color:#ddd;margin-bottom:2px;">• ${skill}</div>`).join("")}
            
            <div style="font-weight:600;color:#fff;font-size:6.5pt;margin-top:7px;margin-bottom:3px;">Languages</div>
            ${languages.map((lang) => `<div style="font-size:5.5pt;color:#ddd;margin-bottom:2px;">${lang.name} – ${Math.round(lang.level * 100)}%</div>`).join("")}
            
            ${hobbies && hobbies.length > 0 && hobbies.some(h => h && h.trim() !== "") ? `
              <div style="font-weight:600;color:#fff;font-size:6.5pt;margin-top:7px;margin-bottom:3px;">Hobbies</div>
              ${hobbies.filter(h => h && h.trim() !== "").map((h) => `<div style="font-size:5.5pt;color:#ddd;margin-bottom:2px;">• ${h}</div>`).join("")}
            ` : ""}
          </div>
          
          <!-- Content -->
          <div style="flex:1;padding:8px;">
            <div style="font-size:9pt;font-weight:700;margin-bottom:4px;color:#000;">Profile</div>
            <div style="height:1px;background:#ddd;margin-bottom:5px;"></div>
            <div style="font-size:6pt;color:#333;line-height:9pt;margin-bottom:8px;">${aboutMe.summary}</div>
            
            <div style="font-size:9pt;font-weight:700;margin-bottom:4px;color:#000;">Work Experience</div>
            <div style="height:1px;background:#ddd;margin-bottom:5px;"></div>
            ${experience.map((exp) => {
              const bullets = exp.description ? exp.description.split("\n").filter(Boolean) : [];
              const endDate = exp.ongoing ? "Present" : exp.endDate;
              const location = ""; // Location is empty in preview
              return `
              <div style="margin-bottom:8px;">
                <div style="font-size:7pt;font-weight:600;color:#000;">${exp.jobTitle}</div>
                <div style="font-size:5.5pt;color:#555;margin-bottom:2px;">${exp.company}${location ? `, ${location}` : ""} (${exp.startDate} – ${endDate})</div>
                ${bullets.map((b) => `<div style="font-size:6pt;color:#333;margin-left:5px;margin-bottom:2px;">• ${b}</div>`).join("")}
              </div>
            `;
            }).join("")}
            
            <div style="font-size:9pt;font-weight:700;margin-bottom:4px;color:#000;">Education</div>
            <div style="height:1px;background:#ddd;margin-bottom:5px;"></div>
            ${education.map((edu) => {
              const bullets = edu.description ? edu.description.split("\n").filter(Boolean) : [];
              const endDate = edu.ongoing ? "Present" : edu.endDate;
              const year = `${edu.startDate} – ${endDate}`;
              const location = ""; // Location is empty in preview
              return `
              <div style="margin-bottom:8px;">
                <div style="font-size:7pt;font-weight:600;color:#000;">${edu.degree}</div>
                <div style="font-size:5.5pt;color:#555;margin-bottom:2px;">${edu.school}${location ? `, ${location}` : ""} (${year})</div>
                ${bullets.map((b) => `<div style="font-size:6pt;color:#333;margin-left:5px;margin-bottom:2px;">• ${b}</div>`).join("")}
              </div>
            `;
            }).join("")}
          </div>
        </div>
      `;
    } else if (templateId === "modern") {
      // ModernTemplate: Header with name/lastname, contact row, sections - matching preview exactly
      const locationStr = `${address.countryName}, ${address.cityName}, ${address.address1} ${address.address2}`.trim();
      // SVG icons for PDF (matching MaterialCommunityIcons from preview)
      const emailIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:2px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
      const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      const phoneIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:2px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`;
      html = `
        <div style="width:210mm;min-height:297mm;margin:auto;font-family:serif;background:#fff;padding:12px;">
          <!-- Header -->
          <div style="display:flex;flex-direction:row;margin-bottom:8px;">
            <div style="flex:1;">
              <div style="font-size:10pt;color:#666;font-family:serif;">${contact.name}</div>
              <div style="font-size:10pt;font-weight:bold;color:#000;font-family:serif;">${contact.lastname}</div>
              <div style="font-size:6pt;font-style:italic;color:#444;margin-bottom:4px;"></div>
              <div style="font-size:6pt;color:#333;line-height:9pt;">${aboutMe.summary}</div>
            </div>
            ${imageBase64 ? `<img src='data:image/jpeg;base64,${imageBase64}' style='width:40px;height:40px;border-radius:20px;object-fit:cover;background:#eee;margin-left:8px;'/>` : ""}
          </div>
          
          <!-- Contact Row with Icons -->
          <div style="display:flex;flex-direction:row;justify-content:center;align-items:center;margin:6px 0;">
            <div style="display:flex;align-items:center;font-size:5pt;color:#333;margin:0 6px;">${emailIcon}${contact.email}</div>
            <div style="display:flex;align-items:center;font-size:5pt;color:#333;margin:0 6px;">${locationIcon}${locationStr}</div>
            <div style="display:flex;align-items:center;font-size:5pt;color:#333;margin:0 6px;">${phoneIcon}${contact.phone}</div>
          </div>
          
          <!-- Divider -->
          <div style="height:1px;background:#000;margin:6px 0;"></div>
          
          <!-- Languages -->
          ${languages.length > 0 ? `
            <div style="font-size:7pt;font-weight:700;background:#ddd;padding:2px 4px;margin-top:10px;margin-bottom:5px;display:inline-block;">Languages</div>
            <div style="display:flex;flex-direction:row;justify-content:flex-start;gap:10px;margin-bottom:8px;">
              ${languages.map((lang) => `
                <div style="flex:1;max-width:80px;">
                  <div style="font-size:5pt;margin-bottom:2px;color:#333;">${lang.name}</div>
                  <div style="display:flex;flex-direction:row;height:3px;background:#EEE;border-radius:2px;overflow:hidden;">
                    <div style="width:${lang.level * 100}%;background:#333;border-radius:2px;"></div>
                  </div>
                </div>
              `).join("")}
            </div>
          ` : ""}
          
          <!-- Education -->
          ${education.length > 0 ? `
            <div style="font-size:7pt;font-weight:700;background:#ddd;padding:2px 4px;margin-top:10px;margin-bottom:5px;display:inline-block;">Education</div>
            ${education.map((edu) => {
              const period = `${edu.startDate} – ${edu.ongoing ? "Present" : edu.endDate}`;
              return `
              <div style="margin-bottom:6px;">
                <div style="font-size:6.5pt;font-weight:600;color:#111;">${edu.degree}</div>
                <div style="font-size:5.5pt;color:#666;margin-bottom:2px;">${edu.school} (${period})</div>
              </div>
            `;
            }).join("")}
          ` : ""}
          
          <!-- Skills -->
          ${skills.filter((skill) => skill && skill.trim() !== "").length > 0 ? `
            <div style="font-size:7pt;font-weight:700;background:#ddd;padding:2px 4px;margin-top:10px;margin-bottom:5px;display:inline-block;">Skills</div>
            <div style="font-size:5.5pt;color:#333;margin-left:6px;margin-bottom:2px;">
              <span style="font-weight:600;">Hard:</span> ${skills.filter((skill) => skill && skill.trim() !== "").join(", ")}
            </div>
            <div style="font-size:5.5pt;color:#333;margin-left:6px;margin-bottom:2px;">
              <span style="font-weight:600;">Soft:</span> 
            </div>
          ` : ""}
          
          <!-- Experience -->
          ${experience.length > 0 ? `
            <div style="font-size:7pt;font-weight:700;background:#ddd;padding:2px 4px;margin-top:10px;margin-bottom:5px;display:inline-block;">Professional Experience</div>
            ${experience.map((exp) => {
              const period = `${exp.startDate} – ${exp.ongoing ? "Present" : exp.endDate}`;
              const bullets = exp.description ? exp.description.split("\n").filter(Boolean) : [];
              return `
              <div style="margin-bottom:6px;">
                <div style="font-size:6.5pt;font-weight:600;color:#111;">${exp.jobTitle}</div>
                <div style="font-size:5.5pt;color:#666;margin-bottom:2px;">${exp.company} (${period})</div>
                ${bullets.map((b) => `<div style="font-size:5.5pt;color:#333;margin-left:6px;margin-bottom:2px;">• ${b}</div>`).join("")}
              </div>
            `;
            }).join("")}
          ` : ""}
        </div>
      `;
    } else if (templateId === "minimal") {
      // MinimalTemplate: Green header, sidebar with skills/languages, content area - matching preview exactly
      const addressStr = `${address.address1}, ${address.cityName}, ${address.countryName}`;
      html = `
        <div style="width:210mm;min-height:297mm;margin:auto;font-family:sans-serif;background:#fff;display:flex;flex-direction:column;">
          <!-- Header -->
          <div style="background:#3DF8C8;padding:10px;text-align:center;">
            ${imageBase64 ? `<img src='data:image/jpeg;base64,${imageBase64}' style='width:40px;height:40px;border-radius:20px;object-fit:cover;background:#EEE;display:block;margin:0 auto 5px;'/>` : ""}
            <div style="font-size:8pt;font-weight:bold;color:#000;">${contact.name} ${contact.lastname}</div>
            <div style="font-size:6pt;color:#111;font-weight:600;margin:2px 0;text-align:center;">${aboutMe.summary}</div>
            <div style="font-size:5.5pt;color:#222;margin-bottom:1px;">${addressStr}</div>
            <div style="font-size:5.5pt;color:#222;margin-bottom:1px;">${contact.phone}</div>
            <div style="font-size:5.5pt;color:#222;">${contact.email}</div>
          </div>
          
          <!-- Body -->
          <div style="display:flex;flex-direction:row;flex:1;">
            <!-- Sidebar -->
            <div style="width:25mm;background:#f5f5f5;padding:5px;">
              <div style="font-weight:600;color:#111;font-size:6.5pt;margin-top:7px;margin-bottom:3px;">Skills</div>
              ${skills.filter((skill) => skill && skill.trim() !== "").map((skill) => `<div style="font-size:5.5pt;color:#333;margin-bottom:2px;">• ${skill}</div>`).join("")}
              
              ${languages.length > 0 ? `
                <div style="font-weight:600;color:#111;font-size:6.5pt;margin-top:8px;margin-bottom:3px;">Languages</div>
                ${languages.map((lang) => `<div style="font-size:5.5pt;color:#333;margin-bottom:2px;">${lang.name} – ${Math.round(lang.level * 100)}%</div>`).join("")}
              ` : ""}
            </div>
            
            <!-- Content -->
            <div style="flex:1;padding:8px;">
              <div style="font-size:9pt;font-weight:700;margin-bottom:4px;color:#000;">Experience</div>
              <div style="height:1px;background:#ddd;margin-bottom:5px;"></div>
              ${experience.map((exp) => {
                const bullets = exp.description ? exp.description.split("\n").filter(Boolean) : [];
                const hasBullets = bullets.length > 0;
                return `
                <div style="margin-bottom:8px;">
                  <div style="font-size:7pt;font-weight:600;color:#000;">${exp.jobTitle}</div>
                  <div style="font-size:5.5pt;color:#555;margin-bottom:2px;">${exp.company} (${exp.startDate} – ${exp.ongoing ? "Present" : exp.endDate})</div>
                  ${hasBullets 
                    ? bullets.map((b) => `<div style="font-size:6pt;color:#333;margin-left:5px;margin-bottom:2px;">• ${b}</div>`).join("")
                    : (exp.description ? `<div style="font-size:6pt;color:#333;margin-left:5px;margin-bottom:2px;">• ${exp.description}</div>` : "")
                  }
                </div>
              `;
              }).join("")}
              
              <div style="font-size:9pt;font-weight:700;margin-bottom:4px;color:#000;">Education</div>
              <div style="height:1px;background:#ddd;margin-bottom:5px;"></div>
              ${education.map((edu) => {
                const bullets = edu.description ? edu.description.split("\n").filter(Boolean) : [];
                const hasBullets = bullets.length > 0;
                return `
                <div style="margin-bottom:8px;">
                  <div style="font-size:7pt;font-weight:600;color:#000;">${edu.degree}</div>
                  <div style="font-size:5.5pt;color:#555;margin-bottom:2px;">${edu.school} (${edu.startDate} – ${edu.ongoing ? "Present" : edu.endDate})</div>
                  ${hasBullets 
                    ? bullets.map((b) => `<div style="font-size:6pt;color:#333;margin-left:5px;margin-bottom:2px;">• ${b}</div>`).join("")
                    : (edu.description ? `<div style="font-size:6pt;color:#333;margin-left:5px;margin-bottom:2px;">• ${edu.description}</div>` : "")
                  }
                </div>
              `;
              }).join("")}
            </div>
          </div>
        </div>
      `;
    } else {
      throw new Error("Unknown template selected. Please reselect a template.");
    }

    return `<html><head><meta charset="UTF-8"><style>@page { size: A4; margin: 0; }</style></head><body style='margin:0;padding:0;font-family:sans-serif;'>${html}</body></html>`;
  };

  // ============ PDF PREVIEW & DOWNLOAD ============

  // Generate PDF preview HTML for modal
  const handlePreviewPdf = async (): Promise<void> => {
    setIsGeneratingPdf(true);
    try {
      const templateId = normalizeTemplateId(selectedTemplate);
      if (!templateId) {
        Alert.alert("Template Required", "Please select a template before generating preview.");
        return;
      }

      let imageBase64 = aboutMe.imageBase64;
      if (!imageBase64 && aboutMe.image) {
        try {
          imageBase64 = await RNFS.readFile(aboutMe.image, "base64");
        } catch (e) {
          console.log("Could not read image for preview");
        }
      }
      console.log("Generating preview for template:", templateId);
      const html = renderTemplateHtml(imageBase64);
      setPdfPreviewHtml(html);
      setShowPdfPreview(true);
    } catch (e) {
      console.error("Error generating preview:", e);
      Alert.alert("Error", "Failed to generate preview.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Confirm and download PDF after preview
  const handleConfirmDownload = async (): Promise<void> => {
    setShowPdfPreview(false);
    setIsGeneratingPdf(true);
    
    try {
      const templateId = normalizeTemplateId(selectedTemplate);
      if (!templateId) {
        throw new Error("Unknown template selected. Please reselect a template.");
      }

      let imageBase64 = aboutMe.imageBase64;
      if (!imageBase64 && aboutMe.image) {
        try {
          imageBase64 = await RNFS.readFile(aboutMe.image, "base64");
        } catch (e) {}
      }
      
      console.log("Generating download for template:", templateId);
      const html = renderTemplateHtml(imageBase64);
      const safeName = `${contact.name}_${contact.lastname}_${templateId}_cv`.replace(/\s+/g, "_");
      
      const file = await RNHTMLtoPDF.convert({
        html,
        fileName: safeName,
        directory: "Documents",
        base64: false,
      });
      
      let destPath = file.filePath;
      if (!destPath) throw new Error("PDF file path not found");

      // Append embedded CV data to the PDF file for reliable re-upload parsing.
      // Data appended after %%EOF is ignored by PDF viewers but survives as raw
      // bytes, so the upload handler can find and decode it.
      try {
        const embeddedPayload = {
          contact,
          address,
          aboutMe: { summary: aboutMe.summary },
          languages,
          experience,
          education,
          skills: skills.filter(s => s && s.trim() !== ""),
          hobbies: hobbies.filter(h => h && h.trim() !== ""),
          selectedTemplate: templateId,
        };
        const jsonStr = JSON.stringify(embeddedPayload);
        console.log("Embedding CV data, JSON length:", jsonStr.length);

        // Manual base64 encode. First encode JSON as UTF-8 byte array to
        // handle any non-ASCII characters (accented names, etc.), then
        // base64-encode those bytes.
        const utf8Bytes: number[] = [];
        for (let ci = 0; ci < jsonStr.length; ci++) {
          let code = jsonStr.charCodeAt(ci);
          if (code < 0x80) {
            utf8Bytes.push(code);
          } else if (code < 0x800) {
            utf8Bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
          } else if (code >= 0xd800 && code < 0xdc00 && ci + 1 < jsonStr.length) {
            // surrogate pair
            const lo = jsonStr.charCodeAt(++ci);
            code = 0x10000 + ((code - 0xd800) << 10) + (lo - 0xdc00);
            utf8Bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
          } else {
            utf8Bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
          }
        }

        const b64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        let b64 = "";
        const len = utf8Bytes.length;
        for (let i = 0; i < len; i += 3) {
          const a = utf8Bytes[i];
          const b = i + 1 < len ? utf8Bytes[i + 1] : 0;
          const c = i + 2 < len ? utf8Bytes[i + 2] : 0;
          const triplet = (a << 16) | (b << 8) | c;
          b64 += b64Chars[(triplet >> 18) & 0x3f];
          b64 += b64Chars[(triplet >> 12) & 0x3f];
          b64 += i + 1 < len ? b64Chars[(triplet >> 6) & 0x3f] : "=";
          b64 += i + 2 < len ? b64Chars[triplet & 0x3f] : "=";
        }
        const marker = `\n__CVAPP_DATA_START__${b64}__CVAPP_DATA_END__\n`;
        await RNFS.appendFile(destPath, marker, "utf8");
        console.log("Embedded CV data appended to PDF,", b64.length, "b64 chars, marker total:", marker.length);

        // Verify: read back the last bytes to confirm the marker was written
        try {
          const verifyContent = await RNFS.readFile(destPath, "utf8");
          const hasMarker = verifyContent.includes("__CVAPP_DATA_START__");
          console.log("Append verification:", hasMarker ? "MARKER FOUND" : "MARKER NOT FOUND - append may have failed");
        } catch (verifyErr) {
          console.warn("Append verification read failed:", verifyErr);
        }
      } catch (appendErr) {
        console.warn("Failed to append embedded data to PDF (non-fatal):", appendErr);
      }

      if (Platform.OS === "android") {
        const downloadDir = `${RNFS.DownloadDirectoryPath}/${safeName}.pdf`;
        await RNFS.moveFile(destPath, downloadDir);
        destPath = downloadDir;
      }

      // Save form data to AsyncStorage keyed by filename so re-upload on
      // the same device can recover it without parsing the PDF binary.
      try {
        const savedPayload = {
          contact,
          address,
          aboutMe: { summary: aboutMe.summary },
          languages,
          experience,
          education,
          skills: skills.filter(s => s && s.trim() !== ""),
          hobbies: hobbies.filter(h => h && h.trim() !== ""),
          selectedTemplate: templateId,
        };
        await AsyncStorage.setItem(
          `${CV_GENERATED_PREFIX}${safeName}`,
          JSON.stringify(savedPayload),
        );
        console.log("Saved CV data to AsyncStorage under key:", `${CV_GENERATED_PREFIX}${safeName}`);
      } catch (storeErr) {
        console.warn("Failed to save CV data to AsyncStorage (non-fatal):", storeErr);
      }
      
      // Clear draft after successful download
      await clearDraft();
      
      Alert.alert(
        "Success! 🎉", 
        `Your CV has been saved to:\n${destPath}`,
        [{ text: "OK", style: "default" }]
      );
    } catch (e) {
      console.error("Error generating PDF:", e);
      Alert.alert("Error", "Failed to generate or save PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Legacy download function (direct download without preview)
  const handleDownloadPDF = async (): Promise<void> => {
    // Show preview first instead of direct download
    await handlePreviewPdf();
  };

  // ============ END PDF PREVIEW & DOWNLOAD ============

  return {
    step,
    setStep,
    fadeAnim,
    colorScheme: systemColorScheme,
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
    errors,
    setErrors,
    errorMsg,
    setErrorMsg,
    fieldErrors,
    validateField,
    clearFieldError,
    selectedTemplate: resolvedTemplate,
    setSelectedTemplate,
    showPreview,
    setShowPreview,
    validateStep,
    canGoNext,
    animateTo,
    handleNext,
    handleBack,
    renderTemplateHtml,
    handleDownloadPDF,
    // New features
    isGeneratingPdf,
    showPdfPreview,
    setShowPdfPreview,
    pdfPreviewHtml,
    handlePreviewPdf,
    handleConfirmDownload,
    clearDraft,
    resetForm,
    hasDraft,
    loadDraft,
    lastSaved,
  };
};

export default useWizardForm;
