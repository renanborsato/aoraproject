import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

const Home = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="font-nabla text-6xl text-primary">
        Aora
      </Text>

      <Link href="/profile" asChild>
        <Pressable className="mt-6 rounded-xl bg-primary px-6 py-3">
          <Text className="font-bold text-background">
            Go to Profile
          </Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default Home;