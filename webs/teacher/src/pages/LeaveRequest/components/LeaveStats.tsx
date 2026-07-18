import { CalendarDaysOutlined, CheckOutlined, ClockOutlined, XMarkOutlined } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import type { LeaveSummary } from "../_interface";

interface LeaveStatsProps {
  stats: LeaveSummary;
  loading?: boolean;
}

/** 4 thẻ tổng quan đơn xin nghỉ ở đầu trang — đếm theo trạng thái thật từ BE,
 * không phải quỹ phép năm (backend không có khái niệm này). */
const LeaveStats = ({ stats, loading }: LeaveStatsProps) => {
  const tiles = [
    { label: "Tổng số đơn", value: stats.total, icon: <CalendarDaysOutlined />, color: "bg-sky-50 text-sky-500" },
    { label: "Chờ duyệt", value: stats.pending, icon: <ClockOutlined />, color: "bg-amber-50 text-amber-500" },
    { label: "Đã duyệt", value: stats.approved, icon: <CheckOutlined />, color: "bg-emerald-50 text-emerald-500" },
    { label: "Từ chối", value: stats.rejected, icon: <XMarkOutlined />, color: "bg-rose-50 text-rose-500" },
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
            <p className="text-2xl font-bold text-slate-800">{loading ? "—" : t.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LeaveStats;
