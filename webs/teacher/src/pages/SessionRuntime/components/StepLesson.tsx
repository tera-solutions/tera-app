import moment from "moment";
import { PencilSquareOutlined } from "tera-dls";

import { CARD } from "_common/constants/dashboard";
import ActivityTimeline from "pages/Lesson/components/ActivityTimeline";
import LessonHomework from "pages/Lesson/components/LessonHomework";
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
  classRoomId: number | null;
  onChangePlan?: () => void;
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
  classRoomId,
  onChangePlan,
}: StepLessonProps) => {
  const activeActivity = activities.find((a) => a.status === "in_progress");

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
      <div className={`${CARD} p-4`}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Hoạt động buổi học</p>
          {lessonId && onChangePlan && (
            <button
              type="button"
              onClick={onChangePlan}
              className="flex items-center gap-1 text-xs font-medium text-brand hover:underline [&_svg]:h-3.5 [&_svg]:w-3.5"
            >
              <PencilSquareOutlined />
              Đổi giáo án / bài học
            </button>
          )}
        </div>
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

        {lessonId && (
          <div className={`${CARD} p-4`}>
            <LessonHomework lessonId={lessonId} classRoomId={classRoomId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StepLesson;
