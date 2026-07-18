import { Crown, Gem, Send } from 'lucide-react-native';

/**
 * BE chỉ hỗ trợ đúng 2 chu kỳ thanh toán: "month" | "year" (xem
 * `UpgradeSubscriptionPayload`, `PackageFormModal`, `Superadmin/TenantDetail`
 * ở web) — KHÔNG có chu kỳ "6 tháng" như trong mockup gốc, nên màn hình này
 * chỉ hiển thị 2 lựa chọn thật thay vì 3.
 */
export const CYCLE_OPTIONS = [
  { id: 'month', label: 'Hàng tháng', badge: null as string | null },
  { id: 'year', label: 'Hàng năm', badge: 'Tiết kiệm hơn' },
];

export const TIER_ICONS = [Send, Crown, Gem];
export const TIER_COLORS = ['#0EA5E9', '#0066cc', '#9333EA'];

export const TERMS = [
  'Tất cả gói dịch vụ sẽ tự động gia hạn theo chu kỳ đã chọn.',
  'Bạn có thể hủy gói dịch vụ bất kỳ lúc nào trong phần Cài đặt.',
  'Nếu hủy, quyền lợi của gói sẽ được giữ đến hết chu kỳ đã thanh toán.',
  'Giá đã bao gồm VAT (nếu có).',
];
