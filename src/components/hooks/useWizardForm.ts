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
}
export interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
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
  "About Me, Contact & Address",
  "Languages & Skills",
  "Experience",
  "Education",
  "Template",
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = getStyles(isDark);

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
  const [skills, setSkills] = useState<string[]>([]);
  const [errors, setErrors] = useState<
    AboutMeErrors | ExperienceErrors | EducationErrors
  >({});
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const validateStep = (): boolean => {
    setErrorMsg("");
    let valid = true;
    if (step === 0) {
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
    if (step === 1) {
      if (languages.length === 0 || skills.length === 0) {
        setErrorMsg("Please add at least one language and one skill.");
        return false;
      }
    }
    return true;
  };

  const canGoNext = (): boolean => {
    if (step === 0) {
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
    setErrorMsg("");
    animateTo(step - 1);
  };

  const renderTemplateHtml = (imageBase64?: string): string => {
    let html = "";
    let imageHtml = "";
    if (imageBase64) {
      imageHtml = `<div style='text-align:center;margin-bottom:16px;'><img src='data:image/jpeg;base64,${imageBase64}' style='width:100px;height:100px;border-radius:50px;object-fit:cover;background:#eee;'/></div>`;
    }
    if (selectedTemplate === "classic") {
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
                  ${skills.map((skill) => `<span style='background:#e0e0e0;padding:4px 8px;border-radius:4px;font-size:12px;color:#333;margin-bottom:6px;'>${skill}</span>`).join("")}
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
                ${experience
                  .map(
                    (exp) => `
                  <div style='margin-bottom:12px;'>
                    <div style='font-size:16px;font-weight:600;color:#333;'>${exp.jobTitle}</div>
                    <div style='font-size:14px;color:#777;margin-bottom:4px;'>${exp.company} | ${exp.startDate} – ${exp.endDate}</div>
                    <div style='font-size:14px;color:#555;line-height:20px;'>${exp.description}</div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
              <div style="margin-bottom:20px;">
                <div style="font-size:20px;font-weight:600;color:#1976D2;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px;">Education</div>
                ${education
                  .map(
                    (edu) => `
                  <div style='margin-bottom:12px;'>
                    <div style='font-size:16px;font-weight:600;color:#333;'>${edu.degree}</div>
                    <div style='font-size:14px;color:#777;margin-bottom:4px;'>${edu.school} | ${edu.startDate} – ${edu.endDate}</div>
                    <div style='font-size:14px;color:#555;line-height:20px;'>${edu.description}</div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (selectedTemplate === "modern") {
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
              ${experience
                .map(
                  (exp) => `
                <div style='margin-bottom:10px;'>
                  <div style='font-size:15px;font-weight:600;color:#333;'>${exp.jobTitle} <span style='color:#1976D2;font-weight:bold;'>@</span> ${exp.company}</div>
                  <div style='font-size:13px;color:#888;margin-bottom:2px;'>${exp.startDate} - ${exp.endDate}</div>
                  <div style='font-size:14px;color:#222;'>${exp.description}</div>
                </div>
              `,
                )
                .join("")}
            </div>
            <div style="margin-bottom:18px;">
              <div style="font-size:18px;font-weight:bold;color:#1976D2;margin-bottom:6px;letter-spacing:1px;text-transform:uppercase;">Education</div>
              ${education
                .map(
                  (edu) => `
                <div style='margin-bottom:10px;'>
                  <div style='font-size:15px;font-weight:600;color:#333;'>${edu.degree}, ${edu.school}</div>
                  <div style='font-size:13px;color:#888;margin-bottom:2px;'>${edu.startDate} - ${edu.endDate}</div>
                  <div style='font-size:14px;color:#222;'>${edu.description}</div>
                </div>
              `,
                )
                .join("")}
            </div>
            <div style="margin-bottom:18px;">
              <div style="font-size:18px;font-weight:bold;color:#1976D2;margin-bottom:6px;letter-spacing:1px;text-transform:uppercase;">Skills</div>
              <div style='display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;'>
                ${skills.map((skill) => `<span style='background:#e3eafc;color:#1976D2;padding:2px 8px;border-radius:10px;margin-right:6px;margin-bottom:6px;font-weight:bold;font-size:13px;'>${skill}</span>`).join("")}
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      html = `
      <div style="width:595px;height:842px;margin:auto;padding:40px;box-sizing:border-box;background:#fff;border:1px solid #ccc;font-family:sans-serif;">
    <!-- Header -->
    <div style="display:flex;flex-direction:row;align-items:center;background:#3DF8C8;padding:20px;border-radius:6px;margin-bottom:24px;">
      ${
        imageBase64
          ? `
        <div style="flex-shrink:0;margin-right:16px;">
          <img src="data:image/jpeg;base64,${imageBase64}" style="width:80px;height:80px;border-radius:40px;object-fit:cover;background:#eee;" />
        </div>`
          : ""
      }
      <div>
        <div style="font-size:20px;font-weight:bold;color:#000;">${contact.name} ${contact.lastname}</div>
        <div style="font-size:14px;color:#222;">${aboutMe.summary?.split(" ").slice(0, 4).join(" ") || "Professional Title"}</div>
        <div style="font-size:12px;color:#111;margin-top:6px;">${address.address1}, ${address.cityName}, ${address.countryName}</div>
        <div style="font-size:12px;color:#111;">${contact.phone} | ${contact.email}</div>
      </div>
    </div>

    <!-- Body -->
    <div style="display:flex;flex-direction:row;gap:20px;">
      <!-- Left Column -->
      <div style="width:170px;">
        <div style="margin-bottom:24px;">
          <div style="font-size:14px;font-weight:bold;color:#000;margin-bottom:6px;">Skills</div>
          <ul style="padding-left:16px;margin:0;">
            ${skills.map((skill) => `<li style="font-size:12px;color:#444;margin-bottom:4px;">${skill}</li>`).join("")}
          </ul>
        </div>

        <div>
          <div style="font-size:14px;font-weight:bold;color:#000;margin-bottom:6px;">Languages</div>
          ${languages
            .map(
              (lang) => `
            <div style="margin-bottom:10px;">
              <div style="font-size:12px;color:#444;">${lang.name}</div>
              <div style="height:5px;background:#eee;border-radius:4px;overflow:hidden;margin-top:3px;">
                <div style="width:${(lang.level / 3) * 100}%;background:#333;height:100%;border-radius:4px;"></div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <!-- Right Column -->
      <div style="flex:1;">
        <div style="margin-bottom:16px;">
          <div style="font-size:16px;font-weight:bold;color:#000;margin-bottom:6px;">Profile</div>
          <div style="font-size:12px;line-height:1.5;color:#333;">${aboutMe.summary}</div>
        </div>

        <div style="margin-bottom:16px;">
          <div style="font-size:16px;font-weight:bold;color:#000;margin-bottom:6px;">Experience</div>
          ${experience
            .map(
              (exp) => `
            <div style="margin-bottom:12px;">
              <div style="font-size:13px;font-weight:600;color:#222;">${exp.jobTitle}, ${exp.company}</div>
              <div style="font-size:11px;color:#666;">${exp.startDate} — ${exp.endDate}</div>
              <ul style="padding-left:18px;margin:4px 0;">
                ${exp.description
                  ?.split("\n")
                  .map(
                    (line) =>
                      `<li style="font-size:11px;color:#444;">${line}</li>`,
                  )
                  .join("")}
              </ul>
            </div>
          `,
            )
            .join("")}
        </div>

        <div>
          <div style="font-size:16px;font-weight:bold;color:#000;margin-bottom:6px;">Education</div>
          ${education
            .map(
              (edu) => `
            <div style="margin-bottom:12px;">
              <div style="font-size:13px;font-weight:600;color:#222;">${edu.degree}, ${edu.school}</div>
              <div style="font-size:11px;color:#666;">${edu.startDate} — ${edu.endDate}</div>
              <ul style="padding-left:18px;margin:4px 0;">
                ${edu.description
                  ?.split("\n")
                  .map(
                    (line) =>
                      `<li style="font-size:11px;color:#444;">${line}</li>`,
                  )
                  .join("")}
              </ul>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>
  </div>
      `;
    }
    return `<html><body style='font-family:sans-serif;padding:24px;background:#f2f4f8;'>${html}</body></html>`;
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
    colorScheme,
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
