export interface IBranch {
  id?: number;
  business_id?: number;
  business?: { id?: number; name?: string };
  code?: string;
  name?: string;
  short_name?: string;
  status?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  postal_code?: string;
  manager_id?: number | null;
  manager?: { id?: number; name?: string; full_name?: string } | null;
  capacity?: number | null;
  opened_at?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by?: any;
  updated_by?: any;
}

export interface IBranchForm {
  business_id?: number | string;
  code: string;
  name: string;
  short_name?: string;
  status?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  postal_code?: string;
  manager_id?: number | string;
  capacity?: number | string;
  opened_at?: string;
}
