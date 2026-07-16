export const formatVnd = (value?: number | string | null): string => {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return "0 ₫";
  return `${n.toLocaleString("vi-VN")} ₫`;
};

export const formatNumber = (value?: number | string | null): string =>
  Number(value ?? 0).toLocaleString("vi-VN");

export const TENANT_STATUS_META: Record<
  string,
  { label: string; className: string }
> = {
  active: { label: "Đang hoạt động", className: "bg-emerald-50 text-emerald-600" },
  suspended: { label: "Tạm ngưng", className: "bg-amber-50 text-amber-600" },
  inactive: { label: "Ngừng hoạt động", className: "bg-slate-100 text-slate-500" },
};

export const SUBSCRIPTION_STATUS_META: Record<
  string,
  { label: string; className: string }
> = {
  active: { label: "Đang hoạt động", className: "bg-emerald-50 text-emerald-600" },
  expired: { label: "Hết hạn", className: "bg-rose-50 text-rose-600" },
  cancelled: { label: "Đã hủy", className: "bg-slate-100 text-slate-500" },
};

/** Envelope helpers: the driver returns the full { data, ... } response body. */
export const listItems = <T = any>(envelope: any): T[] =>
  envelope?.data?.items ?? [];

export const listTotal = (envelope: any): number =>
  envelope?.data?.pagination?.total ?? 0;

export const payload = <T = any>(envelope: any): T | undefined =>
  envelope?.data;
