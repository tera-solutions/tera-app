import { observer } from "mobx-react-lite";
import { DocumentTextOutlined } from "tera-dls";

import EmptyState from "_common/components/EmptyState";
import IconBox from "_common/components/IconBox";
import StatusBadge from "_common/components/StatusBadge";
import { useMeta } from "_common/hooks/useMeta";

import type { Lesson } from "pages/LessonPlan/_interface";
import { LESSON_STATUS_META } from "pages/LessonPlan/constants";

interface CourseLessonListProps {
  lessons: Lesson[];
  loading?: boolean;
  onView: (lesson: Lesson) => void;
}

/**
 * No per-lesson numeric completion % exists on the backend (only a real
 * `status` enum), so each row uses a status-colored left border instead of a
 * fabricated progress bar — same "at a glance" intent as the mockup's
 * color-coded bars, grounded in real data.
 */
const CourseLessonList = observer(({ lessons, loading, onView }: CourseLessonListProps) => {
  const { getItem } = useMeta();

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-50" />
        ))}
      </div>
    );
  }

  if (lessons.length === 0) {
    return <EmptyState description="Lớp học chưa có buổi học nào được tạo" className="py-8" />;
  }

  return (
    <div className="flex flex-col divide-y divide-slate-100">
      {lessons.map((lesson) => {
        const color = getItem(LESSON_STATUS_META, lesson.status)?.color ?? "#cbd5e1";
        return (
          <button
            key={lesson.id}
            type="button"
            onClick={() => onView(lesson)}
            className="flex w-full items-center gap-3 py-3 text-left hover:bg-slate-50"
            style={{ borderLeft: `3px solid ${color}` }}
          >
            <span className="w-7 shrink-0 pl-2 text-center text-sm font-semibold text-slate-400">
              {String(lesson.lesson_no).padStart(2, "0")}
            </span>

            <IconBox icon={<DocumentTextOutlined />} sizeClassName="h-10 w-10" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">
                {lesson.lesson_title || "—"}
              </p>
              <p className="truncate text-xs text-slate-400">
                {lesson.date ? lesson.date : "Chưa xếp lịch"}
              </p>
            </div>

            <StatusBadge name={LESSON_STATUS_META} value={lesson.status} />
          </button>
        );
      })}
    </div>
  );
});

export default CourseLessonList;
