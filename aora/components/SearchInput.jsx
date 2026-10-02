import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchInput({ value, onChangeText, onSubmit, placeholder = "Search for a video topic" }) {
  return (
    <View className="h-14 flex-row items-center rounded-2xl border border-secondary bg-[#0D0D13] px-4">
      <TextInput
        className="flex-1 text-base text-white"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor="#7B7B8B"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search videos"
      />
      <TouchableOpacity onPress={onSubmit} accessibilityRole="button" accessibilityLabel="Search">
        <Ionicons name="search" size={22} color="#CDCDE0" />
      </TouchableOpacity>
    </View>
  );
}
