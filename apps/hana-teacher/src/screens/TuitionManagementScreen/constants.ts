import { BarChart3, FileText, ListChecks, LucideIcon, TrendingUp } from 'lucide-react-native';

// Chưa có API học phí/công nợ học sinh thật ở BE (InvoiceAPI, DebtAPI trong
// services/api/src/finance chỉ là scaffold CRUD, chưa có comment xác nhận
// field với Postman, và chưa có route tổng hợp "thu học phí theo lớp/học
// viên"). Toàn bộ số liệu học phí, trạng thái thu, ngày thu/hạn thu bên dưới
// là dữ liệu MẪU cố định (giống cách PayslipScreen dùng SEED_PAYSLIP), chỉ để
// dựng đúng giao diện — KHÔNG đại diện cho học sinh/lớp học thật.
export type TuitionStatus = 'paid' | 'pending' | 'overdue';

export const STATUS_LABELS: Record<TuitionStatus, string> = {
  paid: 'Đã thu',
  pending: 'Chưa thu',
  overdue: 'Quá hạn',
};

export const STATUS_META: Record<TuitionStatus, { color: string; bg: string }> = {
  paid: { color: '#16A34A', bg: '#DCFCE7' },
  pending: { color: '#2563EB', bg: '#DBEAFE' },
  overdue: { color: '#DC2626', bg: '#FEE2E2' },
};

export interface SeedStudent {
  id: string;
  name: string;
  classId: string;
  className: string;
  parentCode: string;
  amount: number;
  status: TuitionStatus;
  date: string; // paid: ngày thu | pending/overdue: hạn thanh toán
}

export interface SeedClassMeta {
  id: string;
  name: string;
  color: string;
}

export const CLASS_META: SeedClassMeta[] = [
  { id: 'c1', name: 'Starters 2A', color: '#2563EB' },
  { id: 'c2', name: 'Movers 1B', color: '#16A34A' },
  { id: 'c3', name: 'Flyers 3A', color: '#F97316' },
  { id: 'c4', name: 'KET 1A', color: '#8B5CF6' },
];

export const SEED_STUDENTS: SeedStudent[] = [
  { id: 's1', name: 'Nguyễn Bảo An', classId: 'c1', className: 'Starters 2A', parentCode: 'PH2505012', amount: 1800000, status: 'pending', date: '2026-07-25' },
  { id: 's2', name: 'Trần Minh Khang', classId: 'c2', className: 'Movers 1B', parentCode: 'PH2505013', amount: 2000000, status: 'paid', date: '2026-07-08' },
  { id: 's3', name: 'Lê Khánh Vy', classId: 'c3', className: 'Flyers 3A', parentCode: 'PH2505014', amount: 1500000, status: 'overdue', date: '2026-07-05' },
  { id: 's4', name: 'Phạm Gia Huy', classId: 'c1', className: 'Starters 2A', parentCode: 'PH2505015', amount: 1800000, status: 'pending', date: '2026-07-25' },
  { id: 's5', name: 'Hoàng Ngọc Mai', classId: 'c4', className: 'KET 1A', parentCode: 'PH2505016', amount: 2200000, status: 'paid', date: '2026-07-10' },
  { id: 's6', name: 'Đỗ Anh Tuấn', classId: 'c2', className: 'Movers 1B', parentCode: 'PH2505017', amount: 2000000, status: 'paid', date: '2026-07-06' },
  { id: 's7', name: 'Vũ Thảo Linh', classId: 'c1', className: 'Starters 2A', parentCode: 'PH2505018', amount: 1800000, status: 'overdue', date: '2026-07-02' },
  { id: 's8', name: 'Bùi Quốc Việt', classId: 'c3', className: 'Flyers 3A', parentCode: 'PH2505019', amount: 1500000, status: 'paid', date: '2026-07-12' },
  { id: 's9', name: 'Ngô Thị Hà My', classId: 'c4', className: 'KET 1A', parentCode: 'PH2505020', amount: 2200000, status: 'pending', date: '2026-07-28' },
  { id: 's10', name: 'Đặng Minh Quân', classId: 'c2', className: 'Movers 1B', parentCode: 'PH2505021', amount: 2000000, status: 'paid', date: '2026-07-09' },
  { id: 's11', name: 'Lý Gia Bảo', classId: 'c3', className: 'Flyers 3A', parentCode: 'PH2505022', amount: 1500000, status: 'pending', date: '2026-07-26' },
  { id: 's12', name: 'Phan Thu Trang', classId: 'c4', className: 'KET 1A', parentCode: 'PH2505023', amount: 2200000, status: 'paid', date: '2026-07-11' },
];

// Không có dữ liệu tháng trước thật để so sánh — số % tăng trưởng chỉ mang
// tính minh hoạ, không tính toán từ đâu cả.
export const SEED_GROWTH_PERCENT = 8.5;

export interface StatusTab {
  id: 'all' | TuitionStatus;
  label: string;
}

export const STATUS_TABS: StatusTab[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chưa thu' },
  { id: 'paid', label: 'Đã thu' },
  { id: 'overdue', label: 'Quá hạn' },
];

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'receipt', label: 'Tạo phiếu thu', icon: FileText },
  { id: 'collect', label: 'Thu học phí', icon: TrendingUp },
  { id: 'invoice', label: 'Phiếu học phí', icon: ListChecks },
  { id: 'report', label: 'Báo cáo', icon: BarChart3 },
];
