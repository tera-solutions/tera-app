export interface LeadDetail {
  id: number;
  code: string;
  name: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  note: string;
  owner_id: number | null;
  owner_name: string;
  branch_id: number | null;
  branch_name: string;
  guardians: Array<{ id: number; full_name: string; relationship: string; phone: string; email: string }>;
  students: Array<{ id: number; code: string; name: string; relationship: string }>;
  courses: Array<{ id: number; code: string; name: string }>;
  created_at: string;
}

export interface LeadHistoryEntry {
  id: number;
  action: string;
  from_status: string | null;
  to_status: string | null;
  reason: string | null;
  note: string | null;
  created_at: string;
}
