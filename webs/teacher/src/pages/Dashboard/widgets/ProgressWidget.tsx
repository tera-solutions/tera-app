import { ChartBarOutlined } from "tera-dls";

import DashboardCard from "../components/DashboardCard";
import WidgetState from "../components/WidgetState";
import { useDashboardSummary } from "../hooks";

const ProgressWidget = () => {
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const schedule = data?.schedule_today ?? [];
  const week = data?.schedule_week ?? [];

  const lessonsToday = data?.stats?.lessons_today ?? schedule.length;
  const lessonsDone = schedule.filter((s) => s.status === "done").length;
  const remainingToday = Math.max(lessonsToday - lessonsDone, 0);

  // The week's completion rate is a more meaningful "learning progress" figure
  // than today alone — today's count is already shown by the schedule widget.
  const weekTotal = week.reduce((sum, day) => sum + day.count, 0);
  const weekDone = week.reduce((sum, day) => sum + day.completed, 0);
  const weekRate = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  return (
    <DashboardCard title="Tiến độ học tập" icon={<ChartBarOutlined />}>
      <WidgetState
        isLoading={isLoading}
        isError={isError}
        isEmpty={weekTotal === 0 && lessonsToday === 0}
        emptyText="Chưa có buổi học nào trong tuần này"
        onRetry={refetch}
      >
        <div className="flex items-end justify-between gap-2">
          <p className="text-3xl font-bold text-slate-800">
            {weekRate}
            <span className="text-base font-normal text-slate-400">%</span>
          </p>
          <span className="text-xs font-medium text-brand">
            {weekDone}/{weekTotal} buổi tuần này
          </span>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${weekRate}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {weekDone}/{weekTotal}
            </p>
            <p className="text-[11px] text-slate-400">Tuần này</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {lessonsDone}/{lessonsToday}
            </p>
            <p className="text-[11px] text-slate-400">Hôm nay</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{remainingToday}</p>
            <p className="text-[11px] text-slate-400">Còn lại</p>
          </div>
        </div>
      </WidgetState>
    </DashboardCard>
  );
};

export default ProgressWidget;
