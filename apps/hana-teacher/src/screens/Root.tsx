import { useStates } from '@hooks/useStates';
import { AuthApi } from '@tera/api/auth';
import { useQueryLegacy } from '@tera/commons/hooks/useQueryLegacy';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Imports từ dự án của anh
import RootNavigator from 'src/app/navigation/RootNavigator';

export default function RootApp() {
  const { generalStore } = useStates();

  useQueryLegacy({
    queryKey: ['get_device'],
    queryFn: AuthApi.getDeviceCode,
    staleTime: 300000,
    onSuccess: (data) => {
      generalStore.setInitData(data);
    },
  });

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
