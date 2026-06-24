export interface IParentStudent {
  id?: number;
  code?: string;
  name?: string;
  relation?: string;
  class_name?: string;
  class?: { id?: number; name?: string };
  course_name?: string;
  course?: { id?: number; name?: string };
  total_tuition?: number;
  total_invoices?: number;
  total_debts?: number;
  total_payments?: number;
}

export interface IParentStatistics {
  total_students?: number;
  total_invoices?: number;
  total_payments?: number;
  total_debts?: number;
}

export interface IParent {
  id?: number;
  code?: string;
  name?: string;
  avatar?: string | null;
  gender?: string;
  dob?: string | null;
  relation?: string;
  status?: string;
  phone?: string;
  email?: string | null;
  address?: string | null;
  province?: string | null;
  district?: string | null;
  occupation?: string | null;
  company?: string | null;
  note?: string | null;
  business_id?: number;
  business?: { id?: number; name?: string };
  branch_id?: number;
  branch?: { id?: number; name?: string };
  students?: IParentStudent[];
  students_count?: number;
  created_at?: string;
}

export interface IParentForm {
  name: string;
  avatar?: string;
  gender?: string;
  dob?: string;
  email?: string;
  phone?: string;
  address?: string;
  province?: string;
  district?: string;
  business_id?: number | string;
  branch_id?: number | string;
  occupation?: string;
  company?: string;
  note?: string;
  students?: {
    link_id?: number | string;
    student_id?: number | string;
    relation?: string;
    is_primary_contact?: boolean;
    is_billing_contact?: boolean;
    is_pickup_authorized?: boolean;
    note?: string;
  }[];
}
