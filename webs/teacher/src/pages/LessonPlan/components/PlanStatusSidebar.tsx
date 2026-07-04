import { observer } from "mobx-react-lite";

import DonutStatsCard from "_common/components/DonutStatsCard";
import { useMeta } from "_common/hooks/useMeta";

import type { PlanStats } from "../_interface";
import { LESSON_PLAN_STATUS_META } from "../constants";

interface PlanStatusSidebarProps {
  stats: PlanStats;
}

/**
 * The donut's segments. `in_review` is a synthetic bucket (draft + reviewing
 * combined) with no metadata entry of its own, so it composes both labels and
 * borrows draft's color; the other two map straight onto a real status.
 */
const SEGMENTS: {
  key: string;
  metaValues: string[];
  fallbackColor: string;
  value: (stats: PlanStats) => number;
}[] = [
  { key: "published", metaValues: ["published"], fallbackColor: "#10b981", value: (s) => s.published },
  { key: "in_review", metaValues: ["draft", "reviewing"], fallbackColor: "#f59e0b", value: (s) => s.in_review },
  { key: "archived", metaValues: ["archived"], fallbackColor: "#cbd5e1", value: (s) => s.archived },
];

const PlanStatusSidebar = observer(({ stats }: PlanStatusSidebarProps) => {
  const { getLabel, getItem } = useMeta();

  const rate = stats.total
    ? Math.round((stats.published / stats.total) * 100)
    : 0;

  const legend = SEGMENTS.map(({ key, metaValues, fallbackColor, value }) => ({
    key,
    label: metaValues.map((v) => getLabel(LESSON_PLAN_STATUS_META, v)).join(" / "),
    color: getItem(LESSON_PLAN_STATUS_META, metaValues[0])?.color ?? fallbackColor,
    value: value(stats),
  }));

  return (
    <DonutStatsCard
      title="Trạng thái giáo án"
      legend={legend}
      centerValue={`${rate}%`}
      centerCaption={getLabel(LESSON_PLAN_STATUS_META, "published")}
    />
  );
});

export default PlanStatusSidebar;
