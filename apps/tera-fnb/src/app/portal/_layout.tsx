import { Stack } from 'expo-router';

export default function PortalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="profile" options={{ title: 'Hồ sơ cá nhân' }} />
      <Stack.Screen name="change-password" options={{ title: 'Đổi mật khẩu' }} />
      <Stack.Screen name="update-profile" options={{ title: 'Cập nhật hồ sơ' }} />
      <Stack.Screen name="shop-info" options={{ title: 'Thông tin cửa hàng' }} />
      <Stack.Screen name="business-location/index" options={{ title: 'Danh sách chi nhánh' }} />
      <Stack.Screen name="business-location/[id]" options={{ title: 'Chi tiết chi nhánh' }} />
      <Stack.Screen name="business-location/create" options={{ title: 'Thêm mới chi nhánh' }} />
    </Stack>
  );
}