import React from "react";
import { ScrollView, Text, View } from "react-native";
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
      bullets: exp.description ? exp.description.split("\n").filter(Boolean) : [],
    }));
    const timelineEducation = education.map((edu: any) => ({
      institution: edu.school,
      location: "",
      year: `${edu.startDate} – ${edu.endDate}`,
      degree: edu.degree,
      bullets: edu.description ? edu.description.split("\n").filter(Boolean) : [],
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
    templateProps = {
      cvName: `${contact.name} ${contact.lastname}`,
      aboutMe: {
        cvName: `${contact.name} ${contact.lastname}`,
        name: contact.name,
        lastname: contact.lastname,
        summary: aboutMe.summary,
        email: contact.email,
        location: `${address.countryName}, ${address.cityName}, ${address.address1} ${address.address2}`,
        phone: contact.phone,
        imageUri: aboutMe.image,
      },
      skills: { hard: skills, soft: [] },
      experience: experience.map((exp: any) => ({
        period: `${exp.startDate} – ${exp.endDate}`,
        company: exp.company,
        role: exp.jobTitle,
        bullets: exp.description ? exp.description.split("\n").filter(Boolean) : [],
      })),
      education: education.map((edu: any) => ({
        period: `${edu.startDate} – ${edu.endDate}`,
        location: "",
        degree: edu.degree,
        school: edu.school,
      })),
      languages: languages.map((l: any) => ({ label: l.name, level: l.level })),
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        {TemplateComponent ? (
          <TemplateComponent {...templateProps} />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
            <Text style={{ color: "#888", fontSize: 18 }}>No template selected.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default WizardPreviewStep;
