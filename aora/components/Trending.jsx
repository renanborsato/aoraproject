import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, View, useWindowDimensions } from "react-native";

import EmptyState from "./EmptyState";
import VideoCard from "./VideoCard";

export default function Trending({ posts = [], playingPostId, onTogglePlay, onPlaybackEnd, onActiveChange, showEmptyState = false }) {
  const { width } = useWindowDimensions();
  const viewportWidth = Math.max(width - 40, 240);
  const cardWidth = Math.min(viewportWidth - 40, 320);
  const sidePadding = (viewportWidth - cardWidth) / 2;
  const snapInterval = cardWidth + 16;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const handleScroll = useCallback((event) => {
    const nextIndex = Math.max(0, Math.min(posts.length - 1, Math.round(event.nativeEvent.contentOffset.x / snapInterval)));
    if (activeIndexRef.current === nextIndex) return;
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
    const activePost = posts[nextIndex];
    onActiveChange?.(activePost ? `trending-${activePost.$id}` : null);
  }, [onActiveChange, posts, snapInterval]);

  useEffect(() => {
    const nextIndex = Math.max(0, Math.min(activeIndexRef.current, posts.length - 1));
    if (activeIndexRef.current !== nextIndex) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      onActiveChange?.(posts[nextIndex] ? `trending-${posts[nextIndex].$id}` : null);
    }
  }, [onActiveChange, posts]);

  return (
    <View className="h-80 justify-center">
      <FlatList
        horizontal
        data={posts}
        keyExtractor={(post) => post.$id}
        renderItem={({ item, index }) => (
          <VideoCard
            post={item}
            compact
            cardWidth={cardWidth}
            isActive={activeIndex === index}
            playKey={`trending-${item.$id}`}
            isPlaying={playingPostId === `trending-${item.$id}`}
            onTogglePlay={onTogglePlay}
            onPlaybackEnd={onPlaybackEnd}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        ListFooterComponent={showEmptyState ? <EmptyState /> : null}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: sidePadding, paddingVertical: 24 }}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
