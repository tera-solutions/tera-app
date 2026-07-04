import { useMemo } from "react";
import moment from "moment";
import classNames from "classnames";

import { WEEKDAY_FULL, toMinutes } from "../constants";
import type { ScheduleItem } from "../_interface";
import ScheduleBlock from "./ScheduleBlock";

interface WeekCalendarProps {
  currentDate: moment.Moment;
  schedules: ScheduleItem[];
  onSelect: (item: ScheduleItem) => void;
}

const WeekCalendar = ({
  currentDate,
  schedules,
  onSelect,
}: WeekCalendarProps) => {
  const weekStart = useMemo(
    () => currentDate.clone().startOf("isoWeek"),
    [currentDate],
  );

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => weekStart.clone().add(i, "day")),
    [weekStart],
  );

  /** Distinct time slots present in the week, ordered by start time. */
  const slots = useMemo(() => {
    const map = new Map<string, { start: string; end: string }>();
    schedules.forEach((item) => {
      const key = `${item.start_time}-${item.end_time}`;
      if (!map.has(key))
        map.set(key, { start: item.start_time, end: item.end_time });
    });
    return Array.from(map.values()).sort(
      (a, b) => toMinutes(a.start) - toMinutes(b.start),
    );
  }, [schedules]);

  /** schedules indexed by "date|start-end" so each cell is an O(1) lookup. */
  const byCell = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>();
    schedules.forEach((item) => {
      const key = `${item.date}|${item.start_time}-${item.end_time}`;
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    });
    return map;
  }, [schedules]);

  const today = moment().format("YYYY-MM-DD");
  const focused = currentDate.format("YYYY-MM-DD");

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        {/* Header row */}
        <div className="grid grid-cols-[72px_repeat(7,1fr)] overflow-hidden rounded-t-lg border border-slate-100 bg-slate-50/60">
          <div />
          {days.map((day, idx) => {
            const dateKey = day.format("YYYY-MM-DD");
            const isFocused = dateKey === focused;
            const isToday = dateKey === today;
            return (
              <div
                key={dateKey}
                className={classNames(
                  "py-2 text-center",
                  isFocused && "bg-brand text-white",
                )}
              >
                <p
                  className={classNames(
                    "text-xs font-medium",
                    isFocused
                      ? "text-white"
                      : isToday
                        ? "text-brand"
                        : "text-slate-600",
                  )}
                >
                  {WEEKDAY_FULL[idx]}
                </p>
                <p
                  className={classNames(
                    "text-[11px]",
                    isFocused ? "text-white/90" : "text-slate-400",
                  )}
                >
                  {day.format("DD/MM")}
                </p>
              </div>
            );
          })}
        </div>

        {/* Slot rows */}
        <div className="border-x border-b border-slate-100">
          {slots.length === 0 && (
            <div className="grid min-h-[240px] grid-cols-[72px_repeat(7,1fr)]">
              <div />
              {days.map((day) => (
                <div
                  key={day.format("YYYY-MM-DD")}
                  className="border-l border-slate-100"
                />
              ))}
            </div>
          )}
          {slots.map((slot) => (
            <div
              key={`${slot.start}-${slot.end}`}
              className="grid grid-cols-[72px_repeat(7,1fr)] border-t border-slate-100 first:border-t-0"
            >
              <div className="flex flex-col items-center justify-center py-3 text-center">
                <span className="text-xs font-semibold text-slate-700">
                  {slot.start}
                </span>
                <span className="text-[11px] text-slate-400">{slot.end}</span>
              </div>
              {days.map((day) => {
                const dateKey = day.format("YYYY-MM-DD");
                const items =
                  byCell.get(`${dateKey}|${slot.start}-${slot.end}`) ?? [];
                return (
                  <div
                    key={dateKey}
                    className="flex flex-col gap-1 border-l border-slate-100 p-1"
                  >
                    {items.map((item) => (
                      <ScheduleBlock
                        key={item.id}
                        item={item}
                        onClick={onSelect}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekCalendar;
