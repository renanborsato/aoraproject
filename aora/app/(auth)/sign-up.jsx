import React, { useState } from "react";
import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import CustomButton from "../../components/CustomButton";
import CustomFormField from "../../components/CustomFormField";
import icon from "../../assets/icon.png";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};
    const normalizedEmail = form.email.trim();
    const normalizedUsername = form.username.trim();

    if (!normalizedUsername) {
      nextErrors.username = "Username is required.";
    } else if (normalizedUsername.length < 3) {
      nextErrors.username = "Username must be at least 3 characters.";
    }

    if (!normalizedEmail) {
      nextErrors.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate account creation until a backend is connected.
      await new Promise((resolve) => setTimeout(resolve, 900));
      router.replace("/(auth)/sign-in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field) => (value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#161622" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-10">
          <View className="items-center">
            <Image
              source={icon}
              className="h-20 w-20 rounded-full"
              resizeMode="cover"
              accessibilityLabel="Aora logo"
            />
            <Text className="mt-6 font-nabla text-5xl text-primary">
              Sign Up
            </Text>
            <Text className="mt-3 text-center font-pregular text-base leading-6 text-gray-100">
              Create your account to get started.
            </Text>
          </View>

          <View className="mt-10 w-full gap-6">
            <CustomFormField
              title="Username"
              value={form.username}
              placeholder="Choose a username"
              handleChangeText={updateField("username")}
              autoCapitalize="none"
              autoComplete="username"
              textContentType="username"
              error={errors.username}
            />

            <CustomFormField
              title="Email"
              value={form.email}
              placeholder="you@example.com"
              handleChangeText={updateField("email")}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              error={errors.email}
            />

            <CustomFormField
              title="Password"
              value={form.password}
              placeholder="Create a password"
              handleChangeText={updateField("password")}
              secureTextEntry={!showPassword}
              toggleSecureEntry={() => setShowPassword((current) => !current)}
              autoComplete="new-password"
              textContentType="newPassword"
              error={errors.password}
            />
          </View>

          <View className="mt-8 w-full">
            <CustomButton
              title="Sign Up"
              handlePress={handleSubmit}
              isLoading={isSubmitting}
            />
          </View>

          <View className="mt-8 flex-row items-center justify-center">
            <Text className="font-pregular text-sm text-gray-100">
              Already have an account?{" "}
            </Text>
            <Link
              href="/(auth)/sign-in"
              className="font-psemibold text-sm text-primary"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
