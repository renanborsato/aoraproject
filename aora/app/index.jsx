import { View, Text } from 'react-native';
import { Link } from 'expo-router';

const Home = () => {
  return (
    <View>
      <Text>Aora</Text>

      <Link href="/profile">
        Go to Profile
      </Link>
    </View>
  );
};

export default Home;