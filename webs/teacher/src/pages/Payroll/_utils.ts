import type { PayrollStatus } from "./_interface";

export const formatVnd = (value: number) =>
  `${Math.round(Math.abs(value)).toLocaleString("en-US")}đ`;

export const formatNumber = (value: number) =>
  Math.round(Math.abs(value)).toLocaleString("en-US");

export const PAYROLL_STATUS_META: Record<PayrollStatus, { label: string; className: string }> = {
  paid: { label: "Đã thanh toán", className: "bg-emerald-50 text-emerald-600" },
  pending: { label: "Chưa đến hạn", className: "bg-slate-100 text-slate-500" },
  processing: { label: "Đang xử lý", className: "bg-amber-50 text-amber-600" },
};

// "Tất cả ..." = placeholder khi value rỗng (CompactSelect), KHÔNG là 1 option trong menu.
export const STATUS_FILTER_OPTIONS = [
  { value: "paid", label: "Đã thanh toán" },
  { value: "pending", label: "Chưa đến hạn" },
  { value: "processing", label: "Đang xử lý" },
];

export const INCOME_TYPE_FILTER_OPTIONS = [{ value: "Lương tháng", label: "Lương tháng" }];

// ─── Đọc số tiền thành chữ (tiếng Việt) — card "Thực nhận" ở chi tiết ─────────

const DIGITS = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const SCALES = ["", "nghìn", "triệu", "tỷ"];

// `full` = đọc đủ hàng trăm dù trăm = 0 (áp cho nhóm không phải nhóm cao nhất).
const readGroup = (n: number, full: boolean): string => {
  const tram = Math.floor(n / 100);
  const chuc = Math.floor((n % 100) / 10);
  const donvi = n % 10;
  const parts: string[] = [];

  if (tram > 0 || full) parts.push(`${DIGITS[tram]} trăm`);

  if (chuc > 1) {
    parts.push(`${DIGITS[chuc]} mươi`);
    if (donvi === 1) parts.push("mốt");
    else if (donvi === 5) parts.push("lăm");
    else if (donvi > 0) parts.push(DIGITS[donvi]);
  } else if (chuc === 1) {
    parts.push("mười");
    if (donvi === 1) parts.push("một");
    else if (donvi === 5) parts.push("lăm");
    else if (donvi > 0) parts.push(DIGITS[donvi]);
  } else if (donvi > 0) {
    if (tram > 0 || full) parts.push("lẻ");
    parts.push(DIGITS[donvi]);
  }

  return parts.join(" ");
};

// 10.600.000 → "Mười triệu sáu trăm nghìn đồng".
export const amountToWords = (amount: number): string => {
  let n = Math.floor(Math.abs(amount));
  if (n === 0) return "Không đồng";

  const groups: number[] = [];
  while (n > 0) {
    groups.push(n % 1000);
    n = Math.floor(n / 1000);
  }

  const parts: string[] = [];
  const highestIdx = groups.length - 1;
  for (let i = highestIdx; i >= 0; i--) {
    if (groups[i] === 0) continue;
    const text = readGroup(groups[i], i !== highestIdx);
    parts.push(`${text} ${SCALES[i] ?? ""}`.trim());
  }

  const joined = parts.join(" ").replace(/\s+/g, " ").trim();
  return `${joined.charAt(0).toUpperCase()}${joined.slice(1)} đồng`;
};

export const pct = (value: number, total: number): string => {
  if (total <= 0) return "0";
  return ((value / total) * 100).toFixed(1).replace(/\.0$/, "");
};

export const parseDmy = (s: string): Date | null => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s.trim());
  if (!m) return null;
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return Number.isNaN(d.getTime()) ? null : d;
};
