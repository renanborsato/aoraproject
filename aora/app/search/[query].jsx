import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Keyboard, StatusBar, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import VideoCard from "../../components/VideoCard";
import { searchPosts } from "../../lib/database";

const getQueryValue = (value) => (Array.isArray(value) ? value[0] : value) || "";

export default function Search() {
  const params = useLocalSearchParams();
  const routeQuery = getQueryValue(params.query);
  const [searchText, setSearchText] = useState(routeQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(routeQuery.trim());
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingPostId, setPlayingPostId] = useState(null);

  useEffect(() => {
    setSearchText(routeQuery);
    setDebouncedQuery(routeQuery.trim());
  }, [routeQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedQuery(searchText.trim()), 300);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  useEffect(() => {
    let isCurrentRequest = true;

    if (debouncedQuery.length < 3) {
      setPosts([]);
      setError(null);
      setIsLoading(false);
      return () => { isCurrentRequest = false; };
    }

    setIsLoading(true);
    setError(null);
    searchPosts(debouncedQuery)
      .then((results) => {
        if (isCurrentRequest) setPosts(results);
      })
      .catch((searchError) => {
        if (isCurrentRequest) {
          setPosts([]);
          setError(searchError);
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => { isCurrentRequest = false; };
  }, [debouncedQuery]);

  useEffect(() => {
    if (error) Alert.alert("Could not search videos", error.message || "Please try again.");
  }, [error]);

  const toggleVideo = useCallback((postId) => {
    setPlayingPostId((currentId) => currentId === postId ? null : postId);
  }, []);

  const stopVideo = useCallback((postId) => {
    setPlayingPostId((currentId) => currentId === postId ? null : currentId);
  }, []);

  const submitSearch = useCallback(() => {
    if (!searchText.trim()) {
      Alert.alert("Search videos", "Enter a topic to search for.");
      return;
    }
    Keyboard.dismiss();
    setDebouncedQuery(searchText.trim());
  }, [searchText]);

  const emptyMessage = debouncedQuery.length < 3
    ? "Enter at least 3 characters to search videos."
    : isLoading
      ? "Searching videos..."
      : `No videos found for “${searchText.trim()}”.`;

  const listHeader = (
    <View className="pb-5">
      <Text className="mb-3 font-semibold text-xl text-white">
        Search results for “{searchText.trim()}”
      </Text>
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        onSubmit={submitSearch}
        placeholder="Search video titles"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#161622" />
      <FlatList
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32, flexGrow: 1 }}
        data={posts}
        keyExtractor={(post) => post.$id}
        renderItem={({ item }) => (
          <VideoCard
            post={item}
            playKey={`search-${item.$id}`}
            isPlaying={playingPostId === `search-${item.$id}`}
            onTogglePlay={toggleVideo}
            onPlaybackEnd={stopVideo}
          />
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={<Text className="py-8 text-center text-sm text-gray-400">{emptyMessage}</Text>}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
