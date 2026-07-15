/**
 * [068] Đơn xin nghỉ (Leave Request) — TYPES = HỢP ĐỒNG DỮ LIỆU.
 *
 * ⚠️ UI-only: trang này CHƯA wire API. Đây là shape mà người làm API sẽ nối vào
 * (route thật `v1/edu/leave/*` — xem `docs/postman-structure.md` §5). Giữ tên field
 * khớp backend khi wire để không phải sửa lại UI. Nguồn data hiện tại = `_mock.ts`.
 */

export type LeaveStatus = "approved" | "pending" | "rejected";

export type LeaveType = "annual" | "sick" | "personal" | "unpaid";

/** Số liệu tổng quan quỹ phép (4 thẻ đầu trang). */
export interface LeaveStats {
  /** Tổng ngày phép năm. */
  totalDays: number;
  /** Đã sử dụng (ngày). */
  usedDays: number;
  /** Còn lại (ngày). */
  remainingDays: number;
  /** Số đơn đang chờ duyệt. */
  pendingCount: number;
  /** Khoảng áp dụng quỹ phép, format hiển thị "DD/MM/YYYY". */
  periodFrom: string;
  periodTo: string;
}

/** Một đơn xin nghỉ (dùng cho lịch sử + tô lịch tháng). */
export interface LeaveRequestItem {
  id: string | number;
  type: LeaveType;
  /** Nhãn hiển thị của loại nghỉ (vd "Nghỉ phép năm"). */
  typeLabel: string;
  /** Ngày bắt đầu / kết thúc, ISO "YYYY-MM-DD". */
  from: string;
  to: string;
  /** Tổng số ngày nghỉ của đơn. */
  days: number;
  reason: string;
  status: LeaveStatus;
  /** Ngày tạo đơn, ISO "YYYY-MM-DD" (hiển thị "Đơn ngày DD/MM/YYYY"). */
  createdAt: string;
}

/** Body form tạo đơn (gửi lên khi wire API). */
export interface CreateLeaveForm {
  type: LeaveType | "";
  /** Thời gian nghỉ: cả ngày / buổi sáng / buổi chiều / tùy chọn. */
  duration: string;
  from: string; // "YYYY-MM-DD"
  to: string;
  reason: string;
  attachmentName?: string;
}
