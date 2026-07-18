import { Banknote, CreditCard, Landmark, Wallet } from 'lucide-react-native';

// Chưa có API danh mục "Khoản thu" (sys/fee-type hay tương đương) — dùng danh
// sách cục bộ, giống ReceiptCreateScreen đã làm khi chưa có API thật.
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

// Không có API "mẫu phiếu thu" — đây thuần là lựa chọn trang trí hiển thị cục
// bộ (đổi màu/emoji đại diện học sinh), không ảnh hưởng dữ liệu lưu.
export type ReceiptTemplate = 'girl' | 'boy';

export const RECEIPT_TEMPLATES: {
  id: ReceiptTemplate;
  label: string;
  color: string;
  bg: string;
}[] = [
  { id: 'girl', label: 'Mẫu bé gái', color: '#DB2777', bg: '#FCE7F3' },
  { id: 'boy', label: 'Mẫu bé trai', color: '#2563EB', bg: '#DBEAFE' },
];

export const MAX_NOTE_LENGTH = 200;
