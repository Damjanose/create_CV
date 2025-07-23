import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AboutMeScreen from "../../screens/AboutMeScreen";
import ExperienceScreen from "../../screens/ExperienceScreen";
import EducationScreen from "../../screens/EducationScreen";
import SkillsScreen from "../../screens/SkillsScreen";
import ReviewGenerateScreen from "../../screens/ReviewGenerateScreen";

const Stack = createNativeStackNavigator();

const SignedInRoutes = () => (
  <Stack.Navigator
    initialRouteName="AboutMe"
    screenOptions={{ headerShown: false, animation: "fade" }}
  >
    <Stack.Screen name="AboutMe" component={AboutMeScreen} />
    <Stack.Screen name="Experience" component={ExperienceScreen} />
    <Stack.Screen name="Education" component={EducationScreen} />
    <Stack.Screen name="Skills" component={SkillsScreen} />
    <Stack.Screen name="ReviewGenerate" component={ReviewGenerateScreen} />
  </Stack.Navigator>
);

export default SignedInRoutes;
