import { Stack, useRouter, useSegments } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native'; // Thêm để làm loading indicator cơ bản

import { SocketProvider } from '@provider/SocketProvider';
import { useStates } from '@hooks/useStates';

const RootNavigator = observer(() => {
  const { authStore } = useStates();
  const { authenticated, user, isHydrated } = authStore; 
  
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated === false) return; 

    const inAuthGroup = segments?.[0] === 'auth';

    if (!authenticated) {
      if (!inAuthGroup) {
        console.log('Redirecting to Login...');
        setTimeout(() => {
          router.replace('/auth/login');
        }, 0);
      }
    } else if (authenticated && inAuthGroup) {
      setTimeout(() => {
        router.replace('/');
      }, 0);
    }
  }, [authenticated, segments, isHydrated]);

  if (isHydrated === false) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 3. Render một cấu trúc Stack thống nhất, tránh việc thay đổi cấu trúc cây component (re-mount Stack)
  return (
    <SocketProvider businessId={user?.business_id} userId={user?.id}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SocketProvider>
  );
});

export default RootNavigator;