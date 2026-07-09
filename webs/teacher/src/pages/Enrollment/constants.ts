import type { EnrollmentPricing } from "./_interface";

export const STEP_LABELS = ["Chọn lớp", "Học phí", "Học viên", "Xác nhận"];

export const DEFAULT_PRICING: EnrollmentPricing = {
  total_lessons: 24,
  price_per_lesson: 250000,
  discount_percent: 0,
  bonus_lessons: 0,
  paid_amount: 0,
  payment_method: "cash",
};

/**
 * No tuition-package catalog exists on the backend — these presets are local
 * UI sugar that just pre-fill the real `total_lessons`/`price_per_lesson`
 * fields; the teacher can still edit every value before submitting.
 */
export const PRICING_PRESETS: {
  key: string;
  label: string;
  total_lessons: number;
  price_per_lesson: number;
}[] = [
  { key: "session", label: "Theo buổi", total_lessons: 1, price_per_lesson: 94000 },
  { key: "month", label: "Theo tháng (~8 buổi)", total_lessons: 8, price_per_lesson: 250000 },
  { key: "term", label: "Theo kỳ (~24 buổi)", total_lessons: 24, price_per_lesson: 250000 },
  { key: "custom", label: "Tùy chỉnh", total_lessons: 1, price_per_lesson: 0 },
];

export const GENDER_OPTIONS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: "cash", label: "Tiền mặt" },
  { value: "transfer", label: "Chuyển khoản" },
  { value: "card", label: "Thẻ" },
];
