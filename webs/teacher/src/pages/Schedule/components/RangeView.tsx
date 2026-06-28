import { useMemo } from "react";
import moment from "moment";
import { Empty } from "tera-dls";

import { SCHEDULE_STATUS } from "_common/constants/schedule";

import { getClassColor, WEEKDAY_FULL } from "../constants";
import type { ScheduleItem } from "../_interface";

interface RangeViewProps {
  schedules: ScheduleItem[];
  onSelect: (item: ScheduleItem) => void;
  emptyText?: string;
}

const formatHeader = (date: string): string => {
  const m = moment(date, "YYYY-MM-DD");
  if (!m.isValid()) return date;
  return `${WEEKDAY_FULL[(m.isoWeekday() - 1 + 7) % 7]}, ${m.format("DD/MM/YYYY")}`;
};

const RangeView = ({
  schedules,
  onSelect,
  emptyText = "Không có lịch dạy trong khoảng đã chọn",
}: RangeViewProps) => {
  const groups = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>();
    schedules.forEach((item) => {
      const arr = map.get(item.date) ?? [];
      arr.push(item);
      map.set(item.date, arr);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([date, items]) =>
          [
            date,
            items.sort((x, y) => x.start_time.localeCompare(y.start_time)),
          ] as const,
      );
  }, [schedules]);

  if (groups.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Empty description={emptyText} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-1">
      {groups.map(([date, items]) => (
        <div key={date}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {formatHeader(date)}
          </p>
          <div className="flex flex-col gap-2.5">
            {items.map((item) => {
              const color = getClassColor(item.class_id);
              const status =
                SCHEDULE_STATUS[item.status] ?? SCHEDULE_STATUS.upcoming;
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
                  <span
                    className={`h-fit shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${status.badge}`}
                  >
                    {status.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RangeView;
