import type { RegisterFormData } from "./types";

/** App identifier expected by the register/upload endpoints (Teacher app). */
export const REGISTER_APP_ID = 2;

export const STEP_LABELS = [
  "Thông tin cá nhân",
  "Thông tin trường học",
  "Hồ sơ",
];

export const GENDER_OPTIONS = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Khác", value: "other" },
];

export const AVATAR_MAX_SIZE = 5 * 1024 * 1024;
export const AVATAR_ACCEPT = ["image/jpeg", "image/png"];

export const CERTIFICATE_MAX_SIZE = 10 * 1024 * 1024;
export const CERTIFICATE_ACCEPT = ["application/pdf", "image/jpeg", "image/png"];

export const BIO_MAX_LENGTH = 500;

export const initialRegisterForm: RegisterFormData = {
  fullname: "",
  gender: "",
  email: "",
  phone: "",
  dob: "",
  password: "",
  confirmPassword: "",
  terms: false,
  school: "",
  position: "",
  experience: "",
  subject: "",
  avatar: null,
  avatarUrl: null,
  bio: "",
  certificate: null,
};

/** Fields belonging to each step, used to route inline API errors back to a step. */
export const STEP_FIELDS: Record<number, (keyof RegisterFormData)[]> = {
  1: ["fullname", "gender", "email", "phone", "dob", "password", "confirmPassword", "terms"],
  2: ["school", "position", "experience", "subject"],
  3: ["avatar", "bio", "certificate"],
};
