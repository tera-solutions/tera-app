import type { ClassIncomeRow, PayrollDetail, PayrollRow } from "./_interface";

export const formatVnd = (value: number) =>
  `${Math.round(Math.abs(value)).toLocaleString("en-US")}đ`;

export const formatNumber = (value: number) =>
  Math.round(Math.abs(value)).toLocaleString("en-US");

export const periodLabel = (month: number, year: number) =>
  `${String(month).padStart(2, "0")}/${year}`;

/** ✅ Khớp `PayrollResource` (`v1/hr/payroll/list`). */
export const toPayrollRow = (raw: any): PayrollRow => ({
  id: raw.id,
  month: raw.month,
  year: raw.year,
  totalHours: Number(raw.total_hours ?? 0) || 0,
  baseSalary: Number(raw.base_salary ?? 0) || 0,
  bonus: Number(raw.bonus ?? 0) || 0,
  penalty: Number(raw.penalty ?? 0) || 0,
  totalSalary: Number(raw.total_salary ?? 0) || 0,
});

export const toPayrollRows = (raw: any): PayrollRow[] =>
  (raw?.data?.items ?? []).map(toPayrollRow);

/** ✅ Khớp `PayrollController::detail` (`data.payroll` + `data.teacher` + `data.class_income`). */
export const toPayrollDetail = (raw: any): PayrollDetail | null => {
  const data = raw?.data;
  if (!data?.payroll) return null;

  const classIncome: ClassIncomeRow[] = (data.class_income ?? []).map((c: any) => ({
    classId: c.class_id ?? null,
    className: c.class_name ?? "—",
    sessionCount: Number(c.session_count ?? 0) || 0,
    hours: Number(c.hours ?? 0) || 0,
    unitPrice: Number(c.unit_price ?? 0) || 0,
    total: Number(c.total ?? 0) || 0,
  }));

  return {
    payroll: toPayrollRow(data.payroll),
    teacherName: data.teacher?.full_name ?? "—",
    teacherCode: data.teacher?.code ?? "—",
    hourlyRate: Number(data.teacher?.hourly_rate ?? 0) || 0,
    classIncome,
  };
};

// ─── Đọc số tiền thành chữ (tiếng Việt) — card "Thực lãnh" ở chi tiết ─────────

const DIGITS = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const SCALES = ["", "nghìn", "triệu", "tỷ"];

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
