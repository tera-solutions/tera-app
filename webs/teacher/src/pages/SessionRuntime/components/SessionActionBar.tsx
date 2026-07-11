import { Button, CheckOutlined, PlayOutlined } from "tera-dls";

import type { ScheduleStatus } from "_common/types/schedule";

interface SessionActionBarProps {
  status: ScheduleStatus;
  isStarting: boolean;
  isEnding: boolean;
  onStart: () => void;
  onEnd: () => void;
  hasAttendance: boolean;
  attendanceLoading: boolean;
  hasLesson: boolean;
  lessonLoading: boolean;
}

const SessionActionBar = ({
  status,
  isStarting,
  isEnding,
  onStart,
  onEnd,
  hasAttendance,
  attendanceLoading,
  hasLesson,
  lessonLoading,
}: SessionActionBarProps) => {
  const isUpcoming = status === "upcoming";

  return (
    <>
      <div className="mt-6 border-t border-slate-100 pt-4">
        {status === "completed" || status === "cancelled" ? (
          <Button type="alternative" disabled className="w-full" icon={<CheckOutlined />}>
            {status === "cancelled" ? "Buổi học đã hủy" : "Buổi học đã kết thúc"}
          </Button>
        ) : status === "ongoing" ? (
          <Button
            type="success"
            icon={<CheckOutlined />}
            onClick={onEnd}
            loading={isEnding}
            className="w-full"
          >
            Kết thúc buổi học
          </Button>
        ) : (
          <Button
            icon={<PlayOutlined />}
            onClick={onStart}
            loading={isStarting}
            disabled={!hasAttendance || attendanceLoading || !hasLesson || lessonLoading}
            className="w-full bg-brand hover:bg-brand/80"
          >
            Bắt đầu buổi học
          </Button>
        )}
      </div>
      {isUpcoming && !lessonLoading && !hasLesson && (
        <p className="mt-2 text-right text-xs text-slate-400">
          Chưa có bài học được sinh cho buổi học này.
        </p>
      )}
      {isUpcoming && hasLesson && !attendanceLoading && !hasAttendance && (
        <p className="mt-2 text-right text-xs text-slate-400">
          Cần điểm danh trước khi bắt đầu buổi học.
        </p>
      )}
    </>
  );
};

export default SessionActionBar;
