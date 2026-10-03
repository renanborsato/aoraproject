import "../global.css";

import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, router, useSegments } from "expo-router";
import { Nabla_400Regular } from "@expo-google-fonts/nabla";
import { useFonts } from "@expo-google-fonts/nabla";
import { GlobalProvider, useGlobalContext } from "../lib/global-provider";

function RouteGuard() {
  const { user, isLoading } = useGlobalContext();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === "(auth)";
    if (user && inAuth) router.replace("/(tabs)/home");
    if (!user && !inAuth) router.replace("/(auth)/sign-in");
  }, [user, isLoading, segments]);

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: "#161622", alignItems: "center", justifyContent: "center" }}><ActivityIndicator size="large" color="#FFA001" /></View>;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Nabla: Nabla_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return <GlobalProvider><RouteGuard /></GlobalProvider>;
};

export default RootLayout;
