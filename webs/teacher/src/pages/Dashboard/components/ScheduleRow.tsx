import type { ScheduleItem } from "_common/types/schedule";
import { SCHEDULE_STATUS } from "_common/constants/schedule";

const ScheduleRow = ({ item }: { item: ScheduleItem }) => {
  const status = SCHEDULE_STATUS[item.status] ?? SCHEDULE_STATUS.upcoming;
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-14 shrink-0 text-center">
        <p className="text-sm font-semibold text-slate-800">
          {item.start_time}
        </p>
        <p className="text-[11px] text-slate-400">{item.end_time}</p>
      </div>
      <span className={`h-9 w-1 rounded-full ${status.bar}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">
          {item.class_name}
        </p>
        <p className="truncate text-xs text-slate-400">
          {[item.level, item.room].filter(Boolean).join(" · ")}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${status.badge}`}
      >
        {status.label}
      </span>
    </div>
  );
};

export default ScheduleRow;
