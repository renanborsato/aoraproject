import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { VideoView, useVideoPlayer } from "expo-video";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "../../components/CustomButton";
import FormField from "../../components/CustomFormField";
import { createVideo } from "../../lib/database";
import { useGlobalContext } from "../../lib/global-provider";
import { prepareUploadAsset, uploadThumbnail, uploadVideo } from "../../lib/storage";

const createEmptyForm = () => ({ title: "", video: null, thumbnail: null, prompt: "" });

function VideoPreview({ uri }) {
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.play();
  });

  return (
    <VideoView
      player={player}
      style={{ width: "100%", height: "100%" }}
      contentFit="cover"
      nativeControls={false}
    />
  );
}

const formatFileSize = (size) => {
  if (!size) return "";
  return size < 1024 * 1024
    ? `${Math.max(1, Math.round(size / 1024))} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function Create() {
  const { user } = useGlobalContext();
  const [form, setForm] = useState(createEmptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openPicker = async (kind) => {
    const isVideo = kind === "video";

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: isVideo ? "video/*" : "image/*",
        // Android's picker cache can be outside Expo Go's scoped filesystem.
        copyToCacheDirectory: Platform.OS !== "android",
        multiple: false,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset) {
        Alert.alert("Could not select file", "Please choose a different file and try again.");
        return;
      }

      const selected = Platform.OS === "web" ? asset : await prepareUploadAsset(asset);
      setForm((current) => ({
        ...current,
        [kind]: {
          uri: selected.uri,
          name: selected.name,
          mimeType: selected.mimeType,
          size: selected.size,
        },
      }));
    } catch (error) {
      Alert.alert("Could not open files", error?.message || "Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!form.title.trim()) {
      Alert.alert("Add a title", "Enter a title for your video before publishing.");
      return;
    }
    if (!form.video || !form.thumbnail) {
      Alert.alert("Add your media", "Choose both a video and a thumbnail before publishing.");
      return;
    }
    if (!user?.$id) {
      Alert.alert("Sign in required", "Sign in again before publishing your video.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload both assets first, then save their Appwrite file IDs with the post metadata.
      const [videoFile, thumbnailFile] = await Promise.all([
        uploadVideo({ ...form.video, userId: user.$id }),
        uploadThumbnail({ ...form.thumbnail, userId: user.$id }),
      ]);

      await createVideo({
        title: form.title,
        video: videoFile.$id,
        thumbnail: thumbnailFile.$id,
        prompt: form.prompt,
        creatorId: user.$id,
      });

      setForm(createEmptyForm());
      Alert.alert("Video published", "Your video is now available on the home page.", [
        { text: "Go to Home", onPress: () => router.replace("/(tabs)/home") },
      ]);
    } catch (error) {
      Alert.alert("Upload failed", error?.message || "Your video could not be published. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#161622" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8">
          <View className="mb-3 flex-row items-center">
            <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-secondary/20">
              <Ionicons name="cloud-upload-outline" size={18} color="#FFA001" />
            </View>
            <Text className="font-semibold text-xs tracking-widest text-primary">CREATE</Text>
          </View>
          <Text className="font-semibold text-3xl text-white">Upload Video</Text>
          <Text className="mt-2 text-sm leading-5 text-gray-400">
            Share your video and the idea behind how you made it.
          </Text>
        </View>

        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a title"
          handleChangeText={(title) => setForm((current) => ({ ...current, title }))}
          autoCapitalize="sentences"
        />

        <View className="mt-7">
          <Text className="mb-2 font-pmedium text-sm text-gray-100">Video</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => openPicker("video")}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel={form.video ? `Change video, ${form.video.name}` : "Choose a video to upload"}
            className="aspect-video w-full overflow-hidden rounded-2xl border border-secondary bg-black-100"
          >
            {form.video ? (
              <>
                <VideoPreview uri={form.video.uri} />
                <View className="absolute bottom-3 left-3 right-3 flex-row items-center justify-between rounded-xl bg-black/75 px-3 py-2">
                  <View className="mr-3 flex-1">
                    <Text className="font-pmedium text-sm text-white" numberOfLines={1}>{form.video.name}</Text>
                    <Text className="mt-0.5 text-xs text-gray-300">{formatFileSize(form.video.size)} · Tap to change</Text>
                  </View>
                  <Ionicons name="create-outline" size={20} color="#FFA001" />
                </View>
              </>
            ) : (
              <View className="flex-1 items-center justify-center px-6">
                <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-secondary/15">
                  <Ionicons name="videocam-outline" size={28} color="#FFA001" />
                </View>
                <Text className="font-pmedium text-base text-white">Choose a video</Text>
                <Text className="mt-1 text-center text-xs text-gray-400">MP4, MOV, or another supported video format</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7">
          <Text className="mb-2 font-pmedium text-sm text-gray-100">Thumbnail</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => openPicker("thumbnail")}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel={form.thumbnail ? `Change thumbnail, ${form.thumbnail.name}` : "Choose a thumbnail image"}
            className="h-52 w-full overflow-hidden rounded-2xl border border-secondary bg-black-100"
          >
            {form.thumbnail ? (
              <>
                <Image source={{ uri: form.thumbnail.uri }} className="h-full w-full" resizeMode="cover" />
                <View className="absolute bottom-3 left-3 right-3 flex-row items-center justify-between rounded-xl bg-black/75 px-3 py-2">
                  <View className="mr-3 flex-1">
                    <Text className="font-pmedium text-sm text-white" numberOfLines={1}>{form.thumbnail.name}</Text>
                    <Text className="mt-0.5 text-xs text-gray-300">Tap to change thumbnail</Text>
                  </View>
                  <Ionicons name="create-outline" size={20} color="#FFA001" />
                </View>
              </>
            ) : (
              <View className="flex-1 flex-row items-center justify-center px-6">
                <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-secondary/15">
                  <Ionicons name="image-outline" size={25} color="#FFA001" />
                </View>
                <View className="flex-1">
                  <Text className="font-pmedium text-base text-white">Choose a thumbnail</Text>
                  <Text className="mt-1 text-xs text-gray-400">PNG, JPG, or another image format</Text>
                </View>
                <Ionicons name="add-circle-outline" size={24} color="#CDCDE0" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="What prompt did you use to create this video?"
          handleChangeText={(prompt) => setForm((current) => ({ ...current, prompt }))}
          autoCapitalize="sentences"
          multiline
          numberOfLines={5}
          otherStyles="mt-7"
        />

        <View className="mt-8">
          <CustomButton
            title="Publish Video"
            handlePress={handleSubmit}
            isLoading={isSubmitting}
            containerStyles="bg-secondary"
          />
          <Text className="mt-3 text-center text-xs text-gray-500">
            Your video and thumbnail will appear on the home page.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
