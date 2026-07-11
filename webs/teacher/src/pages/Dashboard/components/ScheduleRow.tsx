import { observer } from "mobx-react-lite";

import StatusBadge from "_common/components/StatusBadge";
import type { ScheduleItem } from "_common/types/schedule";
import { useMeta } from "_common/hooks/useMeta";
import { getBarClass } from "_common/utils/badgeColor";

const ScheduleRow = observer(({ item }: { item: ScheduleItem }) => {
  const { getItem } = useMeta();
  const bar = getBarClass(getItem("class_session_status", item.status)?.color);

  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-14 shrink-0 text-center">
        <p className="text-sm font-semibold text-slate-800">
          {item.start_time}
        </p>
        <p className="text-[11px] text-slate-400">{item.end_time}</p>
      </div>
      <span className={`h-9 w-1 rounded-full ${bar}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">
          {item.class_name}
        </p>
        <p className="truncate text-xs text-slate-400">
          {[item.level, item.room].filter(Boolean).join(" · ")}
        </p>
      </div>
      <StatusBadge name="class_session_status" value={item.status} />
    </div>
  );
});

export default ScheduleRow;
