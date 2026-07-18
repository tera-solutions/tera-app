import { Clipboard, Cloud, Clock3, Home, Wallet } from 'lucide-react-native';

export const STEPS = [
  { id: 1, label: 'Chọn gói' },
  { id: 2, label: 'Thanh toán' },
  { id: 3, label: 'Hoàn tất' },
];

// Dùng để minh họa các tính năng thật trả về từ `package.features` — BE chỉ trả
// chuỗi text, không có icon đi kèm, nên gán icon xoay vòng theo vị trí.
export const FEATURE_ICON_POOL = [Home, Wallet, Clipboard, Clock3, Cloud];
