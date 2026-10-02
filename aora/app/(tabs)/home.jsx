import React, { useMemo, useState } from "react";
import { FlatList, Image, Keyboard, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import { images } from "../../constants/images";
import { useGlobalContext } from "../../lib/global-provider";

const latestVideos = [
  { id: "1", title: "Getting started with creative videos" },
  { id: "2", title: "Ideas for your next project" },
  { id: "3", title: "Stories from the community" },
];

function VideoPlaceholder({ item }) {
  return (
    <View className="mb-6 rounded-2xl border border-secondary bg-[#0D0D13] p-3">
      <View className="aspect-video items-center justify-center rounded-xl bg-white">
        <Text className="text-sm text-gray-500">Video preview</Text>
      </View>
      <Text className="mt-3 font-semibold text-base text-white">{item.title}</Text>
      <Text className="mt-1 font-pregular text-xs text-gray-400">Latest video · {item.id}</Text>
    </View>
  );
}

export default function Home() {
  const { user } = useGlobalContext();
  const [searchText, setSearchText] = useState("");
  const displayName = user?.profile?.username || user?.name || "there";
  const filteredVideos = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return latestVideos;
    return latestVideos.filter((video) => video.title.toLowerCase().includes(query));
  }, [searchText]);

  const listHeader = (
    <View className="pb-6">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="font-pregular text-sm text-gray-300">Welcome back,</Text>
          <Text className="mt-1 font-semibold text-3xl text-white" numberOfLines={1}>{displayName}</Text>
        </View>
        <Image source={images.logo} className="h-14 w-14 rounded-xl" resizeMode="cover" accessibilityLabel="Aora logo" />
      </View>

      <View className="mt-7">
        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
          onSubmit={Keyboard.dismiss}
        />
      </View>

      <View className="mt-8 flex-row items-center justify-between">
        <Text className="font-semibold text-xl text-white">Latest Videos</Text>
        <Text className="font-pregular text-sm text-gray-400">Recently added</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#161622" />
      <FlatList
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 }}
        data={filteredVideos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoPlaceholder item={item} />}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={<Text className="py-8 text-center text-sm text-gray-400">No videos match that search.</Text>}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}
