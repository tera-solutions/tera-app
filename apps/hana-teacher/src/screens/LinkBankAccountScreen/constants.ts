import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react-native';

export interface BankOption {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

// Không có sẵn logo thương hiệu ngân hàng trong repo — dùng badge màu +
// tên viết tắt thay cho logo thật (không tự thêm ảnh logo bên thứ 3).
export const BANK_OPTIONS: BankOption[] = [
  { id: 'vietcombank', name: 'Vietcombank', shortName: 'VCB', color: '#00693C' },
  { id: 'bidv', name: 'BIDV', shortName: 'BIDV', color: '#16A34A' },
  { id: 'techcombank', name: 'Techcombank', shortName: 'TCB', color: '#DC2626' },
  { id: 'mbbank', name: 'MB Bank', shortName: 'MB', color: '#D6006C' },
  { id: 'acb', name: 'ACB', shortName: 'ACB', color: '#0033A0' },
  { id: 'vpbank', name: 'VPBank', shortName: 'VPB', color: '#B3131E' },
  { id: 'tpbank', name: 'TPBank', shortName: 'TPB', color: '#F97316' },
];

export const OTHER_BANK_ID = 'other';

export const FEATURES = [
  { id: 'security', label: 'Bảo mật\n100%', icon: ShieldCheck },
  { id: 'fast', label: 'Nhận tiền\nsiêu tốc', icon: Zap },
  { id: 'free', label: 'Miễn phí\nliên kết', icon: CheckCircle2 },
];

export const OTP_LENGTH = 6;
// Chưa có API gửi/xác thực OTP liên kết ngân hàng — dùng mã demo cố định.
export const DEMO_OTP_CODE = '123456';
