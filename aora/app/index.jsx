import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="font-nabla text-6xl text-primary">Aora</Text>

      <Pressable
        className="mt-6 rounded-xl bg-primary px-6 py-3"
        onPress={() => router.replace("/home")}
      >
        <Text className="font-bold text-background">Continue</Text>
      </Pressable>
    </View>
  );
};

export default Home;
