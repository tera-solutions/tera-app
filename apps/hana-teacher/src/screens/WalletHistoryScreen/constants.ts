import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  Gift,
  LayoutGrid,
  RefreshCcw,
} from 'lucide-react-native';

export interface FilterTab {
  id: string;
  label: string;
  icon: any;
  color: string;
  transactionType?: string;
}

export const FILTER_TABS: FilterTab[] = [
  { id: 'all', label: 'Tất cả', icon: LayoutGrid, color: '#0066cc' },
  {
    id: 'deposit',
    label: 'Nạp tiền',
    icon: ArrowDown,
    color: '#16A34A',
    transactionType: 'deposit',
  },
  {
    id: 'withdraw',
    label: 'Rút tiền',
    icon: ArrowUp,
    color: '#DC2626',
    // Chưa có transaction_type riêng cho "rút tiền" — BE ghi rút tiền dưới dạng
    // adjustment_type=decrease (xem WalletWithdrawScreen), nên lọc theo
    // transaction_type=adjustment rồi lọc thêm amount < 0 ở client.
    transactionType: 'adjustment',
  },
  {
    id: 'payment',
    label: 'Thanh toán',
    icon: CreditCard,
    color: '#9333EA',
    transactionType: 'payment',
  },
  {
    id: 'refund',
    label: 'Hoàn tiền',
    icon: Gift,
    color: '#F97316',
    transactionType: 'refund',
  },
];

export const TX_LABELS: Record<string, string> = {
  deposit: 'Nạp tiền vào ví',
  payment: 'Thanh toán',
  refund: 'Hoàn tiền',
  bonus: 'Thưởng',
  adjustment: 'Điều chỉnh số dư',
  expire: 'Hết hạn số dư',
};

export const TX_META: Record<string, { icon: any; bg: string }> = {
  deposit: { icon: ArrowDown, bg: '#16A34A' },
  payment: { icon: CreditCard, bg: '#9333EA' },
  refund: { icon: Gift, bg: '#F97316' },
  bonus: { icon: Gift, bg: '#F97316' },
  adjustment: { icon: RefreshCcw, bg: '#64748B' },
  expire: { icon: RefreshCcw, bg: '#94A3B8' },
};

export const PER_PAGE = 50;
