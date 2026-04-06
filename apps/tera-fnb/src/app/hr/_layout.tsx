import { Stack } from 'expo-router';

export default function HRLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen
        name="employee"
        options={{ title: 'Danh sách nhân viên' }}
      />
      <Stack.Screen
        name="employee/[id]"
        options={{ title: 'Chi tiết nhân viên' }}
      />
      <Stack.Screen
        name="employee/add-edit"
        options={{ title: 'Thêm/Sửa nhân viên' }}
      />
    </Stack>
  );
}
