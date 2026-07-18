import { Stack } from 'expo-router';

export default function SettingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="notification" />
      <Stack.Screen name="more-app" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="profile-update" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="wallet-deposit" />
      <Stack.Screen name="wallet-withdraw" />
      <Stack.Screen name="wallet-history" />
      <Stack.Screen name="bank-account" />
      <Stack.Screen name="bank-account-link" />
      <Stack.Screen name="receipt-create" />
      <Stack.Screen name="receipt-expense" />
      <Stack.Screen name="receipt-tuition-create" />
      <Stack.Screen name="payslip" />
      <Stack.Screen name="timesheet" />
      <Stack.Screen name="subscription" />
      <Stack.Screen name="subscription-checkout" />
      <Stack.Screen name="subscription-payment" />
      <Stack.Screen name="subscription-complete" />
      <Stack.Screen name="subscription-manage" />
      <Stack.Screen name="payment-history" />
      <Stack.Screen name="invoice-receipt" />
      <Stack.Screen name="tuition-management" />
      <Stack.Screen name="tuition-report" />
      <Stack.Screen name="tuition-slip" />
    </Stack>
  );
}
