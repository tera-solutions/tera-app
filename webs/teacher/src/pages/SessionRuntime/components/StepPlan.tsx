import { CARD } from "_common/constants/dashboard";
import ActivityTimeline from "pages/Lesson/components/ActivityTimeline";
import type { LessonActivity } from "pages/Lesson/_interface";

interface StepPlanProps {
  loading: boolean;
  activities: LessonActivity[];
}

/** Read-only preview of the day's activities before attendance/lesson start. */
const StepPlan = ({ loading, activities }: StepPlanProps) => (
  <div className={`${CARD} p-4`}>
    <p className="mb-3 text-sm font-semibold text-slate-700">Kế hoạch hoạt động</p>
    {loading ? (
      <p className="text-sm text-slate-400">Đang tải...</p>
    ) : (
      <ActivityTimeline activities={activities} />
    )}
  </div>
);

export default StepPlan;
