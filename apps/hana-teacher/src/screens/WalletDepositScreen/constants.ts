import { CreditCard, Wallet } from 'lucide-react-native';

export const QUICK_ADD_AMOUNTS = [100000, 200000, 500000, 1000000];

export const PRESET_AMOUNTS = [100000, 200000, 500000, 1000000, 2000000];

export const PAYMENT_METHODS = [
  {
    id: 'momo',
    name: 'Ví MoMo',
    desc: 'Thanh toán nhanh chóng',
    color: '#D82D8B',
    icon: Wallet,
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    desc: 'An toàn - Bảo mật',
    color: '#0068FF',
    icon: Wallet,
  },
  {
    id: 'atm',
    name: 'Thẻ ATM / Nội địa',
    desc: 'Hỗ trợ thẻ ATM và nội địa',
    color: '#16A34A',
    icon: CreditCard,
  },
  {
    id: 'visa',
    name: 'Thẻ quốc tế',
    desc: 'Visa, Mastercard, JCB...',
    color: '#1E3A8A',
    icon: CreditCard,
  },
];
