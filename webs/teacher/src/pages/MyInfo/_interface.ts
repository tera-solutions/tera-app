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

export interface TeachingSkill {
  id: number;
  name: string;
  level: string;
}

export interface TeachingCertificate {
  id: number;
  name: string;
  issuer: string;
  issued_date: string;
  expired_date: string;
  is_expired: boolean;
}

export interface TeachingProfileData {
  teacher_id: number | null;
  teacher_type: string;
  employment_type: string;
  joined_at: string;
  years_experience: number;
  skills: TeachingSkill[];
  certificates: TeachingCertificate[];
}
