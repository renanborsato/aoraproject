import React from "react";
import { Image, Text, View } from "react-native";
import { router } from "expo-router";

import CustomButton from "./CustomButton";
import { images } from "../constants/images";

export default function EmptyState() {
  return (
    <View className="w-[280px] items-center rounded-2xl border border-secondary bg-[#0D0D13] p-4">
      <Image
        source={images.emptyState}
        className="h-28 w-full rounded-xl"
        resizeMode="cover"
        accessibilityLabel="Cityscape video placeholder"
      />
      <Text className="mt-4 text-center font-semibold text-lg text-white">No videos found</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-gray-300">Be the first one to upload a video and share it with the community.</Text>
      <View className="mt-4 w-full">
        <CustomButton title="Create Video" handlePress={() => router.push("/(tabs)/create")} />
      </View>
    </View>
  );
}
