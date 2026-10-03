import React from "react";
import { FlatList } from "react-native";

import EmptyState from "./EmptyState";
import VideoCard from "./VideoCard";

export default function Trending({ posts = [], playingPostId, onTogglePlay }) {
  return (
    <FlatList
      horizontal
      data={posts}
      keyExtractor={(post) => post.$id}
      renderItem={({ item }) => (
        <VideoCard
          post={item}
          compact
          playKey={`trending-${item.$id}`}
          isPlaying={playingPostId === `trending-${item.$id}`}
          onTogglePlay={onTogglePlay}
        />
      )}
      ListEmptyComponent={<EmptyState />}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 20 }}
      keyboardShouldPersistTaps="handled"
    />
  );
}
