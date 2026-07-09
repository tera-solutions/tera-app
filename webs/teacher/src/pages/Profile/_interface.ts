export interface ProfileData {
  full_name: string;
  avatar_url: string;
  email: string;
  dob: string;
  gender: string;
  phone: string;
  role_name: string;
  is_online: boolean;
}

export interface ProfileFormValues {
  full_name: string;
  dob: string;
  gender: string;
  phone: string;
}

export interface ChangePasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
