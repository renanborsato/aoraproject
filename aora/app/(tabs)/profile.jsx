import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, StatusBar, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "../../components/CustomButton";
import InfoBox from "../../components/InfoBox";
import VideoCard from "../../components/VideoCard";
import { getFileViewUrl } from "../../lib/app";
import { getUserPosts } from "../../lib/database";
import { useGlobalContext } from "../../lib/global-provider";
import useAppwrite from "../../lib/useAppwrite";

export default function Profile() {
  const { user, signOut } = useGlobalContext();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [playingPostId, setPlayingPostId] = useState(null);
  const fetchUserPosts = useCallback(() => getUserPosts(user?.$id), [user?.$id]);
  const { data: posts, isLoading, error, refetch } = useAppwrite(fetchUserPosts);

  useEffect(() => {
    if (error) Alert.alert("Could not load your videos", error.message || "Please try again.");
  }, [error]);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (signOutError) {
      Alert.alert("Sign out failed", signOutError?.message || "Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const toggleVideo = useCallback((postId) => {
    setPlayingPostId((currentId) => currentId === postId ? null : postId);
  }, []);

  const stopVideo = useCallback((postId) => {
    setPlayingPostId((currentId) => currentId === postId ? null : currentId);
  }, []);

  const username = user?.profile?.username || user?.name || user?.email?.split("@")[0] || "Aora user";
  const avatar = user?.profile?.avatar;
  const avatarSource = avatar ? { uri: /^https?:\/\//i.test(avatar) ? avatar : getFileViewUrl(avatar) } : null;
  const accountYear = user?.registration ? new Date(user.registration).getFullYear() : "—";

  const profileHeader = (
    <View className="mb-6">
      <View className="mb-8 flex-row items-center justify-between">
        <Text className="font-semibold text-2xl text-white">My Profile</Text>
        <Ionicons name="person-circle-outline" size={28} color="#CDCDE0" />
      </View>

      <View className="items-center rounded-2xl border border-secondary bg-[#0D0D13] px-5 py-7">
        {avatarSource ? (
          <Image
            source={avatarSource}
            className="h-24 w-24 rounded-full border-2 border-secondary"
            resizeMode="cover"
            accessibilityLabel={`${username}'s profile avatar`}
          />
        ) : (
          <View className="h-24 w-24 items-center justify-center rounded-full border-2 border-secondary bg-secondary">
            <Text className="font-semibold text-4xl text-white">{username.slice(0, 1).toUpperCase()}</Text>
          </View>
        )}
        <Text className="mt-4 font-semibold text-2xl text-white" numberOfLines={1}>
          {username}
        </Text>
        <Text className="mt-1 text-sm text-gray-400" numberOfLines={1}>
          {user?.email || ""}
        </Text>

        <View className="mt-6 w-full flex-row items-center justify-center border-t border-secondary pt-5">
          <InfoBox title={posts.length} subtitle="Videos" styles="flex-1" />
          <View className="h-10 w-px bg-secondary" />
          <InfoBox title={accountYear} subtitle="Member since" styles="flex-1" />
        </View>
      </View>

      <View className="mb-2 mt-8 flex-row items-center justify-between">
        <Text className="font-semibold text-xl text-white">My Videos</Text>
        <Text className="text-sm text-gray-400">{posts.length} total</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#161622" />
      <FlatList
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 }}
        data={posts}
        keyExtractor={(post) => post.$id}
        renderItem={({ item }) => (
          <VideoCard
            post={item}
            playKey={`profile-${item.$id}`}
            isPlaying={playingPostId === `profile-${item.$id}`}
            onTogglePlay={toggleVideo}
            onPlaybackEnd={stopVideo}
          />
        )}
        ListHeaderComponent={profileHeader}
        ListEmptyComponent={(
          <View className="items-center py-8">
            {isLoading ? (
              <ActivityIndicator color="#FFA001" />
            ) : (
              <Text className="text-center text-sm text-gray-400">You haven’t uploaded any videos yet.</Text>
            )}
          </View>
        )}
        ListFooterComponent={(
          <View className="mt-4">
            <CustomButton title="Sign Out" handlePress={handleSignOut} isLoading={isSigningOut} />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFA001" colors={["#FFA001"]} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
