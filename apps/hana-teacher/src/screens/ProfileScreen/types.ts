export interface ProfileData {
  user_id: number | null;
  full_name: string;
  avatar_url: string;
  email: string;
  dob: string;
  gender: string;
  phone: string;
  role_name: string;
  is_online: boolean;
}

export interface ChangePasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
