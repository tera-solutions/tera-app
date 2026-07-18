import { Archive, BookOpen, Bookmark, LucideIcon, Package } from 'lucide-react-native';

// Không có API sản phẩm/kho hàng thật (đã xác nhận không có product/shop API
// trong repo — xem comment ở HocLieuScreen/constants.ts). 4 số liệu tổng dưới
// đây là số MẪU minh hoạ cho toàn hệ thống (156 học liệu), không nhất thiết
// khớp 1-1 với danh sách PRODUCTS thật (17 sản phẩm) hiển thị bên dưới —
// giống cách HocLieuOrderScreen dùng STAT_TILES minh hoạ.
export interface ManageStatTile {
  id: 'total' | 'active' | 'out_of_stock' | 'hidden';
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export const STAT_TILES: ManageStatTile[] = [
  { id: 'total', label: 'Tổng học liệu', value: 156, icon: BookOpen, color: '#2563EB' },
  { id: 'active', label: 'Đang sử dụng', value: 68, icon: Bookmark, color: '#16A34A' },
  { id: 'out_of_stock', label: 'Hết hàng', value: 8, icon: Package, color: '#F97316' },
  { id: 'hidden', label: 'Đã ẩn', value: 12, icon: Archive, color: '#8B5CF6' },
];

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

export const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Mới nhất',
  price_asc: 'Giá tăng dần',
  price_desc: 'Giá giảm dần',
};

export const SORT_ORDER: SortOption[] = ['newest', 'price_asc', 'price_desc'];
