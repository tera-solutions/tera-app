export interface IEnrollment {
  id?: number;
  code?: string | null;
  status?: string;
  student_id?: number;
  student?: { id?: number; code?: string; name?: string; phone?: string | null } | null;
  course_id?: number | null;
  course?: { id?: number; code?: string; name?: string } | null;
  class_id?: number;
  class?: {
    id?: number;
    code?: string;
    name?: string;
    teacher?: { id?: number; full_name?: string } | null;
  } | null;
  sales_id?: number | null;
  sales?: { id?: number; full_name?: string } | null;
  enrolled_at?: string | null;
  total_lessons?: number;
  completed_lessons?: number;
  remaining_lessons?: number;
  price_per_lesson?: number;
  tuition_amount?: number;
  discount_amount?: number;
  paid_amount?: number;
  debt_amount?: number;
  note?: string | null;
  business_id?: number;
  created_by?: any;
  updated_by?: any;
  created_at?: string;
  updated_at?: string;
}

export interface IEnrollmentProgress {
  total_lessons?: number;
  completed_lessons?: number;
  remaining_lessons?: number;
  completion_rate?: number;
}

export interface IEnrollmentFinancial {
  tuition_amount?: number;
  discount_amount?: number;
  paid_amount?: number;
  debt_amount?: number;
  refund_amount?: number;
}

/** Toàn bộ `data.data` của GET /edu/enrollment/detail/:id */
export interface IEnrollmentDetail {
  enrollment?: IEnrollment;
  progress?: IEnrollmentProgress;
  financial?: IEnrollmentFinancial;
  payments?: any[];
  transfers?: any[];
  suspensions?: any[];
}

export interface IEnrollmentForm {
  student_id?: number | string;
  course_id?: number | string;
  class_id?: number | string;
  sales_id?: number | string;
  enrolled_at?: string;
  total_lessons?: number | string;
  price_per_lesson?: number | string;
  discount_percent?: number | string;
  discount_amount?: number | string;
  bonus_lessons?: number | string;
  paid_amount?: number | string;
  payment_method?: string;
  note?: string;
}
