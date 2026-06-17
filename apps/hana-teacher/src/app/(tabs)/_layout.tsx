import { Tabs } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Platform } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Imports từ project của anh
import { useStates } from '@hooks/useStates';
import colors from '@tera/commons/constants/colors';

const ICON_SIZE = 24;

const TabLayout = observer(() => {
  const {
    generalStore: { isOffline },
  } = useStates();

  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: Platform.OS === 'android' ? 90 : 70,
          paddingBottom: insets.bottom,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => (
            <Icon source="home-outline" size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lesson"
        options={{
          title: 'Bài học',
          tabBarIcon: ({ color }) => (
            <Icon source="book-open-variant" size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="homework"
        options={{
          title: 'Luyện tập',
          tabBarIcon: ({ color }) => (
            <Icon source="pencil-outline" size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: 'Thành tích',
          tabBarIcon: ({ color }) => (
            <Icon source="trophy-outline" size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Cá nhân',
          href: (isOffline ? undefined : '/more') as any,
          tabBarIcon: ({ color }) => (
            <Icon source="account-outline" size={ICON_SIZE} color={color} />
          ),
        }}
      />
    </Tabs>
  );
});

export default TabLayout;
