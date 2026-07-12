import { Stack } from 'expo-router';

export default function LessonLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="lesson" />
      <Stack.Screen name="lesson-create" />
      <Stack.Screen name="lesson-update" />
      <Stack.Screen name="lesson-plan-create" />
      <Stack.Screen name="lesson-plan-detail" />
      <Stack.Screen name="assignment" />
      <Stack.Screen name="assignment-create" />
      <Stack.Screen name="assignment-detail" />
      <Stack.Screen name="assignment-grading" />
      <Stack.Screen name="classroom-detail" />
      <Stack.Screen name="exam" />
      <Stack.Screen name="exam-create" />
      <Stack.Screen name="material" />
      <Stack.Screen name="exam-detail" />
      <Stack.Screen name="room" />
      <Stack.Screen name="room-create" />
      <Stack.Screen name="room-detail" />
      <Stack.Screen name="course" />
      <Stack.Screen name="course-create" />
      <Stack.Screen name="course-detail" />
    </Stack>
  );
}
