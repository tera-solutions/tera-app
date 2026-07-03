import { useNavigate } from "react-router-dom";
import { BookOpenOutlined } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import DashboardCard from "../components/DashboardCard";
import WidgetState from "../components/WidgetState";
import { useDashboardSummary } from "../hooks";

const LessonPlanWidget = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const lessonPlans = data?.lesson_plans ?? [];

  return (
    <DashboardCard
      title="Giáo án gần đây"
      icon={<BookOpenOutlined />}
      actionLabel="Xem tất cả"
      onAction={() => navigate(PATHS.lessonPlans)}
    >
      <WidgetState
        isLoading={isLoading}
        isError={isError}
        isEmpty={lessonPlans.length === 0}
        emptyText="Chưa có giáo án gần đây"
        onRetry={refetch}
      >
        <div className="divide-y divide-slate-100">
          {lessonPlans.map((lp) => {
            const percent = Math.max(0, Math.min(100, lp.taught_percent));
            return (
              <div key={lp.id} className="py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {lp.unit_name}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {lp.class_name}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-brand">
                    {percent}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </WidgetState>
    </DashboardCard>
  );
};

export default LessonPlanWidget;
