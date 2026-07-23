import moment from "moment";

import { CARD } from "_common/constants/dashboard";
import ActivityTimeline from "pages/Lesson/components/ActivityTimeline";
import LessonNote from "pages/Lesson/components/LessonNote";
import SessionTimer from "pages/RoomDetail/components/SessionTimer";
import type { LessonActivity } from "pages/Lesson/_interface";

interface StepLessonProps {
  loading: boolean;
  activities: LessonActivity[];
  onStart: (id: LessonActivity["id"]) => void;
  onComplete: (id: LessonActivity["id"]) => void;
  activeActivityStartedAt: moment.Moment | null;
  activityUpdating: boolean;
  lessonId: number | null;
  lessonNote: string;
}

const StepLesson = ({
  loading,
  activities,
  onStart,
  onComplete,
  activeActivityStartedAt,
  activityUpdating,
  lessonId,
  lessonNote,
}: StepLessonProps) => {
  const activeActivity = activities.find((a) => a.status === "in_progress");

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
      <div className={`${CARD} p-4`}>
        <p className="mb-3 text-sm font-semibold text-slate-700">Hoạt động buổi học</p>
        {loading ? (
          <p className="text-sm text-slate-400">Đang tải...</p>
        ) : (
          <ActivityTimeline activities={activities} onStart={onStart} onComplete={onComplete} />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {activeActivity && activeActivityStartedAt && (
          <div className={`${CARD} p-4`}>
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Đang diễn ra: {activeActivity.name}
            </p>
            <SessionTimer
              startAt={activeActivityStartedAt}
              onStop={() => onComplete(activeActivity.id)}
              stopping={activityUpdating}
            />
          </div>
        )}

        {lessonId && (
          <div className={`${CARD} p-4`}>
            <p className="mb-3 text-sm font-semibold text-slate-700">Ghi chú nhanh</p>
            <LessonNote lessonId={lessonId} initialNote={lessonNote} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StepLesson;
