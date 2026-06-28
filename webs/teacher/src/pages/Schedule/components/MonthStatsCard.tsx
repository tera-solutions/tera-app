import { CalendarDaysOutlined } from "tera-dls";

import { CARD } from "_common/constants/dashboard";
import WidgetState from "_common/components/WidgetState";

interface MonthStatsCardProps {
  total: number;
  completed: number;
  loading?: boolean;
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-semibold text-slate-800">{value}</span>
  </div>
);

const MonthStatsCard = ({ total, completed, loading }: MonthStatsCardProps) => {
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`${CARD} flex flex-col gap-3 p-4`}>
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-brand">
        <CalendarDaysOutlined />
        Lịch dạy tháng này
      </p>
      <WidgetState isLoading={loading}>
        <div className="flex flex-col gap-2.5">
          <Row label="Tổng buổi học" value={total} />
          <Row label="Đã hoàn thành" value={completed} />
          <Row label="Tỷ lệ hoàn thành" value={`${rate}%`} />
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand transition-[width]"
              style={{ width: `${rate}%` }}
            />
          </div>
        </div>
      </WidgetState>
    </div>
  );
};

export default MonthStatsCard;
