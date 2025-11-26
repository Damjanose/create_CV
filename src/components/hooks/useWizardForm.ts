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

import { useState } from "react";
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
      flexGrow: 1,
      backgroundColor: bg,
      alignItems: "center",
      paddingVertical: 24,
      justifyContent: "center",
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
      width: "90%",
      maxWidth: 400,
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 20,
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
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 4,
    },
    buttonPrimary: {
      backgroundColor: primary,
    },
    buttonSecondary: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: secondary,
    },
    buttonDisabled: {
      backgroundColor: secondary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFF",
    },
    textSecondary: {
      color: isDark ? "#888" : "#555",
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
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([""]);
  const [hobbies, setHobbies] = useState<string[]>([""]);
  const [errors, setErrors] = useState<
    AboutMeErrors | ExperienceErrors | EducationErrors
  >({});
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const validateStep = (): boolean => {
    setErrorMsg("");
    let valid = true;
    if (step === 0) {
      // Welcome step - always allow to proceed
      return true;
    }
    if (step === 1) {
      // Template selection step - must have a template selected
      if (!selectedTemplate) {
        setErrorMsg("Please select a template to continue.");
        return false;
      }
      return true;
    }
    if (step === 2) {
      // About Me step
      if (!aboutMe.summary || aboutMe.summary.trim() === "") valid = false;
      if (
        !contact.name ||
        !contact.lastname ||
        !contact.phone ||
        !contact.email
      )
        valid = false;
      if (!address.countryName || !address.cityName || !address.address1)
        valid = false;
      if (!valid) setErrorMsg("Please fill all required fields.");
      return valid;
    }
    if (step === 3) {
      // Languages & Skills step
      if (languages.length === 0 || skills.length === 0) {
        setErrorMsg("Please add at least one language and one skill.");
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
      return !!selectedTemplate;
    }
    if (step === 2) {
      // About Me step
      return !!(
        aboutMe.summary.trim() !== "" &&
        contact.name &&
        contact.lastname &&
        contact.phone &&
        contact.email &&
        address.countryName &&
        address.cityName &&
        address.address1
      );
    }
    if (step === 3) {
      // Languages & Skills step
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
    setErrorMsg("");
    animateTo(step - 1);
  };

  const renderTemplateHtml = (imageBase64?: string): string => {
    let html = "";
    let imageHtml = "";
    if (imageBase64) {
      imageHtml = `<img src='data:image/jpeg;base64,${imageBase64}' style='width:40px;height:40px;border-radius:20px;object-fit:cover;background:#eee;display:block;margin:0 auto 5px;'/>`;
    }
    if (selectedTemplate === "classic") {
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
              return `
              <div style="margin-bottom:8px;">
                <div style="font-size:7pt;font-weight:600;color:#000;">${exp.jobTitle}</div>
                <div style="font-size:5.5pt;color:#555;margin-bottom:2px;">${exp.company} (${exp.startDate} – ${exp.ongoing ? "Present" : exp.endDate})</div>
                ${bullets.map((b) => `<div style="font-size:6pt;color:#333;margin-left:5px;margin-bottom:2px;">• ${b}</div>`).join("")}
              </div>
            `;
            }).join("")}
            
            <div style="font-size:9pt;font-weight:700;margin-bottom:4px;color:#000;">Education</div>
            <div style="height:1px;background:#ddd;margin-bottom:5px;"></div>
            ${education.map((edu) => {
              const bullets = edu.description ? edu.description.split("\n").filter(Boolean) : [];
              return `
              <div style="margin-bottom:8px;">
                <div style="font-size:7pt;font-weight:600;color:#000;">${edu.degree}</div>
                <div style="font-size:5.5pt;color:#555;margin-bottom:2px;">${edu.school} (${edu.startDate} – ${edu.ongoing ? "Present" : edu.endDate})</div>
                ${bullets.map((b) => `<div style="font-size:6pt;color:#333;margin-left:5px;margin-bottom:2px;">• ${b}</div>`).join("")}
              </div>
            `;
            }).join("")}
          </div>
        </div>
      `;
    } else if (selectedTemplate === "modern") {
      // ModernTemplate: Header with name/lastname, contact row, sections - matching preview exactly
      const locationStr = `${address.countryName}, ${address.cityName}, ${address.address1} ${address.address2}`.trim();
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
          
          <!-- Contact Row -->
          <div style="display:flex;flex-direction:row;justify-content:center;margin:6px 0;">
            <div style="font-size:5pt;color:#333;margin:0 6px;">${contact.email}</div>
            <div style="font-size:5pt;color:#333;margin:0 6px;">${locationStr}</div>
            <div style="font-size:5pt;color:#333;margin:0 6px;">${contact.phone}</div>
          </div>
          
          <!-- Divider -->
          <div style="height:1px;background:#000;margin:6px 0;"></div>
          
          <!-- Languages -->
          ${languages.length > 0 ? `
            <div style="font-size:7pt;font-weight:700;background:#ddd;padding:2px 4px;margin-top:10px;margin-bottom:5px;display:inline-block;">Languages</div>
            <div style="display:flex;flex-direction:row;justify-content:space-between;margin-bottom:8px;">
              ${languages.map((lang) => `
                <div style="flex:1;margin:0 3px;">
                  <div style="font-size:5pt;margin-bottom:2px;color:#333;">${lang.label}</div>
                  <div style="display:flex;flex-direction:row;height:3px;background:#EEE;border-radius:2px;">
                    <div style="width:${lang.level * 100}%;background:#333;border-radius:2px;"></div>
                    <div style="flex:1;"></div>
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
    } else {
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
              ${experience.map((exp) => `
                <div style="margin-bottom:8px;">
                  <div style="font-size:7pt;font-weight:600;color:#000;">${exp.jobTitle}</div>
                  <div style="font-size:5.5pt;color:#555;margin-bottom:2px;">${exp.company} (${exp.startDate} – ${exp.ongoing ? "Present" : exp.endDate})</div>
                  <div style="font-size:6pt;color:#333;margin-left:5px;margin-bottom:2px;">• ${exp.description}</div>
                </div>
              `).join("")}
              
              <div style="font-size:9pt;font-weight:700;margin-bottom:4px;color:#000;">Education</div>
              <div style="height:1px;background:#ddd;margin-bottom:5px;"></div>
              ${education.map((edu) => `
                <div style="margin-bottom:8px;">
                  <div style="font-size:7pt;font-weight:600;color:#000;">${edu.degree}</div>
                  <div style="font-size:5.5pt;color:#555;margin-bottom:2px;">${edu.school} (${edu.startDate} – ${edu.ongoing ? "Present" : edu.endDate})</div>
                  <div style="font-size:6pt;color:#333;margin-left:5px;margin-bottom:2px;">• ${edu.description}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    }
    return `<html><head><meta charset="UTF-8"><style>@page { size: A4; margin: 0; }</style></head><body style='margin:0;padding:0;font-family:sans-serif;'>${html}</body></html>`;
  };

  const handleDownloadPDF = async (): Promise<void> => {
    let imageBase64 = aboutMe.imageBase64;
    if (!imageBase64 && aboutMe.image) {
      try {
        imageBase64 = await RNFS.readFile(aboutMe.image, "base64");
      } catch (e) {}
    }
    try {
      const html = renderTemplateHtml(imageBase64);
      const safeName = `${contact.name}_${contact.lastname}_cv`.replace(
        /\s+/g,
        "_",
      );
      const file = await RNHTMLtoPDF.convert({
        html,
        fileName: safeName,
        directory: "Documents",
        base64: false,
      });
      let destPath = file.filePath;
      if (!destPath) throw new Error("PDF file path not found");
      if (Platform.OS === "android") {
        const downloadDir = `${RNFS.DownloadDirectoryPath}/${safeName}.pdf`;
        await RNFS.moveFile(destPath, downloadDir);
        destPath = downloadDir;
      }
      Alert.alert("Success", `CV PDF saved to: ${destPath}`);
    } catch (e) {
      Alert.alert("Error", "Failed to generate or save PDF.");
    }
  };

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
    selectedTemplate,
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
  };
};

export default useWizardForm;
