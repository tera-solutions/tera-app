/* Import: library */
import { useTranslation } from "react-i18next";

/* Cấu hình màu theo trạng thái điểm danh (metadata attendance_status có thể chưa có
   → dùng bảng màu cục bộ + status_label từ API). */
export const ATT_STATUS_CFG: Record<
  string,
  { color: string; backgroundColor: string }
> = {
  present: { color: "#16a34a", backgroundColor: "#dcfce7" },
  late: { color: "#d97706", backgroundColor: "#fef3c7" },
  absent: { color: "#dc2626", backgroundColor: "#fee2e2" },
  excused: { color: "#dc2626", backgroundColor: "#fee2e2" },
};

// 4 trạng thái điểm danh (dùng cho dropdown lưu / lọc)
export const ATT_STATUS_KEYS = ["present", "late", "absent", "excused"];

interface IProps {
  status?: string;
  statusLabel?: string;
}

/** Badge hiển thị trạng thái điểm danh của một bản ghi. */
const AttendanceStatus = ({ status, statusLabel }: IProps) => {
  const { t } = useTranslation();

  if (!status) return <span className="text-gray-300">—</span>;

  const cfg = ATT_STATUS_CFG[status];
  const label = statusLabel ?? t(`attendance.status_${status}`, status);

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium"
      style={{
        color: cfg?.color ?? "#6b7280",
        backgroundColor: cfg?.backgroundColor ?? "#f3f4f6",
      }}
    >
      {label ?? "—"}
    </span>
  );
};

export default AttendanceStatus;
