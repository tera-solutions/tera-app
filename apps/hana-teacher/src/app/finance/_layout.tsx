import { Stack } from 'expo-router';

export default function FinanceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="cash-flow" options={{ title: 'Dòng tiền' }} />
      <Stack.Screen name="payment-voucher" options={{ title: 'Phiếu chi' }} />
      <Stack.Screen name="receipt-voucher" options={{ title: 'Phiếu thu' }} />
      <Stack.Screen
        name="payment-method"
        options={{ title: 'Phương thức thanh toán' }}
      />
      <Stack.Screen name="fund-account" options={{ title: 'Tài khoản quỹ' }} />
      <Stack.Screen
        name="tax-declaration"
        options={{ title: 'Khai báo thuế' }}
      />
      <Stack.Screen name="e-invoice" options={{ title: 'Hóa đơn điện tử' }} />
    </Stack>
  );
}
