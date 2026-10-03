import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Image, Keyboard, RefreshControl, StatusBar, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import VideoCard from "../../components/VideoCard";
import { images } from "../../constants/images";
import { getAllPosts, getLatestPosts } from "../../lib/database";
import { useGlobalContext } from "../../lib/global-provider";
import useAppwrite from "../../lib/useAppwrite";

const placeholderPosts = [
  { $id: "sample-1", title: "A morning in the mountains", prompt: "A short travel video placeholder.", creatorName: "Sample creator", video: require("../../assets/yeah_boy.mp4"), isPlaceholder: true },
  { $id: "sample-2", title: "Finding inspiration in the city", prompt: "A creative video placeholder.", creatorName: "Sample creator", video: require("../../assets/yeah_boy.mp4"), isPlaceholder: true },
  { $id: "sample-3", title: "A quiet afternoon", prompt: "A community story placeholder.", creatorName: "Sample creator", video: require("../../assets/yeah_boy.mp4"), isPlaceholder: true },
  { $id: "sample-4", title: "Behind the scenes", prompt: "A behind-the-scenes video placeholder.", creatorName: "Sample creator", video: require("../../assets/yeah_boy.mp4"), isPlaceholder: true },
];
const videoViewabilityConfig = { itemVisiblePercentThreshold: 35 };

export default function Home() {
  const { user } = useGlobalContext();
  const fetchPosts = useCallback(() => getAllPosts(), []);
  const { data: posts, isLoading, error, refetch } = useAppwrite(fetchPosts);
  const fetchTrendingPosts = useCallback(() => getLatestPosts(), []);
  const { data: trendingPosts, isLoading: isTrendingLoading, refetch: refetchTrendingPosts } = useAppwrite(fetchTrendingPosts);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [playingPostId, setPlayingPostId] = useState(null);
  const displayName = user?.profile?.username || user?.name || "there";
  const verticalPosts = posts.length ? posts : placeholderPosts;
  const trendingSourcePosts = trendingPosts.length ? trendingPosts : placeholderPosts;

  useEffect(() => {
    if (error) Alert.alert("Could not load videos", error.message || "Please try again.");
  }, [error]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch(), refetchTrendingPosts()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, refetchTrendingPosts]);

  const toggleVideo = useCallback((postId) => {
    setPlayingPostId((currentId) => currentId === postId ? null : postId);
  }, []);

  const stopVideo = useCallback((postId) => {
    setPlayingPostId((currentId) => currentId === postId ? null : currentId);
  }, []);

  const handleTrendingActiveChange = useCallback((activePostId) => {
    setPlayingPostId((currentId) => currentId?.startsWith("trending-") && currentId !== activePostId ? null : currentId);
  }, []);

  const handleVerticalViewableItemsChanged = useCallback(({ viewableItems }) => {
    const visiblePostIds = new Set(viewableItems.map(({ item }) => item.$id));
    setPlayingPostId((currentId) => {
      if (currentId?.startsWith("latest-") && !visiblePostIds.has(currentId.slice("latest-".length))) return null;
      return currentId;
    });
  }, []);

  const handleSearch = useCallback(() => {
    const query = searchText.trim();
    if (!query) {
      Alert.alert("Search videos", "Enter a topic to search for.");
      return;
    }
    Keyboard.dismiss();
    router.push({ pathname: "/search/[query]", params: { query } });
  }, [searchText]);

  const filteredPosts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return verticalPosts;
    return verticalPosts.filter((post) => `${post.title || ""} ${post.prompt || ""}`.toLowerCase().includes(query));
  }, [verticalPosts, searchText]);

  const filteredTrendingPosts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return trendingSourcePosts;
    return trendingSourcePosts.filter((post) => `${post.title || ""} ${post.prompt || ""}`.toLowerCase().includes(query));
  }, [trendingSourcePosts, searchText]);

  const listHeader = (
    <View className="pb-6">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-sm text-gray-300">Welcome back,</Text>
          <Text className="mt-1 font-semibold text-3xl text-white" numberOfLines={1}>{displayName}</Text>
        </View>
        <Image source={images.logo} className="h-14 w-14 rounded-xl" resizeMode="cover" accessibilityLabel="Aora logo" />
      </View>

      <View className="mt-7">
        {searchText.trim() ? (
          <Text className="mb-3 font-semibold text-base text-white">
            Search results for “{searchText.trim()}”
          </Text>
        ) : null}
        <SearchInput value={searchText} onChangeText={setSearchText} onSubmit={handleSearch} />
      </View>

      <Text className="mb-4 mt-8 font-semibold text-xl text-white">Trending</Text>
      <Trending
        posts={filteredTrendingPosts}
        playingPostId={playingPostId}
        onTogglePlay={toggleVideo}
        onPlaybackEnd={stopVideo}
        onActiveChange={handleTrendingActiveChange}
        showEmptyState={!isTrendingLoading && trendingPosts.length === 0 && filteredTrendingPosts.length > 0}
      />

      <View className="mt-8 flex-row items-center justify-between">
        <Text className="font-semibold text-xl text-white">Latest Videos</Text>
        <Text className="text-sm text-gray-400">Recently added</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#161622" />
      <FlatList
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 }}
        data={filteredPosts}
        keyExtractor={(post) => post.$id}
        viewabilityConfig={videoViewabilityConfig}
        onViewableItemsChanged={handleVerticalViewableItemsChanged}
        renderItem={({ item }) => (
          <VideoCard
            post={item}
            playKey={`latest-${item.$id}`}
            isPlaying={playingPostId === `latest-${item.$id}`}
            onTogglePlay={toggleVideo}
            onPlaybackEnd={stopVideo}
          />
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={isLoading && posts.length === 0 ? <Text className="py-6 text-center text-sm text-gray-400">Loading videos...</Text> : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFA001" colors={["#FFA001"]} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}
