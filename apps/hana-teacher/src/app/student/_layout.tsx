import { Stack } from 'expo-router';

export default function StudentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="attendance" />
      <Stack.Screen name="students" />
      <Stack.Screen name="student-create" />
      <Stack.Screen name="enrollment" />
      <Stack.Screen name="student-detail" />
      <Stack.Screen name="parent" />
      <Stack.Screen name="parent-detail" />
      <Stack.Screen name="parent-create" />
      <Stack.Screen name="ranking" />
      <Stack.Screen name="evaluation" />
      <Stack.Screen name="evaluation-create" />
    </Stack>
  );
}
