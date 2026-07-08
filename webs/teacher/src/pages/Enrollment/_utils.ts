import type { EnrollmentPricing } from "./_interface";

export const formatVnd = (value: number): string =>
  `${Math.round(value || 0).toLocaleString("vi-VN")}đ`;

/** `discount_percent × tuition` — matches the real `computeMoney()` server-side. */
export const calcTuitionAmount = (pricing: EnrollmentPricing): number => {
  const gross = pricing.total_lessons * pricing.price_per_lesson;
  const discount = gross * ((pricing.discount_percent || 0) / 100);
  return Math.max(0, gross - discount);
};
