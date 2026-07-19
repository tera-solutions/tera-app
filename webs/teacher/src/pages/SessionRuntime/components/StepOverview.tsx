import { CARD } from "_common/constants/dashboard";
import ObjectiveList from "pages/Lesson/components/ObjectiveList";
import type { ClassroomDetail } from "pages/ClassroomDetail/_interface";
import type { LessonPlan } from "pages/LessonPlan/_interface";

import ClassroomCard from "./ClassroomCard";
import LessonPlanCard from "./LessonPlanCard";

interface StepOverviewProps {
  classId?: number;
  classRoomLoading: boolean;
  classRoom?: ClassroomDetail;
  onViewClassroom: () => void;
  lessonPlanId?: number | null;
  lessonPlanLoading: boolean;
  lessonPlan?: LessonPlan;
  onViewLessonPlan: () => void;
  objectives: string[];
}

const StepOverview = ({
  classId,
  classRoomLoading,
  classRoom,
  onViewClassroom,
  lessonPlanId,
  lessonPlanLoading,
  lessonPlan,
  onViewLessonPlan,
  objectives,
}: StepOverviewProps) => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ClassroomCard
        loading={classRoomLoading}
        classId={classId}
        classRoom={classRoom}
        onViewDetail={onViewClassroom}
      />
      <LessonPlanCard
        loading={lessonPlanLoading}
        lessonPlanId={lessonPlanId}
        lessonPlan={lessonPlan}
        onView={onViewLessonPlan}
      />
    </div>
    <div className={`${CARD} p-4`}>
      <p className="mb-3 text-sm font-semibold text-slate-700">Mục tiêu buổi học</p>
      <ObjectiveList objectives={objectives} />
    </div>
  </div>
);

export default StepOverview;
