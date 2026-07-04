import { observer } from "mobx-react-lite";
import classNames from "classnames";

import { useMeta } from "_common/hooks/useMeta";

import { getClassColor } from "../constants";
import type { ScheduleItem } from "../_interface";

interface ScheduleBlockProps {
  item: ScheduleItem;
  onClick: (item: ScheduleItem) => void;
  compact?: boolean;
  style?: React.CSSProperties;
}

const subtitle = (item: ScheduleItem): string =>
  [item.room, item.teacher_name].filter(Boolean).join(" • ");

const ScheduleBlock = observer(({
  item,
  onClick,
  compact,
  style,
}: ScheduleBlockProps) => {
  const { getItem } = useMeta();
  const color = getClassColor(item.class_id);
  const status = getItem("class_session_status", item.status);

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onClick(item)}
        style={style}
        className={classNames(
          "flex w-full items-center gap-1 truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium",
          color.block,
          color.text,
        )}
        title={`${item.start_time} ${item.class_name}`}
      >
        <span
          className={classNames(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            color.accent,
          )}
        />
        <span className="truncate">
          {item.start_time} {item.class_name}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      style={style}
      className={classNames(
        "flex w-full flex-col gap-0.5 overflow-hidden rounded-md border border-l-[3px] p-2 text-left transition-shadow hover:shadow-md",
        color.block,
      )}
    >
      <span className="truncate text-xs font-semibold text-slate-800">
        {item.class_name}
      </span>
      {subtitle(item) && (
        <span className="truncate text-[10px] text-slate-500">
          {subtitle(item)}
        </span>
      )}
      <span
        className="mt-0.5 w-fit rounded px-1.5 py-0.5 text-[9px] font-medium"
        style={{ color: status?.color, backgroundColor: status?.backgroundColor }}
      >
        {status?.label ?? item.status}
      </span>
    </button>
  );
});

export default ScheduleBlock;
