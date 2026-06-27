import { PATHS } from "_common/components/Layout/Menu/menus";

import { QUICK_ACTIONS } from "../constants";
import { useDashboardSummary } from "../hooks";
import QuickActionCard from "./QuickActionCard";

const QuickActions = () => {
  const { data } = useDashboardSummary();
  const homeworkCount = data?.homework_pending?.length ?? 0;

  return (
    <div className="grid grid-cols-4 gap-3">
      {QUICK_ACTIONS.map((action) => (
        <QuickActionCard
          key={action.label}
          {...action}
          badge={action.to === PATHS.homework ? homeworkCount : undefined}
        />
      ))}
    </div>
  );
};

export default QuickActions;
