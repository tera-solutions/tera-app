import { useMemo } from "react";
import moment from "moment";
import classNames from "classnames";
import { ChevronLeftOutlined, ChevronRightOutlined } from "tera-dls";

import { CARD } from "_common/constants/dashboard";
import WidgetState from "_common/components/WidgetState";

import { WEEKDAY_LABELS } from "../constants";

interface MiniCalendarProps {
  currentDate: moment.Moment;
  scheduleDates: Set<string>;
  onSelectDay: (date: moment.Moment) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  loading?: boolean;
}

const MiniCalendar = ({
  currentDate,
  scheduleDates,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  loading,
}: MiniCalendarProps) => {
  const cells = useMemo(() => {
    const gridStart = currentDate.clone().startOf("month").startOf("isoWeek");
    return Array.from({ length: 42 }, (_, i) =>
      gridStart.clone().add(i, "day"),
    );
  }, [currentDate]);

  const currentMonth = currentDate.month();
  const today = moment().format("YYYY-MM-DD");
  const selected = currentDate.format("YYYY-MM-DD");

  return (
    <div className={`${CARD} p-4`}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">
          {currentDate.format("[Lịch tháng] M/YYYY")}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 [&_svg]:h-4 [&_svg]:w-4"
          >
            <ChevronLeftOutlined />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 [&_svg]:h-4 [&_svg]:w-4"
          >
            <ChevronRightOutlined />
          </button>
        </div>
      </div>
      <WidgetState isLoading={loading}>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="text-[10px] text-slate-400">
            {label}
          </span>
        ))}
        {cells.map((day) => {
          const dateKey = day.format("YYYY-MM-DD");
          const inMonth = day.month() === currentMonth;
          const has = scheduleDates.has(dateKey);
          const isToday = dateKey === today;
          const isSelected = dateKey === selected;
          return (
            <button
              type="button"
              key={dateKey}
              onClick={() => onSelectDay(day)}
              className={classNames(
                "relative mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs",
                isSelected && "bg-brand text-white",
                !isSelected &&
                  isToday &&
                  "font-semibold text-brand ring-1 ring-brand/40",
                !isSelected &&
                  !isToday &&
                  inMonth &&
                  "text-slate-700 hover:bg-slate-100",
                !isSelected && !isToday && !inMonth && "text-slate-300",
              )}
            >
              {day.format("D")}
              {has && !isSelected && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-brand" />
              )}
            </button>
          );
        })}
      </div>
      </WidgetState>
    </div>
  );
};

export default MiniCalendar;
