import { Stack } from 'expo-router';

export default function HocLieuLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="hoc-lieu-detail" />
      <Stack.Screen name="gio-hang" />
      <Stack.Screen name="don-hang" />
      <Stack.Screen name="quan-ly" />
      <Stack.Screen name="xem" />
    </Stack>
  );
}
