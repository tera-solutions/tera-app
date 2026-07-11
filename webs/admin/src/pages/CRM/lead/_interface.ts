// ✅ Field khớp response thật crm/lead/list + detail (data.data.lead + histories).
export interface ILead {
  id?: number;
  code?: string | null;
  name?: string;
  gender?: string | null;
  dob?: string | null;
  email?: string | null;
  phone?: string | null;
  source?: string | null; // nguồn (facebook/zalo/hotline...)
  status?: string; // metadata lead_status (pending/verified/studying/inactive)
  note?: string | null;
  previous_status?: string | null;
  suspended_at?: string | null;
  suspend_reason?: string | null;
  guardians_count?: number;
  students_count?: number;
  business_id?: number | null;
  business?: { id?: number; name?: string } | null;
  branch_id?: number | null;
  branch?: { id?: number; name?: string } | null;
  owner_id?: number | null; // NV phụ trách (user)
  owner?: { id?: number; full_name?: string; name?: string } | null;
  guardians?: any[];
  students?: any[];
  tags?: any[];
  courses?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface ILeadGuardianForm {
  parent_id?: number | string; // phụ huynh được chọn (auto-fill họ tên/sđt/email)
  full_name?: string;
  relationship?: string;
  phone?: string;
  email?: string;
}

export interface ILeadStudentForm {
  student_id?: number | string;
  relationship?: string;
}

export interface ILeadForm {
  name?: string;
  gender?: string;
  dob?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  business_id?: number | string;
  branch_id?: number | string;
  owner_id?: number | string;
  note?: string;
  tag_ids?: string[];
  course_ids?: string[];
  guardians?: ILeadGuardianForm[];
  students?: ILeadStudentForm[];
}
