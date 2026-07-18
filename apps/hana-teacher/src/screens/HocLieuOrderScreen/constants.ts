import {
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  Truck,
  Wallet,
  LucideIcon,
} from 'lucide-react-native';

import { ProductCategory } from '@screens/HocLieuScreen/constants';

// Chưa có API đơn hàng thật cho "Học liệu" (đã xác nhận ở phiên trước: không
// có product/shop/cart/order nào trong services/api hay services/modules) —
// toàn bộ đơn hàng, khách hàng, số liệu thống kê dưới đây là dữ liệu MẪU cố
// định, chỉ để dựng đúng giao diện. Các nút Xác nhận/Huỷ/Đóng gói chỉ đổi
// trạng thái ở client (mô phỏng), KHÔNG gọi API thật.
export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export const STATUS_META: Record<OrderStatus, { color: string; bg: string }> = {
  pending: { color: '#D97706', bg: '#FEF3C7' },
  processing: { color: '#16A34A', bg: '#DCFCE7' },
  shipping: { color: '#7C3AED', bg: '#F3E8FF' },
  completed: { color: '#0D9488', bg: '#CCFBF1' },
  cancelled: { color: '#DC2626', bg: '#FEE2E2' },
};

export interface StatTile {
  id: 'all' | OrderStatus;
  label: string;
  icon: LucideIcon;
  color: string;
}

// Số liệu minh hoạ (tổng toàn hệ thống), KHÔNG nhất thiết khớp 1-1 với số
// lượng đơn hàng mẫu cụ thể trong SEED_ORDERS bên dưới (giống app thật: thẻ
// thống kê phản ánh toàn bộ dữ liệu, còn danh sách chỉ hiển thị một số đơn).
export const STAT_TILES: (StatTile & { value: number })[] = [
  { id: 'all', label: 'Tất cả đơn', value: 128, icon: ClipboardList, color: '#2563EB' },
  { id: 'pending', label: 'Chờ xác nhận', value: 18, icon: Wallet, color: '#F97316' },
  { id: 'processing', label: 'Đang xử lý', value: 35, icon: PackageCheck, color: '#16A34A' },
  { id: 'shipping', label: 'Đang giao', value: 52, icon: Truck, color: '#7C3AED' },
  { id: 'completed', label: 'Hoàn thành', value: 23, icon: CheckCircle2, color: '#0D9488' },
];

export const FILTER_TABS: { id: 'all' | OrderStatus; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ xác nhận' },
  { id: 'processing', label: 'Đang xử lý' },
  { id: 'shipping', label: 'Đang giao' },
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'cancelled', label: 'Đã hủy' },
];

export interface OrderItem {
  name: string;
  subtitle: string;
  category: ProductCategory;
  qty: number;
  unitPrice: number;
}

export interface TrackingStep {
  label: string;
  time: string | null;
  done: boolean;
}

export interface SeedOrder {
  id: string;
  code: string;
  status: OrderStatus;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: 'cod' | 'bank_transfer';
  items: OrderItem[];
  trackingSteps?: TrackingStep[];
}

export const SEED_ORDERS: SeedOrder[] = [
  {
    id: 'o1',
    code: '#HD260716001',
    status: 'pending',
    createdAt: '2026-07-16T10:30:00',
    customerName: 'Nguyễn Thị Mai',
    customerPhone: '0901 234 567',
    customerAddress: 'Quận 12, TP. Hồ Chí Minh',
    paymentMethod: 'cod',
    items: [
      { name: 'Smart Kids 1 - Student Book', subtitle: 'Student Book', category: 'book', qty: 1, unitPrice: 180000 },
      { name: 'Picture Flashcards - At School', subtitle: 'Flashcards', category: 'flashcard', qty: 1, unitPrice: 120000 },
      { name: 'Poster - Classroom Rules', subtitle: 'Poster', category: 'poster', qty: 1, unitPrice: 50000 },
    ],
  },
  {
    id: 'o2',
    code: '#HD260716002',
    status: 'processing',
    createdAt: '2026-07-16T09:15:00',
    customerName: 'Trần Văn Nam',
    customerPhone: '0933 456 789',
    customerAddress: 'Quận Gò Vấp, TP. Hồ Chí Minh',
    paymentMethod: 'bank_transfer',
    items: [
      { name: 'Grammar Practice Workbook 1', subtitle: 'Workbook', category: 'worksheet', qty: 1, unitPrice: 160000 },
      { name: 'Bài tập - Worksheet Grade 1', subtitle: 'Grade 1', category: 'worksheet', qty: 1, unitPrice: 55000 },
    ],
  },
  {
    id: 'o3',
    code: '#HD260715003',
    status: 'shipping',
    createdAt: '2026-07-15T16:45:00',
    customerName: 'Lê Thị Hạnh',
    customerPhone: '0789 123 456',
    customerAddress: 'Thủ Đức, TP. Hồ Chí Minh',
    paymentMethod: 'cod',
    items: [
      { name: 'Phonics Flashcards', subtitle: 'Bộ 52 thẻ âm', category: 'flashcard', qty: 1, unitPrice: 150000 },
      { name: 'Sight Words Flashcards', subtitle: 'Bộ 100 từ vựng', category: 'flashcard', qty: 1, unitPrice: 130000 },
      { name: 'Poster Bảng chữ cái', subtitle: 'Khổ A1', category: 'poster', qty: 1, unitPrice: 75000 },
      { name: 'Bộ bút dạ lớp học', subtitle: '12 màu', category: 'supply', qty: 1, unitPrice: 65000 },
    ],
    trackingSteps: [
      { label: 'Đã xác nhận', time: '15/05 16:50', done: true },
      { label: 'Đang xử lý', time: '15/05 17:10', done: true },
      { label: 'Đang giao', time: '16/07 08:30', done: true },
      { label: 'Giao thành công', time: null, done: false },
    ],
  },
  {
    id: 'o4',
    code: '#HD260715004',
    status: 'completed',
    createdAt: '2026-07-15T11:20:00',
    customerName: 'Phạm Minh Đức',
    customerPhone: '0912 345 678',
    customerAddress: 'Bình Thạnh, TP. Hồ Chí Minh',
    paymentMethod: 'bank_transfer',
    items: [
      { name: 'Story Land 1 - Student Book', subtitle: 'Student Book', category: 'book', qty: 1, unitPrice: 150000 },
    ],
  },
  {
    id: 'o5',
    code: '#HD260714005',
    status: 'cancelled',
    createdAt: '2026-07-14T14:05:00',
    customerName: 'Đỗ Thị Thu',
    customerPhone: '0977 888 111',
    customerAddress: 'Quận 7, TP. Hồ Chí Minh',
    paymentMethod: 'cod',
    items: [
      { name: 'Tai nghe lớp học', subtitle: 'Dùng cho luyện nghe', category: 'supply', qty: 1, unitPrice: 220000 },
    ],
  },
];

export const PAYMENT_LABELS: Record<SeedOrder['paymentMethod'], string> = {
  cod: 'COD',
  bank_transfer: 'Chuyển khoản',
};
