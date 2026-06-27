import { Stack } from 'expo-router';

export default function StudentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="attendance" />
      <Stack.Screen name="students" />
      <Stack.Screen name="student-detail" />
      <Stack.Screen name="parent" />
      <Stack.Screen name="parent-detail" />
    </Stack>
  );
}
