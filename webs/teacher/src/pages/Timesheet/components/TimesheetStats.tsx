import {
  AcademicCapOutlined,
  BanknotesOutlined,
  CalendarDaysOutlined,
  CheckOutlined,
  ClockOutlined,
  XMarkOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";
import WidgetState from "_common/components/WidgetState";

import type { TimesheetStats as Stats } from "../_interface";
import { formatDuration, pct } from "../_utils";

interface TimesheetStatsProps {
  stats: Stats;
  loading?: boolean;
}

interface Tile {
  label: string;
  value: string;
  sub?: string;
  /** Khối chờ backend → nhãn "Sắp có" mờ, số "—". */
  soon?: boolean;
  icon: React.ReactNode;
  color: string;
}

const TimesheetStats = ({ stats, loading }: TimesheetStatsProps) => {
  const tiles: Tile[] = [
    {
      label: "Tổng số buổi",
      value: String(stats.total),
      icon: <CalendarDaysOutlined />,
      color: "bg-sky-50 text-sky-500",
    },
    {
      label: "Đã hoàn thành",
      value: String(stats.completed),
      sub: `${pct(stats.completed, stats.total)}% tổng số buổi`,
      icon: <CheckOutlined />,
      color: "bg-emerald-50 text-emerald-500",
    },
    {
      label: "Sắp diễn ra",
      value: String(stats.upcoming),
      sub: `${pct(stats.upcoming, stats.total)}% tổng số buổi`,
      icon: <ClockOutlined />,
      color: "bg-amber-50 text-amber-500",
    },
    {
      label: "Đã hủy",
      value: String(stats.cancelled),
      sub: `${pct(stats.cancelled, stats.total)}% tổng số buổi`,
      icon: <XMarkOutlined />,
      color: "bg-rose-50 text-rose-500",
    },
    {
      label: "Tổng giờ giảng",
      value: formatDuration(stats.totalMinutes),
      icon: <AcademicCapOutlined />,
      color: "bg-violet-50 text-violet-500",
    },
    {
      label: "Thu nhập ước tính",
      value: "—",
      sub: "Sắp có",
      soon: true,
      icon: <BanknotesOutlined />,
      color: "bg-teal-50 text-teal-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xmd:grid-cols-3 2xl:grid-cols-6">
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
