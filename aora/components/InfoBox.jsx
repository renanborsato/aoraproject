import React from "react";
import { Text, View } from "react-native";

export default function InfoBox({ title, subtitle, styles = "", titleStyles = "" }) {
  return (
    <View className={`min-w-[88px] items-center justify-center ${styles}`}>
      <Text className={`font-semibold text-xl text-white ${titleStyles}`} numberOfLines={1}>
        {title}
      </Text>
      <Text className="mt-1 text-xs text-gray-400" numberOfLines={1}>
        {subtitle}
      </Text>
    </View>
  );
}
