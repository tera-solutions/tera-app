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
 * No tuition-package catalog exists on the backend — these presets only
 * pre-fill `total_lessons` (a real packaging choice: buổi lẻ vs tháng vs kỳ).
 * `price_per_lesson` is intentionally NOT part of a preset — it's seeded from
 * the selected class's actual course price (`edu_courses.price_per_lesson`,
 * see `Enrollment/index.tsx`), which presets must not silently override with
 * a generic guess.
 */
export const PRICING_PRESETS: {
  key: string;
  label: string;
  total_lessons: number;
}[] = [
  { key: "session", label: "Theo buổi", total_lessons: 1 },
  { key: "month", label: "Theo tháng (~8 buổi)", total_lessons: 8 },
  { key: "term", label: "Theo kỳ (~24 buổi)", total_lessons: 24 },
  { key: "custom", label: "Tùy chỉnh", total_lessons: 1 },
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
