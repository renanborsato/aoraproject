import React, { useState } from "react";
import { Alert, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../lib/global-provider";

export default function Profile() {
  const { user, signOut } = useGlobalContext();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      Alert.alert("Sign out failed", error?.message || "Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#161622" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center justify-center px-6 py-10">
          <Text className="font-nabla text-5xl text-primary">Profile</Text>
          <Text className="mt-6 text-base text-gray-100">{user?.email}</Text>
          <View className="mt-8 w-full">
            <CustomButton title="Sign Out" handlePress={handleSignOut} isLoading={isSigningOut} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
