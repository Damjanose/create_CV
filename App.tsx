import React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

const client = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={client}>
        <RootNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
