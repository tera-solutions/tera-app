export const PACKAGE_TYPE_OPTIONS = [
  { value: "session", label: "Theo buổi" },
  { value: "month", label: "Theo tháng" },
  { value: "term", label: "Theo kỳ" },
  { value: "custom", label: "Tùy chỉnh" },
];

export const packageTypeLabel = (value?: string | null) =>
  PACKAGE_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value ?? "—";

export const PACKAGE_STATUS_OPTIONS = [
  { value: "active", label: "Đang dùng" },
  { value: "inactive", label: "Ngừng dùng" },
];
