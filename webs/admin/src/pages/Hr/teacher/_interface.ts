export interface ITeacher {
  id?: number;
  code?: string;
  full_name?: string;
  avatar?: string;
  branch_id?: number | string;
  branch?: { id?: number; name?: string };
  teacher_type?: string;
  status?: string;
  hourly_rate?: number | string;
  address?: string;
  dob?: string;
  email?: string;
  gender?: string;
  phone?: string;
  joined_at?: string;
  monthly_salary?: number | string;
  employment_type?: string;
  manager_id?: number | string;
  manager?: { id?: number; full_name?: string };
  note?: string;
  skills?: { id: number; skill_name: string; level: string }[];
  identity_no?: string;
  bank_account?: IBankAccount;
}

export interface ICertificate {
  id?: number;
  certificate_name?: string;
  issuer?: string;
  issued_date?: string;
  expired_date?: string;
  attachment?: string;
}

export interface IBankAccount {
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  bank_branch?: string;
}

export interface ITeacherForm {
  code: string;
  full_name: string;
  avatar?: string;
  branch_id?: number | string;
  teacher_type?: string;
  status?: string;
  hourly_rate?: number | string;
  gender?: string;
  dob?: string;
  email?: string;
  phone?: string;
  address?: string;
  identity_no?: string;
  joined_at?: string;
  employment_type?: string;
  manager_id?: number | string;
  monthly_salary?: number | string;
  note?: string;
  skills?: { skill_name: string; level: string }[];
  bank_account?: IBankAccount;
}
