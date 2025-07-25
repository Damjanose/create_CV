import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ClassicTemplate from "../screens/templates/ClassicTemplate";
import ModernTemplate from "../screens/templates/ModernTemplate";
import MinimalTemplate from "../screens/templates/MinimalTemplate";

interface WizardPreviewStepProps {
  selectedTemplate: string;
  experience: any[];
  education: any[];
  aboutMe: any;
  contact: any;
  address: any;
  skills: any[];
  languages: any[];
  styles: any;
  handleDownloadPDF: () => void;
}

const WizardPreviewStep = ({
  selectedTemplate,
  experience,
  education,
  aboutMe,
  contact,
  address,
  skills,
  languages,
  styles,
  handleDownloadPDF,
}: WizardPreviewStepProps) => {
  let TemplateComponent: React.ComponentType<any> | null = null;
  let templateProps: any = {};
  if (selectedTemplate === "classic") {
    TemplateComponent = ClassicTemplate;
    const timelineExperience = experience.map((exp: any) => ({
      company: exp.company,
      location: "",
      startDate: exp.startDate,
      endDate: exp.endDate,
      position: exp.jobTitle,
      bullets: exp.description
        ? exp.description.split("\n").filter(Boolean)
        : [],
    }));
    const timelineEducation = education.map((edu: any) => ({
      institution: edu.school,
      location: "",
      year: `${edu.startDate} – ${edu.endDate}`,
      degree: edu.degree,
      bullets: edu.description
        ? edu.description.split("\n").filter(Boolean)
        : [],
    }));
    templateProps = {
      cvName: `${contact.name} ${contact.lastname}`,
      aboutMeText: aboutMe.summary,
      imageUri: aboutMe.image,
      links: [],
      reference: { name: "", title: "", phone: "", email: "" },
      hobbies: [],
      name: contact.name,
      lastname: contact.lastname,
      jobTitle: "",
      contact,
      address,
      experience: timelineExperience,
      education: timelineEducation,
      skills,
      languages,
    };
  } else if (selectedTemplate === "modern") {
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
    const modernExperience = experience.map((exp: any) => ({
      period: `${exp.startDate} – ${exp.endDate}`,
      company: exp.company,
      role: exp.jobTitle,
      bullets: exp.description
        ? exp.description.split("\n").filter(Boolean)
        : [],
    }));
    const modernEducation = education.map((edu: any) => ({
      period: `${edu.startDate} – ${edu.endDate}`,
      location: "",
      degree: edu.degree,
      school: edu.school,
    }));
    const modernLanguages = languages.map((l: any) => ({
      label: l.name,
      level: l.level,
    }));
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
  } else if (selectedTemplate === "minimal") {
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
        languages: languages.map((l: any) => l.name),
      },
      experience,
      education,
      skills,
      contact,
      address,
    };
  } else {
    TemplateComponent = null;
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#f2f4f8" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          alignItems: "stretch",
          padding: 0,
          paddingBottom: 100,
        }}
        style={{ flex: 1 }}
      >
        {TemplateComponent ? (
          <TemplateComponent {...templateProps} />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
            }}
          >
            <Text style={{ color: "#888", fontSize: 18 }}>
              No template selected.
            </Text>
          </View>
        )}
      </ScrollView>
      <View
        pointerEvents="box-none"
        style={{ position: "absolute", right: 20, bottom: 20, zIndex: 100 }}
      >
        <TouchableOpacity
          style={{
            borderRadius: 32,
            width: 64,
            height: 64,
            justifyContent: "center",
            alignItems: "center",
            elevation: 8,
            shadowColor: "#000",
            shadowOpacity: 0.18,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            backgroundColor: styles.buttonPrimary.backgroundColor,
          }}
          onPress={handleDownloadPDF}
          activeOpacity={0.85}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 28 }}>
            ↓
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WizardPreviewStep;
