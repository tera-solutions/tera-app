/**
 * `edu_class_schedules.weekday` is ISO-8601 (1=Monday…7=Sunday) — see
 * ClassSessionService::generate()'s `dayOfWeekIso` comment on the backend,
 * confirmed against real data (a Mon/Wed class has weekday values 1 and 3).
 */
export const WEEKDAY_LABEL: Record<number, string> = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "Chủ nhật",
};
