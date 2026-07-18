import {
  CreditCard,
  FileText,
  History,
  RefreshCcw,
  XCircle,
} from 'lucide-react-native';

export interface ManageMenuItem {
  id: string;
  title: string;
  desc: string;
  icon: any;
  color: string;
  danger?: boolean;
  action: 'change-plan' | 'payment-history' | 'invoices' | 'stub';
}

export const MANAGE_MENUS: ManageMenuItem[] = [
  {
    id: 'change-plan',
    title: 'Đổi gói dịch vụ',
    desc: 'Nâng cấp hoặc hạ cấp gói phù hợp nhu cầu',
    icon: RefreshCcw,
    color: '#0066cc',
    action: 'change-plan',
  },
  {
    id: 'payment-method',
    title: 'Phương thức thanh toán',
    desc: 'Quản lý thẻ và tài khoản thanh toán',
    icon: CreditCard,
    color: '#0066cc',
    action: 'stub',
  },
  {
    id: 'payment-history',
    title: 'Lịch sử thanh toán',
    desc: 'Xem tất cả giao dịch và hóa đơn',
    icon: History,
    color: '#0066cc',
    action: 'payment-history',
  },
  {
    id: 'invoices',
    title: 'Hóa đơn & biên lai',
    desc: 'Tải về hóa đơn và biên lai thanh toán',
    icon: FileText,
    color: '#0066cc',
    action: 'invoices',
  },
  {
    id: 'cancel',
    title: 'Hủy gói đăng ký',
    desc: 'Bạn vẫn được sử dụng gói đến hết chu kỳ hiện tại',
    icon: XCircle,
    color: '#DC2626',
    danger: true,
    action: 'stub',
  },
];
