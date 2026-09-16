import "../global.css";
import { Stack, Tabs, Redirect } from "expo-router";
import { View, Image, Text } from "react-native";
import { useFonts, Nabla_400Regular } from "@expo-google-fonts/nabla";

const Layout = () => {
  const [fontsLoaded] = useFonts({
    Nabla: Nabla_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default Layout;
