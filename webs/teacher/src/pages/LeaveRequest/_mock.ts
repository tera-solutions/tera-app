import moment from "moment";

import type { LeaveRequestItem, LeaveStats, LeaveType } from "./_interface";

/**
 * ⚠️ DATA GIẢ để dựng UI — KHÔNG phải data thật. Khi wire API (`v1/edu/leave/*`)
 * thì thay toàn bộ file này bằng dữ liệu từ service hook, giữ nguyên shape ở `_interface.ts`.
 * Dùng `moment()` (ngày hiện tại) để lịch tháng luôn có bản ghi để hiển thị.
 * (Cấu hình màu/nhãn trạng thái nằm ở `components/LeaveRequestStatus.tsx`, không ở đây.)
 */

/** Ngày trong THÁNG HIỆN TẠI → ISO "YYYY-MM-DD". */
const dThisMonth = (day: number) => moment().date(day).format("YYYY-MM-DD");
/** Ngày trong tháng TRƯỚC → ISO. */
const dPrevMonth = (day: number) =>
  moment().subtract(1, "month").date(day).format("YYYY-MM-DD");

/** Nhãn loại nghỉ. */
export const LEAVE_TYPE_LABEL: Record<LeaveType, string> = {
  annual: "Nghỉ phép năm",
  sick: "Nghỉ ốm",
  personal: "Nghỉ việc riêng",
  unpaid: "Nghỉ không lương",
};

/** Option cho select "Loại nghỉ" (emoji dẫn cho khớp mockup). */
export const LEAVE_TYPE_OPTIONS = [
  { value: "annual", label: "🌴 Nghỉ phép năm" },
  { value: "sick", label: "🤒 Nghỉ ốm" },
  { value: "personal", label: "👤 Nghỉ việc riêng" },
  { value: "unpaid", label: "💼 Nghỉ không lương" },
];

/** Option cho select "Thời gian nghỉ" ("Tùy chọn" là placeholder, KHÔNG nằm trong danh sách). */
export const LEAVE_DURATION_OPTIONS = [
  { value: "full", label: "Cả ngày" },
  { value: "morning", label: "Buổi sáng" },
  { value: "afternoon", label: "Buổi chiều" },
];

/** Lịch sử đơn xin nghỉ (mock). */
export const MOCK_LEAVE_HISTORY: LeaveRequestItem[] = [
  {
    id: 1,
    type: "annual",
    typeLabel: LEAVE_TYPE_LABEL.annual,
    from: dThisMonth(20),
    to: dThisMonth(22),
    days: 3,
    reason: "Nghỉ phép để đưa gia đình đi du lịch.",
    status: "pending",
    createdAt: dThisMonth(15),
  },
  {
    id: 2,
    type: "annual",
    typeLabel: LEAVE_TYPE_LABEL.annual,
    from: dThisMonth(5),
    to: dThisMonth(6),
    days: 2,
    reason: "Nghỉ phép cá nhân.",
    status: "approved",
    createdAt: dThisMonth(1),
  },
  {
    id: 3,
    type: "sick",
    typeLabel: LEAVE_TYPE_LABEL.sick,
    from: dPrevMonth(15),
    to: dPrevMonth(16),
    days: 2,
    reason: "Bị sốt và cần thời gian nghỉ ngơi.",
    status: "approved",
    createdAt: dPrevMonth(14),
  },
  {
    id: 4,
    type: "personal",
    typeLabel: LEAVE_TYPE_LABEL.personal,
    from: dThisMonth(26),
    to: dThisMonth(26),
    days: 1,
    reason: "Việc gia đình.",
    status: "rejected",
    createdAt: dThisMonth(18),
  },
  {
    id: 5,
    type: "sick",
    typeLabel: LEAVE_TYPE_LABEL.sick,
    from: dPrevMonth(8),
    to: dPrevMonth(8),
    days: 1,
    reason: "Khám sức khỏe định kỳ.",
    status: "approved",
    createdAt: dPrevMonth(7),
  },
  {
    id: 6,
    type: "annual",
    typeLabel: LEAVE_TYPE_LABEL.annual,
    from: dPrevMonth(25),
    to: dPrevMonth(26),
    days: 2,
    reason: "Kế hoạch cá nhân.",
    status: "rejected",
    createdAt: dPrevMonth(20),
  },
  {
    id: 7,
    type: "unpaid",
    typeLabel: LEAVE_TYPE_LABEL.unpaid,
    from: dPrevMonth(2),
    to: dPrevMonth(3),
    days: 2,
    reason: "Về quê có việc gia đình.",
    status: "approved",
    createdAt: dPrevMonth(1),
  },
  {
    id: 8,
    type: "personal",
    typeLabel: LEAVE_TYPE_LABEL.personal,
    from: dThisMonth(12),
    to: dThisMonth(12),
    days: 1,
    reason: "Giải quyết việc riêng.",
    status: "pending",
    createdAt: dThisMonth(10),
  },
];

/** Số liệu 4 thẻ (mock cố định theo design; khi wire API lấy từ endpoint quota). */
export const MOCK_LEAVE_STATS: LeaveStats = {
  totalDays: 15,
  usedDays: 4,
  remainingDays: 11,
  pendingCount: 1,
  periodFrom: `01/01/${moment().year()}`,
  periodTo: `31/12/${moment().year()}`,
};
