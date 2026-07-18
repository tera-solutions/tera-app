import { Banknote, CreditCard, Landmark, Wallet } from 'lucide-react-native';

export const STEPS = [
  { id: 1, label: 'Chọn gói' },
  { id: 2, label: 'Thanh toán' },
  { id: 3, label: 'Hoàn tất' },
];

export interface PaymentMethodOption {
  id: string;
  title: string;
  desc: string;
  icon: any;
  color: string;
}

// Chưa tích hợp cổng thanh toán thật (giống nhận định ở WalletDepositScreen) —
// value gửi lên `payment_method` chỉ là placeholder cho tới khi có cổng thật.
export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'card',
    title: 'Thẻ nội địa/Quốc tế',
    desc: 'Visa, MasterCard, JCB',
    icon: CreditCard,
    color: '#0066cc',
  },
  {
    id: 'ewallet',
    title: 'Ví điện tử',
    desc: 'MoMo, ZaloPay, ShopeePay',
    icon: Wallet,
    color: '#DC2626',
  },
  {
    id: 'bank_transfer',
    title: 'Chuyển khoản ngân hàng',
    desc: 'ATM, Internet Banking',
    icon: Landmark,
    color: '#16A34A',
  },
  {
    id: 'vnpay',
    title: 'Thanh toán qua VNPAY',
    desc: 'QR Code, Thẻ ATM',
    icon: Banknote,
    color: '#0284C7',
  },
];
