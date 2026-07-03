import { observer } from "mobx-react-lite";
import classNames from "classnames";

import Badge from "_common/components/Badge";
import { useMeta } from "_common/hooks/useMeta";

interface StatusBadgeProps {
  /** Metadata list name, e.g. "lesson_status" or "lesson_plan_status". */
  name: string;
  value?: string | null;
  className?: string;
}

/**
 * Renders a status pill from the shared enum metadata, using the label and
 * colors defined by the backend. Falls back to the raw value when unknown.
 */
const StatusBadge = observer(({ name, value, className }: StatusBadgeProps) => {
  const { getItem } = useMeta();
  if (!value) return null;

  const item = getItem(name, value);
  return (
    <Badge
      className={classNames("px-2.5 py-0.5 text-[11px]", className)}
      style={{ color: item?.color, backgroundColor: item?.backgroundColor }}
    >
      {item?.label ?? value}
    </Badge>
  );
});

export default StatusBadge;
