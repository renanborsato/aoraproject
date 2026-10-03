import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";

import { getFileViewUrl } from "../lib/app";
import { getUserProfile } from "../lib/database";

function ActiveVideo({ uri, isPlaying }) {
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = true;
  });

  useEffect(() => {
    if (isPlaying) player.play();
    else player.pause();
  }, [isPlaying, player]);

  return <VideoView player={player} style={{ width: "100%", height: "100%" }} contentFit="cover" nativeControls={false} />;
}

const getStorageUrl = (value) => {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : getFileViewUrl(value);
};

export default function VideoCard({ post, isPlaying, onTogglePlay, playKey = post.$id, compact = false }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [creatorName, setCreatorName] = useState(post.creatorName || "Aora creator");
  const videoUri = getStorageUrl(post.video);
  const thumbnailUri = getStorageUrl(post.thumbnail);

  useEffect(() => {
    let isCurrent = true;
    if (post.creator) {
      getUserProfile(post.creator)
        .then((profile) => { if (isCurrent) setCreatorName(profile.username || "Aora creator"); })
        .catch(() => {});
    }
    return () => { isCurrent = false; };
  }, [post.creator]);

  useEffect(() => {
    if (isPlaying) setHasStarted(true);
  }, [isPlaying]);

  const handleToggle = () => {
    if (videoUri) setHasStarted(true);
    onTogglePlay(playKey);
  };

  return (
    <View className={`overflow-hidden rounded-2xl border border-secondary bg-[#0D0D13] p-3 ${compact ? "mr-4 w-64" : "mb-5 w-full"}`}>
      <View className="aspect-video overflow-hidden rounded-xl bg-white">
        {thumbnailUri && !hasStarted ? <Image source={{ uri: thumbnailUri }} className="absolute h-full w-full" resizeMode="cover" /> : null}
        {videoUri && hasStarted ? <ActiveVideo uri={videoUri} isPlaying={isPlaying} /> : null}
        {!videoUri || !hasStarted ? (
          <View className="absolute inset-0 items-center justify-center">
            {!thumbnailUri ? <Text className="text-xs text-gray-500">Video preview</Text> : null}
            <TouchableOpacity
              className="h-14 w-14 items-center justify-center rounded-full bg-blue-500"
              onPress={handleToggle}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? "Pause video" : "Play video"}
            >
              <Ionicons name={isPlaying ? "pause" : "play"} size={26} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity className="absolute inset-0 items-center justify-center" onPress={handleToggle} accessibilityRole="button" accessibilityLabel={isPlaying ? "Pause video" : "Play video"}>
            <View className="h-14 w-14 items-center justify-center rounded-full bg-black/60">
              <Ionicons name={isPlaying ? "pause" : "play"} size={26} color="white" />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <Text className="mt-3 font-semibold text-base text-white" numberOfLines={1}>{post.title || "Untitled video"}</Text>
      <Text className="mt-1 text-xs text-gray-400" numberOfLines={1}>{creatorName}</Text>
      {post.prompt ? <Text className="mt-2 text-sm text-gray-300" numberOfLines={2}>{post.prompt}</Text> : null}
    </View>
  );
}
