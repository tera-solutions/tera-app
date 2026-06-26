import { useNavigate } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";
import { CalendarDaysOutlined } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import DashboardCard from "../components/DashboardCard";
import WidgetState from "../components/WidgetState";
import { useDashboardSummary } from "../hooks";

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const WeekScheduleWidget = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const week = data?.schedule_week ?? [];

  const today = moment().format("YYYY-MM-DD");

  const days = week.map((day, idx) => {
    const date = moment(day.date, "YYYY-MM-DD");
    return {
      label: WEEKDAY_LABELS[idx] ?? date.format("dd"),
      dayOfMonth: date.isValid() ? date.format("DD") : "--",
      count: day.count,
      isToday: day.date === today,
    };
  });

  return (
    <DashboardCard
      className="xmd:col-span-1"
      title="Lịch dạy tuần này"
      icon={<CalendarDaysOutlined />}
      actionLabel="Xem tất cả"
      onAction={() => navigate(PATHS.schedule)}
    >
      <WidgetState
        isLoading={isLoading}
        isError={isError}
        isEmpty={days.length === 0}
        emptyText="Không có lịch dạy tuần này"
        onRetry={refetch}
      >
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => (
            <div
              key={day.label}
              className={classNames(
                "flex flex-col items-center gap-1.5 rounded-lg py-2",
                day.isToday ? "bg-sky-50" : "bg-slate-50",
              )}
            >
              <span className="text-[11px] text-slate-400">{day.label}</span>
              <span className="text-[11px] font-medium text-slate-500">
                {day.dayOfMonth}
              </span>
              <span
                className={classNames(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                  day.count > 0
                    ? "bg-brand text-white"
                    : "bg-slate-200 text-slate-400",
                )}
              >
                {day.count}
              </span>
            </div>
          ))}
        </div>
      </WidgetState>
    </DashboardCard>
  );
};

export default WeekScheduleWidget;
