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
  bg: string;
  brands: string[];
  expandable?: boolean;
}

// Chưa tích hợp cổng thanh toán thật (giống nhận định ở WalletDepositScreen) —
// không có logo thương hiệu thật trong repo nên mô phỏng bằng chip chữ, và
// `payment_method` gửi lên chỉ là placeholder cho tới khi có cổng thật.
export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'card',
    title: 'Thẻ nội địa / Quốc tế',
    desc: 'Visa, MasterCard, JCB',
    icon: CreditCard,
    color: '#0066cc',
    bg: '#EEF7FF',
    brands: ['VISA', 'Mastercard', 'JCB'],
  },
  {
    id: 'ewallet',
    title: 'Ví điện tử',
    desc: 'MoMo, ZaloPay, ShopeePay',
    icon: Wallet,
    color: '#DC2626',
    bg: '#FEE2E2',
    brands: ['MoMo', 'ZaloPay', 'ShopeePay'],
  },
  {
    id: 'bank_transfer',
    title: 'Chuyển khoản ngân hàng',
    desc: 'ATM, Internet Banking',
    icon: Landmark,
    color: '#16A34A',
    bg: '#DCFCE7',
    brands: [],
    expandable: true,
  },
  {
    id: 'vnpay',
    title: 'Thanh toán qua VNPAY',
    desc: 'QR Code, Thẻ ATM',
    icon: Banknote,
    color: '#0284C7',
    bg: '#E0F2FE',
    brands: ['VNPAY QR'],
  },
];
