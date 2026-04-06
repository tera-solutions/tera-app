import { Stack } from 'expo-router';

export default function OperationLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen
        name="setting-general"
        options={{ title: 'Cài đặt chung' }}
      />
      <Stack.Screen
        name="setting-store"
        options={{ title: 'Cấu hình cửa hàng' }}
      />
      <Stack.Screen name="setting-print" options={{ title: 'Cài đặt in ấn' }} />
      <Stack.Screen name="storage-manager" options={{ title: 'Quản lý kho' }} />
      <Stack.Screen
        name="scan-print-bluetooth"
        options={{ title: 'Quét thiết bị Bluetooth' }}
      />
      <Stack.Screen name="notification" options={{ title: 'Thông báo' }} />
      <Stack.Screen name="chat-list" options={{ title: 'Danh sách chat' }} />
      <Stack.Screen name="chat" options={{ title: 'Trò chuyện' }} />
      <Stack.Screen name="news/[id]" options={{ title: 'Chi tiết tin tức' }} />
      <Stack.Screen
        name="data-local/list"
        options={{ title: 'Thông tin dữ liệu cục bộ' }}
      />
      <Stack.Screen
        name="data-local/[id]"
        options={{ title: 'Chi tiết dữ liệu cục bộ' }}
      />
    </Stack>
  );
}
