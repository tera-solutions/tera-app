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

// ── API response types (từ /v1/crm/parent/list) ────────────────

export type ParentApiStatus = 'active' | 'suspended' | 'inactive';

export interface ParentResponse {
  id: number;
  code?: string;
  name: string;
  avatar?: string | null;
  gender?: string | null;
  dob?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  province?: string | null;
  district?: string | null;
  occupation?: string | null;
  company?: string | null;
  note?: string | null;
  status?: ParentApiStatus;
  students_count?: number;
  business_id?: number;
  business?: { id: number; name: string } | null;
  branch_id?: number;
  branch?: { id: number; name: string } | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
