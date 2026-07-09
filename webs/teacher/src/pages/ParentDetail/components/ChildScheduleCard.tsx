import { toTime } from "_common/utils/schedule";
import { WEEKDAY_LABEL } from "pages/RoomDetail/constants";

import type { ScheduleSlot } from "../_interface";

interface ChildScheduleCardProps {
  childName: string;
  schedules: ScheduleSlot[];
  isLoading?: boolean;
}

/**
 * Weekly recurring schedule (`edu_class_schedules`) — there's no per-student
 * dated "upcoming sessions" endpoint, so this shows the real weekday/time
 * pattern of the child's class rather than fabricated calendar dates.
 */
const ChildScheduleCard = ({ childName, schedules, isLoading }: ChildScheduleCardProps) => {
  if (isLoading) return <div className="h-24 animate-pulse rounded-xl bg-slate-50" />;

  if (schedules.length === 0)
    return <p className="py-6 text-center text-sm text-slate-400">Chưa có lịch học</p>;

  return (
    <div className="flex flex-col gap-2">
      {childName && <p className="text-xs text-slate-400">Con: {childName}</p>}
      {schedules.map((s, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm"
        >
          <span className="font-medium text-slate-700">
            {toTime(s.start_time)} - {toTime(s.end_time)}
          </span>
          <span className="text-xs text-slate-500">{WEEKDAY_LABEL[s.weekday] ?? "—"}</span>
        </div>
      ))}
    </div>
  );
};

export default ChildScheduleCard;
