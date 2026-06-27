// ─── API Types ────────────────────────────────────────────────────────────────

export type MaterialApiStatus = 'draft' | 'published' | 'archived';

export type MaterialType =
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'ppt'
  | 'pptx'
  | 'xls'
  | 'xlsx'
  | 'mp4'
  | 'mp3'
  | 'image'
  | 'link'
  | 'other';

export type MaterialAccessType = 'teacher' | 'student' | 'all';

export interface MaterialCategory {
  id: number;
  name: string;
  color?: string;
}

export interface MaterialResponse {
  id: number;
  material_code: string;
  material_name: string;
  material_type: MaterialType;
  category_id?: number | null;
  category?: MaterialCategory | null;
  current_version?: string | null;
  access_type?: MaterialAccessType;
  status: MaterialApiStatus;
  file_size?: number | null;      // bytes
  file_url?: string | null;
  description?: string | null;
  class?: { id: number; name: string } | null;
  course?: { id: number; name: string } | null;
  created_by?: number | null;
  business_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MaterialStats {
  total: number;
  hoc_lieu: number;   // Học liệu (pdf/doc/ppt)
  tai_lieu: number;   // Tài liệu (xls/image/link)
  da_phuong_tien: number; // Đa phương tiện (mp4/mp3)
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export interface MaterialItem {
  id: string;
  name: string;
  type: MaterialType;
  className?: string;
  typeName: string;
  size: string;
  date: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  status: MaterialApiStatus;
}

export interface FolderItem {
  id: string;
  name: string;
  count: number;
  color: string;
  bg: string;
  icon: string;
}
