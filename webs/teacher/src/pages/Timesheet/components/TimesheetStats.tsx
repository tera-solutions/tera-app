import { useNavigate } from "react-router-dom";
import {
  AcademicCapOutlined,
  BanknotesOutlined,
  CalendarDaysOutlined,
  ClipboardDocumentCheckOutlined,
  StarOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";
import WidgetState from "_common/components/WidgetState";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { formatVnd } from "pages/Payroll/_utils";

import type { TimesheetSummary } from "../_interface";
import { formatDuration } from "../_utils";

interface TimesheetStatsProps {
  summary: TimesheetSummary;
  loading?: boolean;
  /** Lương kỳ khớp tháng đang xem (`null` nếu khoảng ngày không phải 1 tháng trọn vẹn
   * hoặc chưa có kỳ lương tương ứng — BE chỉ backfill kỳ lương cho tháng đã dạy). */
  estimatedIncome?: number | null;
  incomeLoading?: boolean;
}

interface Tile {
  label: string;
  value: string;
  sub?: string;
  soon?: boolean;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
  loading?: boolean;
}

const TimesheetStats = ({
  summary,
  loading,
  estimatedIncome,
  incomeLoading,
}: TimesheetStatsProps) => {
  const navigate = useNavigate();
  const tiles: Tile[] = [
    {
      label: "Tổng số buổi",
      value: String(summary.totalSessions),
      icon: <CalendarDaysOutlined />,
      color: "bg-sky-50 text-sky-500",
    },
    {
      label: "Tổng giờ giảng",
      value: formatDuration(summary.totalHours),
      icon: <AcademicCapOutlined />,
      color: "bg-violet-50 text-violet-500",
    },
    {
      label: "Tỷ lệ chuyên cần",
      value: summary.attendanceRate === null ? "—" : `${summary.attendanceRate}%`,
      icon: <ClipboardDocumentCheckOutlined />,
      color: "bg-emerald-50 text-emerald-500",
    },
    {
      label: "Đánh giá trung bình",
      value: summary.averageRating === null ? "—" : `${summary.averageRating}/5`,
      icon: <StarOutlined />,
      color: "bg-amber-50 text-amber-500",
    },
    {
      label: "Thu nhập ước tính",
      value: estimatedIncome === null || estimatedIncome === undefined ? "—" : formatVnd(estimatedIncome),
      sub: "Xem ở Bảng lương",
      icon: <BanknotesOutlined />,
      color: "bg-teal-50 text-teal-500",
      onClick: () => navigate(PATHS.payroll),
      loading: incomeLoading,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xmd:grid-cols-3 2xl:grid-cols-5">
      {tiles.map((t) => (
        <Card
          key={t.label}
          animated={false}
          className={`flex items-center gap-3 ${t.onClick ? "cursor-pointer transition-shadow hover:shadow-md" : ""}`}
          onClick={t.onClick}
        >
          <IconBox icon={t.icon} colorClassName={t.color} />
          <WidgetState isLoading={t.loading ?? loading} animated={false}>
            <div className="min-w-0">
              <p className="truncate text-xs text-slate-400">{t.label}</p>
              <p className="text-lg font-bold text-slate-800">{t.value}</p>
              {t.sub && <p className="truncate text-[11px] text-slate-400">{t.sub}</p>}
            </div>
          </WidgetState>
        </Card>
      ))}
    </div>
  );
};

export default TimesheetStats;
