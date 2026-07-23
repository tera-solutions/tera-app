import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Home } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '@tera/commons/constants/colors';

const ICON_SIZE = 24;

const TabLayout = () => {
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
      {/* Chỉ có 1 tab "Trang chủ" ở giai đoạn khởi tạo dự án — các tab khác
          (Lớp học, Bài tập, Từ vựng, Cá nhân...) sẽ thêm dần theo từng màn hình
          module "Học viên" cụ thể. */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Home size={ICON_SIZE} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
