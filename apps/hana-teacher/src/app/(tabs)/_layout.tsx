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
        name="classroom"
        options={{
          title: 'Lớp học',
          tabBarIcon: ({ color }) => (
            <Icon source="school" size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lesson-plan"
        options={{
          title: 'Giáo án',
          tabBarIcon: ({ color }) => (
            <Icon
              source="book-open-page-variant"
              size={ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="teaching-schedule"
        options={{
          title: 'Lịch dạy',
          tabBarIcon: ({ color }) => (
            <Icon source="calendar-clock" size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color }) => (
            <Icon source="account-outline" size={ICON_SIZE} color={color} />
          ),
        }}
      />
    </Tabs>
  );
});

export default TabLayout;
