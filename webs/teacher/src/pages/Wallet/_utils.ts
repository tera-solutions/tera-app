import type {
  ChartPeriod,
  ChartPoint,
  DateRange,
  LinkedBankAccount,
  WalletInfo,
  WalletSummaryStats,
  WalletTransaction,
} from "./_interface";
import {
  DEFAULT_TRANSACTION_STATUS,
  FAILED_STATUSES,
  TYPE_CONFIG,
} from "./constants";

/** "2,450,000đ" — format tiền khớp thiết kế (dấu phẩy + hậu tố đ). */
export const formatVnd = (value: number) =>
  `${Math.round(Math.abs(value)).toLocaleString("en-US")}đ`;

/** "≈ 2.45 triệu đồng" — dòng phụ dưới số dư. */
export const approxVnd = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `≈ ${(abs / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "")} tỷ đồng`;
  if (abs >= 1_000_000) return `≈ ${(abs / 1_000_000).toFixed(2).replace(/\.?0+$/, "")} triệu đồng`;
  if (abs >= 1_000) return `≈ ${(abs / 1_000).toFixed(1).replace(/\.?0+$/, "")} nghìn đồng`;
  return `${abs} đồng`;
};

export const formatDateTime = (d: Date | null) => {
  if (!d) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  const d = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * ✅ Verify với response thật của `fin/wallet/list` (2026-07-09). Item ví gồm:
 * `id, business_id, wallet_code, owner_type, owner_type_label, owner_id,
 *  available_balance, bonus_balance, frozen_balance, currency, status, status_label`.
 *
 * Số dư là **chuỗi** (`"450000.00"`) và tên field là `available_balance` — KHÔNG phải
 * `balance`/`current_balance`. Ví KHÔNG có `bank_accounts`.
 */
export const toWalletInfo = (raw: any): WalletInfo => {
  const item = raw?.data?.items?.[0] ?? raw?.data?.wallet ?? raw?.data ?? null;
  return {
    id: item?.id ?? null,
    balance: Number(item?.available_balance ?? 0) || 0,
  };
};

/**
 * ✅ Verify với response thật của `fin/wallet/transactions` (2026-07-09). Item giao dịch gồm:
 * `id, transaction_code, wallet_id, transaction_type, transaction_type_label, reference_type,
 *  reference_id, amount, balance_before, balance_after, description, created_by, created_at`.
 *
 * `amount` là **chuỗi** (`"500000.00"`) và luôn dương — hướng tiền suy từ `transaction_type`.
 * **KHÔNG có field `status`** → gán mặc định `completed` (sổ cái bất biến).
 */
export const toTransaction = (t: any): WalletTransaction => {
  const type = String(t?.transaction_type ?? "").toLowerCase();
  const amount = Number(t?.amount ?? 0) || 0;
  const direction =
    TYPE_CONFIG[type]?.direction ?? (amount < 0 ? "out" : "in");
  return {
    id: Number(t?.id ?? 0),
    code: String(t?.transaction_code ?? (t?.id ? `GD${t.id}` : "—")),
    description: String(t?.description ?? "—"),
    type,
    direction,
    amount: Math.abs(amount),
    status: String(t?.status ?? DEFAULT_TRANSACTION_STATUS).toLowerCase(),
    createdAt: toDate(t?.created_at),
  };
};

export const toTransactions = (raw: any): WalletTransaction[] =>
  (raw?.data?.items ?? []).map(toTransaction);

const inMonth = (d: Date | null, ref: Date) =>
  !!d && d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();

const pctChange = (current: number, previous: number): number | null =>
  previous > 0 ? ((current - previous) / previous) * 100 : null;

/**
 * Tổng hợp thống kê từ danh sách giao dịch đã tải. % so sánh = tháng hiện tại vs tháng trước.
 *
 * ⚠️ KHÔNG lọc theo `status`: giao dịch ví là sổ cái bất biến, mọi bút toán đều đã hoàn tất
 * (trước đây lọc `SUCCESS_STATUSES` làm mọi chỉ số về 0 vì backend không trả field này).
 * `failedCount` do đó luôn 0 cho tới khi backend có khái niệm giao dịch thất bại.
 *
 * ⚠️ Tính từ dataset tải về phía client (tối đa per_page = 100 dòng) — khi backend có endpoint
 * wallet-summary riêng thì thay hàm này bằng dữ liệu endpoint đó.
 */
export const toSummaryStats = (txns: WalletTransaction[]): WalletSummaryStats => {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const sum = (list: WalletTransaction[], dir: "in" | "out") =>
    list.filter((t) => t.direction === dir).reduce((acc, t) => acc + t.amount, 0);
  const countFailed = (list: WalletTransaction[]) =>
    list.filter((t) => FAILED_STATUSES.includes(t.status)).length;

  const cur = txns.filter((t) => inMonth(t.createdAt, now));
  const prev = txns.filter((t) => inMonth(t.createdAt, prevMonth));

  return {
    totalIn: sum(txns, "in"),
    totalOut: sum(txns, "out"),
    successCount: txns.length,
    failedCount: countFailed(txns),
    totalInChange: pctChange(sum(cur, "in"), sum(prev, "in")),
    totalOutChange: pctChange(sum(cur, "out"), sum(prev, "out")),
    successCountChange: pctChange(cur.length, prev.length),
    failedCountChange: pctChange(countFailed(cur), countFailed(prev)),
  };
};

const pad2 = (n: number) => String(n).padStart(2, "0");
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const startOfWeek = (d: Date) => {
  const x = startOfDay(d);
  const dow = x.getDay() === 0 ? 7 : x.getDay(); // Thứ 2 = đầu tuần
  x.setDate(x.getDate() - (dow - 1));
  return x;
};
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

/** Quick preset (nút "Theo tuần"/"Theo tháng") → khoảng ngày cụ thể, dùng làm
 * giá trị khởi tạo cho RangePicker — sau đó người dùng có thể chọn tùy ý. */
export const presetToRange = (period: ChartPeriod): DateRange => {
  const to = startOfDay(new Date());
  const from = new Date(to);
  from.setDate(from.getDate() - (period === "week" ? 6 : 29));
  return { from, to };
};

/**
 * Gom giao dịch theo khoảng ngày do người dùng chọn (RangePicker).
 * Bucket tự thu gọn theo độ dài khoảng để biểu đồ không bị quá nhiều điểm:
 * ≤31 ngày → theo ngày, ≤180 ngày → theo tuần, còn lại → theo tháng.
 */
export const toChartPoints = (
  txns: WalletTransaction[],
  range: DateRange,
): ChartPoint[] => {
  const from = startOfDay(range.from);
  const to = startOfDay(range.to);
  const diffDays = Math.max(0, Math.round((to.getTime() - from.getTime()) / 86_400_000)) + 1;

  const granularity: "day" | "week" | "month" =
    diffDays <= 31 ? "day" : diffDays <= 180 ? "week" : "month";

  const bucketStart = (d: Date) =>
    granularity === "day" ? startOfDay(d) : granularity === "week" ? startOfWeek(d) : startOfMonth(d);
  const nextBucket = (d: Date) => {
    const x = new Date(d);
    if (granularity === "day") x.setDate(x.getDate() + 1);
    else if (granularity === "week") x.setDate(x.getDate() + 7);
    else x.setMonth(x.getMonth() + 1);
    return x;
  };
  const label = (d: Date) =>
    granularity === "month"
      ? `${pad2(d.getMonth() + 1)}/${d.getFullYear()}`
      : `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`;

  const points: ChartPoint[] = [];
  let cursor = bucketStart(from);
  const end = new Date(to);
  end.setDate(end.getDate() + 1); // exclusive upper bound

  while (cursor < end) {
    const next = nextBucket(cursor);
    // Không lọc status — xem chú thích ở `toSummaryStats`.
    const inBucket = txns.filter(
      (t) => t.createdAt && t.createdAt >= cursor && t.createdAt < next,
    );
    points.push({
      label: label(cursor),
      moneyIn: inBucket.filter((t) => t.direction === "in").reduce((a, t) => a + t.amount, 0),
      moneyOut: inBucket.filter((t) => t.direction === "out").reduce((a, t) => a + t.amount, 0),
    });
    cursor = next;
  }
  return points;
};

export const formatRangeDate = (d: Date) =>
  `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;

export const chartRangeLabel = (range: DateRange) =>
  `${formatRangeDate(range.from)} - ${formatRangeDate(range.to)}`;

/** Che số tài khoản, chỉ hiện 4 số cuối: "**** **** 1234". */
export const maskAccountNumber = (num: string) => {
  const digits = num.replace(/\D/g, "");
  if (digits.length <= 4) return `**** ${digits}`;
  return `**** **** ${digits.slice(-4)}`;
};

/**
 * Tài khoản ngân hàng liên kết: ưu tiên dữ liệu trên ví, fallback
 * `bank_account` trong hồ sơ giáo viên (entity teacher có sẵn nested này).
 */
export const toLinkedBankAccounts = (
  walletRaw: any,
  profileRaw: any,
): LinkedBankAccount[] => {
  const walletItem = walletRaw?.data?.items?.[0] ?? walletRaw?.data ?? {};
  const list = walletItem?.bank_accounts;
  if (Array.isArray(list) && list.length > 0) {
    return list.map((b: any, i: number) => ({
      bankName: String(b?.bank_name ?? "—"),
      accountNumber: String(b?.bank_account_number ?? b?.account_number ?? ""),
      holderName: String(b?.bank_account_holder ?? b?.holder_name ?? ""),
      isDefault: Boolean(b?.is_default ?? i === 0),
    }));
  }

  const profile = profileRaw?.data ?? {};
  const bank = profile?.teacher?.bank_account ?? profile?.bank_account;
  if (bank?.bank_account_number) {
    return [
      {
        bankName: String(bank.bank_name ?? "—"),
        accountNumber: String(bank.bank_account_number),
        holderName: String(bank.bank_account_holder ?? ""),
        isDefault: true,
      },
    ];
  }
  return [];
};
