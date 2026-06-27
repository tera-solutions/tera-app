import { useMemo } from "react";
import moment from "moment";
import classNames from "classnames";

import { WEEKDAY_LABELS } from "../constants";
import type { ScheduleItem } from "../_interface";
import ScheduleBlock from "./ScheduleBlock";

interface MonthCalendarProps {
  currentDate: moment.Moment;
  schedules: ScheduleItem[];
  onSelect: (item: ScheduleItem) => void;
  onSelectDay: (date: moment.Moment) => void;
}

const MAX_VISIBLE = 3;

const MonthCalendar = ({
  currentDate,
  schedules,
  onSelect,
  onSelectDay,
}: MonthCalendarProps) => {
  const monthStart = currentDate.clone().startOf("month");
  const gridStart = monthStart.clone().startOf("isoWeek");

  const weeks = useMemo(() => {
    const cells = Array.from({ length: 42 }, (_, i) =>
      gridStart.clone().add(i, "day"),
    );
    return Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridStart.format("YYYY-MM-DD")]);

  const byDate = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>();
    schedules.forEach((item) => {
      const list = map.get(item.date) ?? [];
      list.push(item);
      map.set(item.date, list);
    });
    return map;
  }, [schedules]);

  const today = moment().format("YYYY-MM-DD");
  const currentMonth = monthStart.month();

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-slate-100">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-2 text-center text-[11px] font-medium text-slate-400"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {weeks.flat().map((day) => {
          const dateKey = day.format("YYYY-MM-DD");
          const items = byDate.get(dateKey) ?? [];
          const isCurrentMonth = day.month() === currentMonth;
          const isToday = dateKey === today;
          return (
            <button
              type="button"
              key={dateKey}
              onClick={() => onSelectDay(day)}
              className={classNames(
                "flex min-h-[96px] flex-col gap-1 border-b border-l border-slate-100 p-1 text-left align-top",
                !isCurrentMonth && "bg-slate-50/60",
              )}
            >
              <span
                className={classNames(
                  "ml-auto flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday
                    ? "bg-brand text-white"
                    : isCurrentMonth
                      ? "text-slate-700"
                      : "text-slate-300",
                )}
              >
                {day.format("DD")}
              </span>
              <div className="flex flex-col gap-0.5">
                {items.slice(0, MAX_VISIBLE).map((item) => (
                  <ScheduleBlock
                    key={item.id}
                    item={item}
                    onClick={onSelect}
                    compact
                  />
                ))}
                {items.length > MAX_VISIBLE && (
                  <span className="px-1 text-[10px] font-medium text-brand">
                    Xem thêm +{items.length - MAX_VISIBLE}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
