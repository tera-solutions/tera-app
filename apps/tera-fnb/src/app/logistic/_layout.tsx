import { Stack } from 'expo-router';

export default function LogisticLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen 
        name="create-shipping-note" 
        options={{ title: 'Tạo phiếu vận chuyển' }} 
      />
    </Stack>
  );
}