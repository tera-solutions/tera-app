export interface IBusiness {
  id?: number;
  business_code?: string | null;
  name?: string;
  short_name?: string | null;
  prefix?: string | null;
  tax_code?: string | null;
  website?: string | null;
  status?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  province?: string | null;
  district?: string | null;
  ward?: string | null;
  zip_code?: string | null;
  manager_id?: number | null;
  manager?: { id?: number; name?: string; full_name?: string } | null;
  created_at?: string;
}

export interface IBusinessForm {
  business_code?: string;
  name: string;
  short_name?: string;
  prefix?: string;
  tax_code?: string;
  website?: string;
  status?: string;
  phone?: string;
  email?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  zip_code?: string;
  manager_id?: number | string;
}
