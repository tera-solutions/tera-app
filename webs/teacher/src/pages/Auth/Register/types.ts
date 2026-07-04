export type Gender = "male" | "female" | "other";

export interface RegisterFormData {
  // Step 1 - Personal
  fullname: string;
  gender: Gender | "";
  email: string;
  phone: string;
  dob: string;
  password: string;
  confirmPassword: string;
  terms: boolean;

  // Step 2 - School
  school: string;
  position: string;
  experience: string;
  subject: string;

  // Step 3 - Profile
  avatar: File | null;
  avatarUrl: string | null;
  bio: string;
  certificate: File | null;
}

export type RegisterStep = 1 | 2 | 3;

export type RegisterErrors = Partial<Record<keyof RegisterFormData, string>>;
