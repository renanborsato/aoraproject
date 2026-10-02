import React from "react";
import { FlatList, Text, View } from "react-native";

import EmptyState from "./EmptyState";

function TrendingCard({ post }) {
  return (
    <View className="mr-4 w-56 overflow-hidden rounded-2xl border border-secondary bg-[#0D0D13] p-3">
      <View className="aspect-video items-center justify-center rounded-xl bg-white">
        <Text className="text-xs text-gray-500">Video preview</Text>
      </View>
      <Text className="mt-3 font-semibold text-base text-white" numberOfLines={1}>{post.title || "Untitled video"}</Text>
      <Text className="mt-1 text-xs text-gray-400" numberOfLines={1}>Post {post.$id}</Text>
    </View>
  );
}

export default function Trending({ posts = [] }) {
  return (
    <FlatList
      horizontal
      data={posts}
      keyExtractor={(post) => post.$id}
      renderItem={({ item }) => <TrendingCard post={item} />}
      ListEmptyComponent={<EmptyState />}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 20 }}
      keyboardShouldPersistTaps="handled"
    />
  );
}
