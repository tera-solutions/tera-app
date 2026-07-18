import {
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Landmark,
  LucideIcon,
  RotateCcw,
  Wallet,
  XCircle,
} from 'lucide-react-native';

// Chưa có API báo cáo/doanh thu học phí thật ở BE (reporting/revenue-report,
// reporting/class-utilization-report trong services/api chỉ là scaffold CRUD,
// không có usage thật ở web lẫn app, không có comment xác nhận field với
// Postman). Toàn bộ số liệu bên dưới là dữ liệu MẪU cố định, giống cách
// PayslipScreen/TuitionManagementScreen đã làm khi chưa có API thật — chỉ để
// dựng đúng giao diện, KHÔNG đại diện cho số liệu tài chính thật của trường.
export interface TrendPoint {
  label: string;
  collected: number;
  outstanding: number;
}

// 5 tháng gần nhất, tháng cuối là tháng hiện tại — số liệu tháng cuối khớp với
// overview/lớp học/hình thức thanh toán bên dưới (đều cộng ra 12.450.000đ),
// các tháng trước chỉ dựng minh hoạ xu hướng tăng dần.
export const TREND_SEED: { collected: number; outstanding: number }[] = [
  { collected: 3200000, outstanding: 1400000 },
  { collected: 6800000, outstanding: 1650000 },
  { collected: 9100000, outstanding: 1900000 },
  { collected: 8950000, outstanding: 2050000 },
  { collected: 10250000, outstanding: 2200000 },
];

export interface OverviewStat {
  id: string;
  label: string;
  value: number;
  growthPercent: number;
  icon: LucideIcon;
  color: string;
}

// % tăng trưởng chỉ mang tính minh hoạ (không có dữ liệu kỳ trước thật để so
// sánh).
export const OVERVIEW_GROWTH: Record<string, number> = {
  total: 8.5,
  collected: 6.3,
  outstanding: -4.2,
  rate: 5.1,
};

export interface StatusBucket {
  id: 'paid' | 'pending' | 'overdue' | 'refunded';
  label: string;
  amount: number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

// "Đã hoàn" là dòng tiền hoàn trả riêng, KHÔNG cộng vào tổng phải thu (Đã thu
// + Chưa đến hạn + Quá hạn = đúng bằng Tổng thu trong kỳ).
export const STATUS_BUCKETS: StatusBucket[] = [
  { id: 'paid', label: 'Đã thu', amount: 10250000, icon: CheckCircle2, color: '#16A34A', bg: '#DCFCE7' },
  { id: 'pending', label: 'Chưa đến hạn', amount: 1850000, icon: Clock, color: '#D97706', bg: '#FEF3C7' },
  { id: 'overdue', label: 'Quá hạn', amount: 350000, icon: XCircle, color: '#DC2626', bg: '#FEE2E2' },
  { id: 'refunded', label: 'Đã hoàn', amount: 150000, icon: RotateCcw, color: '#2563EB', bg: '#DBEAFE' },
];

export interface ClassReportRow {
  id: string;
  name: string;
  color: string;
  studentCount: number;
  totalFee: number;
  collected: number;
  outstanding: number;
}

export const CLASS_REPORT_ROWS: ClassReportRow[] = [
  { id: 'k1a', name: 'Kids 1A', color: '#2563EB', studentCount: 25, totalFee: 5250000, collected: 4300000, outstanding: 950000 },
  { id: 'k1b', name: 'Kids 1B', color: '#DB2777', studentCount: 23, totalFee: 4600000, collected: 3700000, outstanding: 900000 },
  { id: 'pre', name: 'Pre-Starters', color: '#8B5CF6', studentCount: 18, totalFee: 2600000, collected: 2250000, outstanding: 350000 },
];

export interface PaymentMethodRow {
  id: string;
  label: string;
  amount: number;
  icon: LucideIcon;
  color: string;
}

export const PAYMENT_METHOD_ROWS: PaymentMethodRow[] = [
  { id: 'bank_transfer', label: 'Chuyển khoản', amount: 7250000, icon: Landmark, color: '#2563EB' },
  { id: 'cash', label: 'Tiền mặt', amount: 3000000, icon: Banknote, color: '#16A34A' },
  { id: 'ewallet', label: 'Ví điện tử', amount: 1850000, icon: Wallet, color: '#8B5CF6' },
  { id: 'other', label: 'Khác', amount: 350000, icon: CreditCard, color: '#F97316' },
];

export const COLOR_COLLECTED = '#2563EB';
export const COLOR_OUTSTANDING = '#93C5FD';

export interface ClassFilterOption {
  id: string;
  name: string;
}

export const CLASS_FILTER_OPTIONS: ClassFilterOption[] = [
  { id: 'all', name: 'Tất cả lớp học' },
  ...CLASS_REPORT_ROWS.map((c) => ({ id: c.id, name: c.name })),
];
