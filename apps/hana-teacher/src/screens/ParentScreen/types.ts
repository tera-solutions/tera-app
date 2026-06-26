export type ParentFilterTab = 'all' | 'by_class' | 'contacted' | 'not_contacted';

export type ContactStatus = 'contacted' | 'not_contacted';

export interface ParentItem {
  id: string;
  name: string;
  title: 'Chị' | 'Anh';
  studentName: string;
  relation: 'Mẹ' | 'Bố';
  phone: string;
  status: ContactStatus;
  lastContact?: string; // e.g. "Hôm qua", "2 ngày trước"
  avatar: number;
}

export interface ParentStats {
  total: number;
  contacted: number;
  notContacted: number;
  newParents: number;
}
