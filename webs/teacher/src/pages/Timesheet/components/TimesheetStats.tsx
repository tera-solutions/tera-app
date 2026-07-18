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

import type { TimesheetSummary } from "../_interface";
import { formatDuration } from "../_utils";

interface TimesheetStatsProps {
  summary: TimesheetSummary;
  loading?: boolean;
}

interface Tile {
  label: string;
  value: string;
  sub?: string;
  soon?: boolean;
  icon: React.ReactNode;
  color: string;
}

const TimesheetStats = ({ summary, loading }: TimesheetStatsProps) => {
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
      value: "—",
      sub: "Xem ở Bảng lương",
      soon: true,
      icon: <BanknotesOutlined />,
      color: "bg-teal-50 text-teal-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xmd:grid-cols-3 2xl:grid-cols-5">
      {tiles.map((t) => (
        <Card key={t.label} animated={false} className="flex items-center gap-3">
          <IconBox icon={t.icon} colorClassName={t.color} />
          <WidgetState isLoading={loading} animated={false}>
            <div className="min-w-0">
              <p className="truncate text-xs text-slate-400">{t.label}</p>
              <p className="text-lg font-bold text-slate-800">{t.value}</p>
              {t.sub && (
                <p
                  className={`truncate text-[11px] ${t.soon ? "italic text-slate-300" : "text-slate-400"}`}
                >
                  {t.sub}
                </p>
              )}
            </div>
          </WidgetState>
        </Card>
      ))}
    </div>
  );
};

export default TimesheetStats;
