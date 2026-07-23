export interface LeadRow {
  id: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: string;
  owner_id: number | null;
  owner_name: string;
  created_at: string;
}

export interface LeadSummary {
  total: number;
  pending: number;
  verified: number;
  consulting: number;
  studying: number;
}

export interface LeadFormValues {
  name: string;
  phone: string;
  email: string;
  source: string;
  note: string;
  branch_id: number | undefined;
}
