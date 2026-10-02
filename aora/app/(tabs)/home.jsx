import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Image, Keyboard, RefreshControl, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import { images } from "../../constants/images";
import { getAllPosts } from "../../lib/database";
import { useGlobalContext } from "../../lib/global-provider";

const placeholderPosts = [
  { $id: "sample-1", title: "A morning in the mountains", prompt: "A short travel video placeholder.", isPlaceholder: true },
  { $id: "sample-2", title: "Finding inspiration in the city", prompt: "A creative video placeholder.", isPlaceholder: true },
  { $id: "sample-3", title: "A quiet afternoon", prompt: "A community story placeholder.", isPlaceholder: true },
  { $id: "sample-4", title: "Behind the scenes", prompt: "A behind-the-scenes video placeholder.", isPlaceholder: true },
];

function VideoPost({ post }) {
  return (
    <View className="mb-5 rounded-2xl border border-secondary bg-[#0D0D13] p-3">
      <View className="aspect-video items-center justify-center rounded-xl bg-white">
        <Text className="text-sm text-gray-500">Video preview</Text>
      </View>
      <Text className="mt-3 font-semibold text-base text-white">{post.title || "Untitled video"}</Text>
      {post.prompt ? <Text className="mt-1 text-sm text-gray-300" numberOfLines={2}>{post.prompt}</Text> : null}
      {post.isPlaceholder ? <Text className="mt-2 text-xs text-primary">Sample video · preview only</Text> : null}
    </View>
  );
}

export default function Home() {
  const { user } = useGlobalContext();
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const displayName = user?.profile?.username || user?.name || "there";
  const verticalPosts = posts.length ? posts : placeholderPosts;

  const loadPosts = useCallback(async () => {
    const latestPosts = await getAllPosts();
    setPosts(latestPosts);
  }, []);

  useEffect(() => {
    let isCurrent = true;
    getAllPosts()
      .then((latestPosts) => { if (isCurrent) setPosts(latestPosts); })
      .catch((error) => { if (isCurrent) Alert.alert("Could not load videos", error?.message || "Please try again."); })
      .finally(() => { if (isCurrent) setIsLoading(false); });
    return () => { isCurrent = false; };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadPosts();
    } catch (error) {
      Alert.alert("Could not refresh videos", error?.message || "Please try again.");
    } finally {
      setRefreshing(false);
    }
  }, [loadPosts]);

  const filteredPosts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return verticalPosts;
    return verticalPosts.filter((post) => `${post.title || ""} ${post.prompt || ""}`.toLowerCase().includes(query));
  }, [verticalPosts, searchText]);

  const filteredTrendingPosts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) => `${post.title || ""} ${post.prompt || ""}`.toLowerCase().includes(query));
  }, [posts, searchText]);

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
        <SearchInput value={searchText} onChangeText={setSearchText} onSubmit={Keyboard.dismiss} />
      </View>

      <Text className="mb-4 mt-8 font-semibold text-xl text-white">Trending</Text>
      <Trending posts={filteredTrendingPosts} />

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
        renderItem={({ item }) => <VideoPost post={item} />}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={isLoading && posts.length === 0 ? <Text className="py-6 text-center text-sm text-gray-400">Loading videos...</Text> : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFA001" colors={["#FFA001"]} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}
