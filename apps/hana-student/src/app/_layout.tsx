import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import RootApp from '@screens/Root';

const queryClient = new QueryClient();

preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <QueryClientProvider client={queryClient}>
          <RootApp />
          <Toast />
        </QueryClientProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
