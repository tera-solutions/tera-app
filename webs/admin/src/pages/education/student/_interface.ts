export interface IStudentParent {
  id?: number;
  name?: string;
  phone?: string;
  email?: string | null;
  relation?: string;
}

export interface IStudent {
  id?: number;
  code?: string;
  name?: string;
  avatar?: string | null;
  dob?: string;
  gender?: string;
  nationality?: string | null;
  language?: string | null;
  email?: string;
  phone?: string;
  level_id?: number;
  level?: { id?: number; name?: string };
  status?: string;
  enrollment_date?: string;
  admission_source?: string;
  address?: string | null;
  province?: string | null;
  district?: string | null;
  note?: string | null;
  business_id?: number;
  business?: { id?: number; name?: string };
  branch_id?: number;
  branch?: { id?: number; name?: string };
  parents?: IStudentParent[];
}

export interface IStudentForm {
  code: string;
  name: string;
  avatar?: string;
  business_id?: number | string;
  branch_id?: number | string;
  gender?: string;
  dob?: string;
  email?: string;
  phone?: string;
  level_id?: number | string;
  status?: string;
  enrollment_date?: string;
  admission_source?: string;
  nationality?: string;
  language?: string;
  address?: string;
  province?: string;
  district?: string;
  note?: string;
  parents?: {
    link_id?: number | string;
    mode?: "existing" | "new";
    parent_id?: number | string;
    name?: string;
    relation?: string;
    phone?: string;
    email?: string;
    is_primary_contact?: boolean;
    is_billing_contact?: boolean;
    is_pickup_authorized?: boolean;
    note?: string;
  }[];
}
