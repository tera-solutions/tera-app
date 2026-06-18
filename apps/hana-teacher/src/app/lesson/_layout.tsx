import { Stack } from 'expo-router';

export default function LessonLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen
        name="order-list"
        options={{ title: 'Danh sách đơn hàng' }}
      />
    </Stack>
  );
}
