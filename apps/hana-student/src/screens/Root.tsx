import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from 'src/app/navigation/RootNavigator';

import { useStates } from '@hooks/useStates';
import { useGetDevice, useGetProfile } from '@hana/student/services/auth.service';

export default function RootApp() {
  const { authStore } = useStates();

  useGetDevice();
  useGetProfile(!!authStore.token);

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
