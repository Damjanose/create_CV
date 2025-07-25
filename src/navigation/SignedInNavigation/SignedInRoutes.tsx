import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WizardForm from "../../components/WizardForm.tsx";

const Stack = createNativeStackNavigator();

const SignedInRoutes = () => (
  <Stack.Navigator
    initialRouteName="WizardForm"
    screenOptions={{ headerShown: false, animation: "fade" }}
  >
    <Stack.Screen name="WizardForm" component={WizardForm} />
  </Stack.Navigator>
);

export default SignedInRoutes;
