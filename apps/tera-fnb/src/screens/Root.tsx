import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Imports từ dự án của anh
import RootNavigator from 'src/app/navigation/RootNavigator';

export default function RootApp() {
  // 1. Giữ lại các hook logic toàn cục
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
