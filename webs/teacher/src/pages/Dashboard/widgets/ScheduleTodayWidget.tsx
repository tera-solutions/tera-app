import { useNavigate } from "react-router-dom";
import { CalendarDaysOutlined } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import DashboardCard from "../components/DashboardCard";
import ScheduleRow from "../components/ScheduleRow";
import WidgetState from "../components/WidgetState";
import { useDashboardSummary } from "../hooks";

const ScheduleTodayWidget = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const schedule = data?.schedule_today ?? [];

  return (
    <DashboardCard
      className="xmd:col-span-1"
      title="Lịch dạy hôm nay"
      icon={<CalendarDaysOutlined />}
      actionLabel="Xem tất cả"
      onAction={() => navigate(PATHS.schedule)}
    >
      <WidgetState
        isLoading={isLoading}
        isError={isError}
        isEmpty={schedule.length === 0}
        emptyText="Không có lịch dạy hôm nay"
        onRetry={refetch}
      >
        <div className="divide-y divide-slate-100">
          {schedule.map((item) => (
            <ScheduleRow key={item.id} item={item} />
          ))}
        </div>
      </WidgetState>
    </DashboardCard>
  );
};

export default ScheduleTodayWidget;
