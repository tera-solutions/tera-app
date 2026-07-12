import { Stack } from 'expo-router';

export default function SettingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="notification" />
      <Stack.Screen name="more-app" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="profile-update" />
    </Stack>
  );
}
