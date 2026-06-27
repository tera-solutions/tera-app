import { ChartBarOutlined } from "tera-dls";

import DashboardCard from "../components/DashboardCard";
import ProgressRing from "../components/ProgressRing";
import WidgetState from "../components/WidgetState";
import { useDashboardSummary } from "../hooks";

const ProgressWidget = () => {
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const schedule = data?.schedule_today ?? [];
  const lessonsToday = data?.stats?.lessons_today ?? schedule.length;
  const lessonsDone = schedule.filter((s) => s.status === "done").length;
  const completionRate = data?.stats?.completion_rate ?? 0;

  return (
    <DashboardCard
      title="Tiến độ học tập"
      icon={<ChartBarOutlined />}
      bodyClassName="flex items-center gap-4"
    >
      <WidgetState isLoading={isLoading} isError={isError} onRetry={refetch}>
        <ProgressRing value={completionRate} />
        <ul className="flex-1 space-y-2 text-sm">
          <li className="flex items-center justify-between">
            <span className="text-slate-500">Buổi đã dạy hôm nay</span>
            <span className="font-semibold text-slate-800">
              {lessonsDone}/{lessonsToday}
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-slate-500">Buổi còn lại</span>
            <span className="font-semibold text-slate-800">
              {Math.max(lessonsToday - lessonsDone, 0)}
            </span>
          </li>
        </ul>
      </WidgetState>
    </DashboardCard>
  );
};

export default ProgressWidget;
