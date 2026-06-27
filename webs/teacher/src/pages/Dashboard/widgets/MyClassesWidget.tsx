import { useNavigate } from "react-router-dom";
import { UsersOutlined } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import DashboardCard from "../components/DashboardCard";
import WidgetState from "../components/WidgetState";
import { useDashboardSummary } from "../hooks";

const MyClassesWidget = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const classes = data?.my_classes ?? [];

  return (
    <DashboardCard
      title="Lớp học của tôi"
      icon={<UsersOutlined />}
      actionLabel="Xem tất cả"
      onAction={() => navigate(PATHS.classes)}
    >
      <WidgetState
        isLoading={isLoading}
        isError={isError}
        isEmpty={classes.length === 0}
        emptyText="Chưa có lớp học"
        onRetry={refetch}
      >
        <div className="divide-y divide-slate-100">
          {classes.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sm font-semibold text-brand">
                {(item.level || item.name).slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {item.name}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {[item.level, `${item.student_count} học viên`]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </WidgetState>
    </DashboardCard>
  );
};

export default MyClassesWidget;
