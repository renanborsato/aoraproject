import React, { useState } from "react";
import { Alert, Image, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import CustomButton from "../../components/CustomButton";
import CustomFormField from "../../components/CustomFormField";
import icon from "../../assets/icon.png";
import { signInUser } from "../../lib/auth";

const getErrorMessage = (error) => error?.message || "Unable to sign in. Please try again.";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};
    const normalizedEmail = form.email.trim();

    if (!normalizedEmail) {
      nextErrors.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);

    try {
      await signInUser(form);
      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert("Sign in failed", getErrorMessage(error));
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
            <Text className="mt-6 font-pregular text-3xl text-gray-100">
              Sign In
            </Text>
            <Text className="mt-3 text-center font-pregular text-base leading-6 text-gray-100">
              Welcome back. Enter your details to continue.
            </Text>
          </View>

          <View className="mt-10 w-full gap-6">
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
              placeholder="Enter your password"
              handleChangeText={updateField("password")}
              secureTextEntry={!showPassword}
              toggleSecureEntry={() => setShowPassword((current) => !current)}
              autoComplete="password"
              textContentType="password"
              error={errors.password}
            />
          </View>

          <View className="mt-8 w-full">
            <CustomButton
              title="Sign In"
              handlePress={handleSubmit}
              isLoading={isSubmitting}
            />
          </View>

          <View className="mt-8 flex-row items-center justify-center">
            <Text className="font-pregular text-sm text-gray-100">
              Don&apos;t have an account?{" "}
            </Text>
            <Link
              href="/(auth)/sign-up"
              className="text-sm"
              style={{ color: "#3B82F6", fontWeight: "600" }}
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
