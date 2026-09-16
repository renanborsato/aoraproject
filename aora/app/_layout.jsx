import "../global.css";

import React from "react";
import { Stack } from "expo-router";
import { Nabla_400Regular } from "@expo-google-fonts/nabla";
import { useFonts } from "@expo-google-fonts/nabla";

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Nabla: Nabla_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default RootLayout;
