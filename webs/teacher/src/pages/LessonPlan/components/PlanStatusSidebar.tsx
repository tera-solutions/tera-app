import { observer } from "mobx-react-lite";

import Card from "_common/components/Card";
import { useMeta } from "_common/hooks/useMeta";
import ProgressDonut from "pages/Classroom/components/ProgressDonut";

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
      dot: "bg-emerald-500",
      value: stats.published,
    },
    {
      key: "in_review",
      label: `${getLabel(LESSON_PLAN_STATUS_META, "draft")} / ${getLabel(
        LESSON_PLAN_STATUS_META,
        "reviewing",
      )}`,
      dot: "bg-amber-500",
      value: stats.in_review,
    },
    {
      key: "archived",
      label: getLabel(LESSON_PLAN_STATUS_META, "archived"),
      dot: "bg-slate-300",
      value: stats.archived,
    },
  ];

  return (
    <Card>
      <p className="mb-3 text-sm font-semibold text-slate-700">
        Trạng thái giáo án
      </p>

      <div className="flex flex-col items-center gap-2 py-2">
        <ProgressDonut value={rate} size={120} />
        <p className="text-xs text-slate-400">
          {getLabel(LESSON_PLAN_STATUS_META, "published")}
        </p>
      </div>

      <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
        {legend.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2 text-slate-500">
              <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
              {item.label}
            </span>
            <span className="font-semibold text-slate-700">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
});

export default PlanStatusSidebar;
