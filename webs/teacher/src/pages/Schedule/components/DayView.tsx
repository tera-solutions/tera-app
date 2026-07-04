import { useMemo } from "react";
import moment from "moment";

import StatusBadge from "_common/components/StatusBadge";

import { getClassColor } from "../constants";
import type { ScheduleItem } from "../_interface";

interface DayViewProps {
  currentDate: moment.Moment;
  schedules: ScheduleItem[];
  onSelect: (item: ScheduleItem) => void;
}

const DayView = ({ currentDate, schedules, onSelect }: DayViewProps) => {
  const dateKey = currentDate.format("YYYY-MM-DD");

  const items = useMemo(
    () =>
      schedules
        .filter((item) => item.date === dateKey)
        .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [schedules, dateKey],
  );

  if (items.length === 0) {
    return <div className="min-h-[40vh]" />;
  }

  return (
    <div className="flex flex-col gap-2.5 p-1">
      {items.map((item) => {
        const color = getClassColor(item.class_id);
        return (
          <button
            type="button"
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex items-stretch gap-3 rounded-xl border border-slate-100 bg-white p-3 text-left shadow-sm hover:shadow-md"
          >
            <div className="w-12 shrink-0 text-center">
              <p className="text-sm font-semibold text-slate-800">
                {item.start_time}
              </p>
              <p className="text-[11px] text-slate-400">{item.end_time}</p>
            </div>
            <span className={`w-1 shrink-0 rounded-full ${color.accent}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {item.class_name}
              </p>
              <p className="truncate text-xs text-slate-400">
                {[item.session_name, item.room, item.teacher_name]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <StatusBadge name="class_session_status" value={item.status} />
          </button>
        );
      })}
    </div>
  );
};

export default DayView;
