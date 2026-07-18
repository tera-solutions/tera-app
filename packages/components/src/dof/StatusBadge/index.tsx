import { observer } from "mobx-react-lite";
import classNames from "classnames";

import { useStores } from "@tera/stores/useStores";

import Badge from "../Badge";

interface StatusBadgeProps {
  /** Metadata list name, e.g. "lesson_status" or "wallet_request_status" — see
   * `MetadataRegistry` (backend) for the full catalog. Names are unique across
   * every domain group, so no prefix is needed. */
  name: string;
  value?: string | null;
  className?: string;
}

/**
 * Renders a status pill from the shared enum metadata (`/auth/metadata`,
 * loaded once at app bootstrap into `globalStore`), using the label and
 * colors the backend defines — every portal (admin/teacher/parent/student)
 * reads the same catalog, so a new status only needs to be added once, on
 * the backend. Falls back to the raw value when the metadata hasn't loaded
 * yet or the value is unknown, rather than rendering nothing.
 */
const StatusBadge = observer(({ name, value, className }: StatusBadgeProps) => {
  const { globalStore } = useStores();
  if (!value) return null;

  const item = globalStore.getMetaItem(name, value);
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
