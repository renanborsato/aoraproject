import React from "react";
import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import CustomButton from "../components/CustomButton";
import icon from "../assets/icon.png";
import cityscape from "../assets/cityscape.png";

const Onboarding = () => {
  const handleContinue = () => {
    router.replace("/sign-in");
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
        <View className="flex-1 justify-start py-16">
          {/* Logo */}
          <View className="items-center px-6">
            <Image
              source={icon}
              className="h-20 w-20 rounded-full"
              resizeMode="cover"
            />
          </View>

          {/* Cityscape */}
          <View
            style={{
              position: "relative",
              width: "100%",
              height: 320,
              marginTop: 24,
            }}
          >
            <Image
              source={cityscape}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="cover"
            />

            <LinearGradient
              colors={["#161622", "rgba(22, 22, 34, 0)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 120,
              }}
            />

            <LinearGradient
              colors={["rgba(22, 22, 34, 0)", "#161622"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 120,
              }}
            />
          </View>

          {/* Text + Button */}
          <View className="-mt-32 items-center px-6">
            <View className="items-center">
              <Text className="text-center font-psemibold text-3xl text-white">
                Discover Endless Possibilities with Aora
              </Text>

              <Text className="mt-4 max-w-sm text-center font-pregular text-base leading-6 text-gray-100">
                Where creativity meets innovation. Embark on a journey of
                limitless exploration with Aora.
              </Text>
            </View>

            <View className="mt-8 w-full">
              <CustomButton
                title="Continue with Email"
                handlePress={handleContinue}
                isLoading={false}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Onboarding;
