import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { observer } from 'mobx-react-lite';

import { useStates } from '@hooks/useStates';

const RootNavigator = observer(() => {
  const { authStore } = useStates();
  const { authenticated, isHydrated } = authStore;

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated === false) return;

    const inAuthGroup = segments?.[0] === 'auth';

    if (!authenticated) {
      if (!inAuthGroup) {
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
        <ActivityIndicator size="large" color="#0f9bdb" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
});

export default RootNavigator;
