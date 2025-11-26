import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import WizardForm from "./src/components/WizardForm";

const client = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={client}>
        <WizardForm />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
