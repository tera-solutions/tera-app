import { useState } from "react";
import moment from "moment";
import {
  BookOpenOutlined,
  Dropdown,
  EllipsisVerticalOutlined,
  EyeOutlined,
  LockClosedOutlined,
  Spin,
  TrashOutlined,
} from "tera-dls";

import EmptyState from "_common/components/EmptyState";
import ErrorRetry from "_common/components/ErrorRetry";
import IconBox from "_common/components/IconBox";
import StatusBadge from "_common/components/StatusBadge";

import type { Lesson } from "../_interface";
import { LESSON_STATUS_META } from "../constants";

/** Falls back to the icon box if `src` is missing or fails to load. */
const LessonAvatar = ({ src }: { src?: string }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <IconBox icon={<BookOpenOutlined />} sizeClassName="h-11 w-11" />;
  }

  return (
    <img
      src={src}
      alt=""
      className="h-11 w-11 shrink-0 rounded-xl object-cover"
      onError={() => setFailed(true)}
    />
  );
};

interface LessonTableProps {
  lessons: Lesson[];
  /** Classroom cover image, shown as the avatar for every row (all lessons belong to the same class). */
  avatarUrl?: string;
  loading?: boolean;
  fetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onView: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}

const LessonTable = ({
  lessons,
  avatarUrl,
  loading,
  fetching,
  isError,
  onRetry,
  onView,
  onDelete,
}: LessonTableProps) => {
  if (isError)
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <ErrorRetry
          onRetry={onRetry}
          message="Không tải được danh sách giáo án"
          iconClassName="h-7 w-7"
        />
      </div>
    );

  if (loading && lessons.length === 0)
    return (
      <Spin spinning>
        <div className="h-[40vh]" />
      </Spin>
    );

  if (!loading && lessons.length === 0)
    return (
      <EmptyState classNameImage="w-32 mx-auto" description="Chưa có bài học nào" />
    );

  return (
    <Spin spinning={loading || fetching}>
      <div className="flex flex-col divide-y divide-slate-100">
        {lessons.map((lesson) => {
          return (
            <div
              key={lesson.id}
              role="button"
              tabIndex={0}
              onClick={() => onView(lesson)}
              onKeyDown={(e) => e.key === "Enter" && onView(lesson)}
              className="flex cursor-pointer items-center gap-3 py-3 hover:bg-slate-50"
            >
              <span className="w-7 shrink-0 text-center text-sm font-semibold text-slate-400">
                {String(lesson.lesson_no).padStart(2, "0")}
              </span>

              <LessonAvatar src={avatarUrl} />

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-medium text-slate-800">
                  {lesson.lesson_title || "—"}
                  {lesson.is_locked && (
                    <LockClosedOutlined className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {lesson.duration ? `Thời gian: ${lesson.duration} phút` : ""}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <StatusBadge name={LESSON_STATUS_META} value={lesson.status} />
                {lesson.date && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    {moment(lesson.date, "YYYY-MM-DD").format("DD/MM/YYYY")}
                  </p>
                )}
              </div>

              <div
                className="flex shrink-0 items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Dropdown
                  trigger="click"
                  menu={{
                    itemClassName: "text-slate-700 hover:bg-brand! hover:text-white!",
                    items: [
                      {
                        key: "view",
                        label: "Xem chi tiết",
                        icon: <EyeOutlined />,
                        onClick: () => onView(lesson),
                      },
                      {
                        key: "cancel",
                        label: "Hủy buổi học",
                        icon: <TrashOutlined />,
                        onClick: () => onDelete(lesson),
                      },
                    ],
                  }}
                >
                  <button
                    type="button"
                    title="Thêm"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 [&_svg]:h-5 [&_svg]:w-5"
                  >
                    <EllipsisVerticalOutlined />
                  </button>
                </Dropdown>
              </div>
            </div>
          );
        })}
      </div>
    </Spin>
  );
};

export default LessonTable;
