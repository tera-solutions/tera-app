export interface IUser {
  id?: number;
  user_id?: string;
  full_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dob?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  department?: string | null;
  is_admin?: boolean;
  is_active?: boolean;
  status?: string;
  business_id?: number | null;
  business?: { id?: number; name?: string } | null;
  branch_id?: number | null;
  branch?: { id?: number; name?: string } | null;
  role_id?: number | null;
  role?: { id?: number; title?: string } | null;
  last_login_at?: string | null;
  last_ip?: string | null;
  login_count?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: any;
  updated_by?: any;
}

export interface IUserForm {
  full_name: string;
  email: string;
  phone?: string;
  username?: string;
  password?: string;
  password_confirmation?: string;
  business_id?: number | string;
  branch_id?: number | string;
  role_id?: number | string;
  department?: string;
  gender?: string;
  dob?: string;
  avatar?: string;
  is_admin?: boolean;
  status?: string;
}
