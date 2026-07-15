import type { LeaveStatus } from "../_interface";

/**
 * Cấu hình nhãn + màu theo trạng thái đơn nghỉ. Ở đây (KHÔNG trong `_mock.ts`) để
 * còn dùng được sau khi wire API xóa mock: badge (LeaveRequestStatus), chấm lịch, pill tuần.
 */
export const LEAVE_STATUS_META: Record<
  LeaveStatus,
  { label: string; dot: string; badge: string }
> = {
  approved: {
    label: "Đã duyệt",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-600",
  },
  pending: {
    label: "Chờ duyệt",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-600",
  },
  rejected: {
    label: "Từ chối",
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-600",
  },
};

interface LeaveRequestStatusProps {
  status: LeaveStatus;
  className?: string;
}

/** Badge trạng thái đơn xin nghỉ (Chờ duyệt / Đã duyệt / Từ chối). */
const LeaveRequestStatus = ({ status, className = "" }: LeaveRequestStatusProps) => {
  const meta = LEAVE_STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${meta.badge} ${className}`}
    >
      {meta.label}
    </span>
  );
};

export default LeaveRequestStatus;
