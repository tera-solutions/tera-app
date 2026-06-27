import { Stack } from 'expo-router';

export default function LessonLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="lesson" />
      <Stack.Screen name="assignment" />
      <Stack.Screen name="assignment-grading" />
      <Stack.Screen name="classroom-detail" />
      <Stack.Screen name="exam" />
      <Stack.Screen name="exam-detail" />
      <Stack.Screen name="room" />
    </Stack>
  );
}
