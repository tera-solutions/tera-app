import { CheckCircle2, Clock, ListChecks, RefreshCcw, XCircle } from 'lucide-react-native';

// paid/pending/failed khớp webs/teacher/PackageManagement/InvoiceHistoryTable.tsx.
// "refunded" chưa xác nhận có thật trong enum status của BE — mockup có tab
// "Đã hoàn tiền" nên xử lý phòng hờ, không loại trừ khi gặp giá trị này.
export const STATUS_LABELS: Record<string, string> = {
  paid: 'Đã thanh toán',
  pending: 'Chờ thanh toán',
  failed: 'Thất bại',
  refunded: 'Đã hoàn tiền',
};

export const STATUS_META: Record<string, { color: string; bg: string }> = {
  paid: { color: '#16A34A', bg: '#DCFCE7' },
  pending: { color: '#D97706', bg: '#FEF3C7' },
  failed: { color: '#DC2626', bg: '#FEE2E2' },
  refunded: { color: '#9333EA', bg: '#F3E8FF' },
};

export const STAT_TABS = [
  { id: 'all', label: 'Tất cả', icon: ListChecks, color: '#0066cc', status: null as string | null },
  { id: 'paid', label: 'Đã thanh toán', icon: CheckCircle2, color: '#16A34A', status: 'paid' },
  { id: 'pending', label: 'Chờ thanh toán', icon: Clock, color: '#F97316', status: 'pending' },
  { id: 'refunded', label: 'Đã hoàn tiền', icon: RefreshCcw, color: '#9333EA', status: 'refunded' },
];

export const PER_PAGE = 100;
