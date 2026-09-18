import React from "react";
import { Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomFormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles = "",
  keyboardType = "default",
  secureTextEntry = false,
  toggleSecureEntry,
  autoCapitalize = "none",
  autoComplete,
  textContentType,
  error,
}) => {
  return (
    <View className={`w-full ${otherStyles}`}>
      <Text className="mb-2 font-pmedium text-sm text-gray-100">{title}</Text>

      <View
        className={`h-16 flex-row items-center rounded-2xl border px-4 ${
          error ? "border-red-400" : "border-secondary"
        } bg-black-100`}
      >
        <TextInput
          className="flex-1 font-pregular text-base text-white"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          autoComplete={autoComplete}
          textContentType={textContentType}
          returnKeyType="done"
        />

        {toggleSecureEntry ? (
          <Ionicons
            name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#CDCDE0"
            onPress={toggleSecureEntry}
            accessibilityRole="button"
            accessibilityLabel={
              secureTextEntry ? "Show password" : "Hide password"
            }
          />
        ) : null}
      </View>

      {error ? (
        <Text className="mt-2 font-pregular text-sm text-red-400">{error}</Text>
      ) : null}
    </View>
  );
};

export default CustomFormField;
