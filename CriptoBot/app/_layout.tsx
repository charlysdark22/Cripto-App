import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useBotStore } from '../src/context/botStore';
import { RootNavigator } from '../src/navigation/RootNavigator';
import { useEffect } from 'react';

export default function RootLayout() {
  const loadFromStorage = useBotStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
