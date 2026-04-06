import { Stack, useRouter, useSegments } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import { SocketProvider } from '@common/provider/SocketProvider';
import { useStores } from '@hooks/useStores';
import { syncManager } from '@services/sync/SyncManager';

const RootNavigator = observer(() => {
  const {
    authStore: { authenticated, user },
  } = useStores();
  const segments: any = useSegments();
  const router = useRouter();

  // useCheckConnect(0);
  // useGetBusiness(5000);

  useEffect(() => {
    syncManager.addQueue({
      table_name: 'generals',
      type: 'realtime',
      action: 'GET',
    });
  }, []);

  useEffect(() => {
    const inAuthGroup = segments?.[0] === 'auth';

    if (!authenticated) {
      if (!inAuthGroup) {
        console.log('Redirecting to Login...');
        router.replace('/auth/login');
      }
    } else if (authenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [authenticated, segments]);

  if (!authenticated) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  return (
    <SocketProvider businessId={user?.business_id} userId={user?.id}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SocketProvider>
  );
});

export default RootNavigator;
