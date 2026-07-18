import { CheckCircle2, Clock, XCircle } from 'lucide-react-native';

// Khớp STATUS_LABELS/STATUS_BADGE của webs/teacher/PackageManagement/InvoiceHistoryTable.tsx
export const STATUS_LABELS: Record<string, string> = {
  paid: 'Đã thanh toán',
  pending: 'Chờ thanh toán',
  failed: 'Thất bại',
};

export const STATUS_META: Record<string, { icon: any; color: string; bg: string }> = {
  paid: { icon: CheckCircle2, color: '#16A34A', bg: '#DCFCE7' },
  pending: { icon: Clock, color: '#D97706', bg: '#FEF3C7' },
  failed: { icon: XCircle, color: '#DC2626', bg: '#FEE2E2' },
};

export const PER_PAGE = 50;
