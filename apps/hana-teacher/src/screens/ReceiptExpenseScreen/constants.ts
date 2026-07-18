import {
  Banknote,
  CreditCard,
  GraduationCap,
  Landmark,
  Megaphone,
  MoreHorizontal,
  Package,
  PartyPopper,
  Plug,
  LayoutGrid,
  Wallet,
} from 'lucide-react-native';

// Chưa có API danh mục chi ("fin/expense-category" hay tương đương) — dùng
// danh sách cục bộ, cùng cách tiếp cận với FEE_TYPES ở ReceiptCreateScreen.
export interface ExpenseCategory {
  id: string;
  label: string;
  icon: any;
  color: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'salary', label: 'Lương & Thưởng', icon: Wallet, color: '#0066cc' },
  { id: 'office_supplies', label: 'Văn phòng phẩm', icon: Package, color: '#16A34A' },
  { id: 'facility', label: 'Cơ sở vật chất', icon: LayoutGrid, color: '#F97316' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, color: '#EC4899' },
  { id: 'utilities', label: 'Điện, nước, internet', icon: Plug, color: '#8B5CF6' },
  { id: 'training', label: 'Đào tạo', icon: GraduationCap, color: '#0D9488' },
  { id: 'event', label: 'Sự kiện / Hoạt động', icon: PartyPopper, color: '#EF4444' },
  { id: 'other', label: 'Khác', icon: MoreHorizontal, color: '#64748B' },
];

// Chưa có API lý do chi cố định — gợi ý nhanh, vẫn cho tự nhập tự do.
export const EXPENSE_REASON_SUGGESTIONS: string[] = [
  'Chi lương nhân viên tháng',
  'Mua văn phòng phẩm',
  'Chi phí cơ sở vật chất',
  'Chi phí marketing, quảng cáo',
  'Chi phí điện, nước, internet',
  'Chi phí đào tạo',
  'Chi phí sự kiện, hoạt động',
];

export interface PaymentMethodOption {
  id: string;
  label: string;
  icon: any;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: 'cash', label: 'Tiền mặt', icon: Banknote },
  { id: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: Landmark },
  { id: 'card', label: 'Quẹt thẻ POS', icon: CreditCard },
];

export const MAX_NOTE_LENGTH = 200;
