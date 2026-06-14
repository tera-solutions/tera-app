import { useStates } from '@hooks/useStates';
import { AuthApi } from '@tera/api/auth';
import { useQueryLegacy } from '@tera/commons/hooks/useQueryLegacy';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Imports từ dự án của anh
import RootNavigator from 'src/app/navigation/RootNavigator';

export default function RootApp() {
  const { generalStore, authStore } = useStates();

  useQueryLegacy({
    queryKey: ['get_device'],
    queryFn: AuthApi.getDeviceCode,
    staleTime: 300000,
    onSuccess: (data) => {
      generalStore.setInitData(data);
    },
  });

  useQueryLegacy({
    queryKey: ['get_profile'],
    queryFn: AuthApi.getProfile,
    staleTime: 300000,
    enabled: !!authStore.token,
    onSuccess: (res) => {
      authStore.updateUser({ user: res?.data });
    },
  });

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
