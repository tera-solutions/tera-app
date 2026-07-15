import {
  CalendarDaysOutlined,
  CheckOutlined,
  ClipboardDocumentCheckOutlined,
  ClockOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import type { LeaveStats as Stats } from "../_interface";

interface LeaveStatsProps {
  stats: Stats;
}

const pct = (part: number, total: number) =>
  total > 0 ? `${((part / total) * 100).toFixed(1)}%` : "0%";

/** 4 thẻ tổng quan quỹ phép ở đầu trang Đơn xin nghỉ. */
const LeaveStats = ({ stats }: LeaveStatsProps) => {
  const tiles = [
    {
      label: "Tổng ngày phép năm",
      value: stats.totalDays,
      unit: "ngày",
      sub: `(${stats.periodFrom} - ${stats.periodTo})`,
      subClass: "text-slate-400",
      icon: <CalendarDaysOutlined />,
      color: "bg-sky-50 text-sky-500",
    },
    {
      label: "Đã sử dụng",
      value: stats.usedDays,
      unit: "ngày",
      sub: `↓ ${pct(stats.usedDays, stats.totalDays)}`,
      subClass: "text-emerald-500",
      icon: <ClipboardDocumentCheckOutlined />,
      color: "bg-sky-50 text-sky-500",
    },
    {
      label: "Còn lại",
      value: stats.remainingDays,
      unit: "ngày",
      sub: `↓ ${pct(stats.remainingDays, stats.totalDays)}`,
      subClass: "text-emerald-500",
      icon: <CheckOutlined />,
      color: "bg-sky-50 text-sky-500",
    },
    {
      label: "Đang chờ duyệt",
      value: stats.pendingCount,
      unit: "đơn",
      icon: <ClockOutlined />,
      color: "bg-amber-50 text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {tiles.map((t) => (
        <Card key={t.label} animated={false} className="flex items-center gap-3">
          <IconBox
            icon={t.icon}
            sizeClassName="h-12 w-12"
            roundedClassName="rounded-2xl"
            colorClassName={t.color}
            iconSizeClassName="[&_svg]:h-6 [&_svg]:w-6"
          />
          <div className="min-w-0">
            <p className="truncate text-xs text-slate-400">{t.label}</p>
            <p className="text-slate-800">
              <span className="text-2xl font-bold">{t.value}</span>{" "}
              <span className="text-sm font-medium text-slate-500">
                {t.unit}
              </span>
            </p>
            {t.sub && (
              <p className={`truncate text-[11px] ${t.subClass}`}>{t.sub}</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LeaveStats;
