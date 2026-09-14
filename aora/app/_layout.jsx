import '../global.css';
import { Stack } from 'expo-router';
import { useFonts, Nabla_400Regular } from '@expo-google-fonts/nabla';

const Layout = () => {
  const [fontsLoaded] = useFonts({
    Nabla: Nabla_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return <Stack />;
};

export default Layout;