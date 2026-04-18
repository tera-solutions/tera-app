import { Stack } from 'expo-router';

export default function SaleLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen
        name="order-list"
        options={{ title: 'Danh sách đơn hàng' }}
      />
      <Stack.Screen
        name="bill-detail"
        options={{ title: 'Chi tiết hóa đơn' }}
      />
      <Stack.Screen name="quick-sale" options={{ title: 'Bán hàng nhanh' }} />
      <Stack.Screen name="search" options={{ title: 'Tìm kiếm' }} />
      <Stack.Screen name="checkout" options={{ title: 'Thanh toán' }} />

      <Stack.Screen name="customer" options={{ title: 'Khách hàng' }} />
      <Stack.Screen
        name="customer/create"
        options={{ title: 'Thêm khách hàng' }}
      />
      <Stack.Screen
        name="customer/[id]"
        options={{ title: 'Chi tiết khách hàng' }}
      />

      <Stack.Screen name="promotion" options={{ title: 'Khuyến mãi' }} />
      <Stack.Screen
        name="promotion/create"
        options={{ title: 'Tạo khuyến mãi' }}
      />
    </Stack>
  );
}
