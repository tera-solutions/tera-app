import { observer } from "mobx-react-lite";

import DonutStatsCard from "_common/components/DonutStatsCard";
import { useMeta } from "_common/hooks/useMeta";

import type { PlanStats } from "../_interface";
import { LESSON_PLAN_STATUS_META } from "../constants";

interface PlanStatusSidebarProps {
  stats: PlanStats;
}

const PlanStatusSidebar = observer(({ stats }: PlanStatusSidebarProps) => {
  const { getLabel } = useMeta();

  const rate = stats.total
    ? Math.round((stats.published / stats.total) * 100)
    : 0;

  const legend = [
    {
      key: "published",
      label: getLabel(LESSON_PLAN_STATUS_META, "published"),
      color: "#10b981",
      value: stats.published,
    },
    {
      key: "in_review",
      label: `${getLabel(LESSON_PLAN_STATUS_META, "draft")} / ${getLabel(
        LESSON_PLAN_STATUS_META,
        "reviewing",
      )}`,
      color: "#f59e0b",
      value: stats.in_review,
    },
    {
      key: "archived",
      label: getLabel(LESSON_PLAN_STATUS_META, "archived"),
      color: "#cbd5e1",
      value: stats.archived,
    },
  ];

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
