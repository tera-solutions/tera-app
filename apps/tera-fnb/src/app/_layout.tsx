import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { registerTranslation } from 'react-native-paper-dates';
import Toast from 'react-native-toast-message';

import { viLocale } from '@common/constants/common';
import { DatabaseProvider } from '@common/provider/DatabaseProvider';
import { Splash } from '@components/ui/Splash';
import RootApp from '@screens/Root';

const queryClient = new QueryClient();

if (__DEV__ && Platform.OS != 'web') {
  import('../../ReactotronConfig').then(() =>
    console.log('Reactotron Configured'),
  );
}

console.log('📦 Available Modules:', Object.keys(NativeModules));

if (!NativeModules.DatabaseSizeModule) {
  console.warn('⚠️ DatabaseSizeModule chưa được link thành công!');
}

if (Platform.OS === 'web') {
  console.tron = console.log;
}

// Giữ nguyên các cấu hình khởi tạo
preventAutoHideAsync();
registerTranslation('vi', viLocale as any);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    MaterialDesignIcons: require('../assets/fonts/MaterialCommunityIcons.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Italic': require('../assets/fonts/Roboto-Italic.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto-Thin': require('../assets/fonts/Roboto-Thin.ttf'),
    'Roboto-ExtraBold': require('../assets/fonts/Roboto-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <Splash isLoading={true} />;
  }

  console.log('Render app expo');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <QueryClientProvider client={queryClient}>
          <DatabaseProvider>
            <RootApp />
          </DatabaseProvider>
          <Toast />
        </QueryClientProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
