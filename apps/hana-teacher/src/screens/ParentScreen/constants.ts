import { ParentFilterTab, ParentItem, ParentStats } from './types';

export const PARENT_STATS: ParentStats = {
  total: 142,
  contacted: 86,
  notContacted: 38,
  newParents: 18,
};

export const FILTER_TABS: { key: ParentFilterTab; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'by_class', label: 'Theo lớp' },
  { key: 'contacted', label: 'Đã liên hệ' },
  { key: 'not_contacted', label: 'Chưa liên hệ' },
];

export const PARENTS: ParentItem[] = [
  {
    id: 'p1',
    name: 'Phạm Thị Hương',
    title: 'Chị',
    studentName: 'Nguyễn Minh Anh',
    relation: 'Mẹ',
    phone: '0987 654 321',
    status: 'contacted',
    lastContact: 'Hôm qua',
    avatar: require('@tera/assets/app/element_99.png'),
  },
  {
    id: 'p2',
    name: 'Lê Văn Nam',
    title: 'Anh',
    studentName: 'Trần Bảo Châu',
    relation: 'Bố',
    phone: '0912 345 678',
    status: 'contacted',
    lastContact: '2 ngày trước',
    avatar: require('@tera/assets/app/element_100.png'),
  },
  {
    id: 'p3',
    name: 'Nguyễn Thu Hà',
    title: 'Chị',
    studentName: 'Lê Hoàng Nam',
    relation: 'Mẹ',
    phone: '0909 876 543',
    status: 'not_contacted',
    avatar: require('@tera/assets/app/element_101.png'),
  },
  {
    id: 'p4',
    name: 'Đỗ Gia Bảo',
    title: 'Anh',
    studentName: 'Phạm Gia Khánh',
    relation: 'Bố',
    phone: '0938 765 432',
    status: 'contacted',
    lastContact: '1 tuần trước',
    avatar: require('@tera/assets/app/element_102.png'),
  },
  {
    id: 'p5',
    name: 'Trần Thị Mai',
    title: 'Chị',
    studentName: 'Vũ Minh Khang',
    relation: 'Mẹ',
    phone: '0977 123 456',
    status: 'not_contacted',
    avatar: require('@tera/assets/app/element_103.png'),
  },
];

export const PROMO_IMAGE = require('@tera/assets/app/element_104.png');
