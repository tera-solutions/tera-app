export interface EnrollmentDraftStudentNew {
  mode: "new";
  key: string;
  name: string;
  dob: string;
  gender: string;
  email?: string;
  phone?: string;
  parent_name?: string;
  parent_phone?: string;
}

export interface EnrollmentDraftStudentExisting {
  mode: "existing";
  key: string;
  student_id: number;
  name: string;
  dob: string;
  email?: string;
}

export type EnrollmentDraftStudent =
  | EnrollmentDraftStudentNew
  | EnrollmentDraftStudentExisting;

export interface EnrollmentPricing {
  total_lessons: number;
  price_per_lesson: number;
  discount_percent: number;
  bonus_lessons: number;
  paid_amount: number;
  payment_method: string;
}

export interface EnrollmentRowResult {
  key: string;
  name: string;
  status: "pending" | "success" | "error";
  message?: string;
}
