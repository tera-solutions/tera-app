import { Banknote, CreditCard, Landmark, Wallet } from 'lucide-react-native';

// Chưa có API danh mục "Khoản thu" (sys/fee-type hay tương đương) — dùng danh
// sách cục bộ, giống cách WalletWithdrawScreen/WalletDepositScreen đã làm với
// phương thức thanh toán khi chưa có API thật.
export interface FeeType {
  id: string;
  label: string;
}

export const FEE_TYPES: FeeType[] = [
  { id: 'tuition', label: 'Học phí' },
  { id: 'facility', label: 'Phí cơ sở vật chất' },
  { id: 'material', label: 'Phí tài liệu' },
  { id: 'uniform', label: 'Phí đồng phục' },
  { id: 'meal', label: 'Phí ăn uống bán trú' },
  { id: 'other', label: 'Khoản thu khác' },
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
  { id: 'ewallet', label: 'Ví điện tử', icon: Wallet },
];

// Chưa có enum "payer type" thật từ BE — theo yêu cầu, cho phép chọn nhiều vai
// trò khả dĩ (học viên/phụ huynh/trợ giảng) hoặc tự nhập tên khi không khớp.
export interface PayerOption {
  id: string;
  label: string;
}

export const PAYER_OPTIONS: PayerOption[] = [
  { id: 'student', label: 'Học viên' },
  { id: 'parent', label: 'Phụ huynh' },
  { id: 'assistant', label: 'Trợ giảng' },
  { id: 'other', label: 'Khác (tự nhập tên)' },
];

export const MAX_NOTE_LENGTH = 200;
