import { Button, CheckOutlined, PlayOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import StatusBadge from "_common/components/StatusBadge";

import type { LessonActivity } from "../_interface";
import { LESSON_ACTIVITY_STATUS_META } from "../constants";

interface ActivityTimelineProps {
  activities: LessonActivity[];
  /** When provided, each row exposes Start/Complete controls (session-local). */
  onStart?: (activityId: LessonActivity["id"]) => void;
  onComplete?: (activityId: LessonActivity["id"]) => void;
}

const ActivityTimeline = ({
  activities,
  onStart,
  onComplete,
}: ActivityTimelineProps) => {
  const interactive = !!onStart || !!onComplete;

  if (activities.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        Chưa có hoạt động nào trong bài học này.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-2">
      {activities.map((activity, index) => (
        <li
          key={activity.id}
          className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
            activity.status === "in_progress"
              ? "border-brand bg-sky-50/60"
              : "border-slate-100"
          }`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-brand">
            {index + 1}
          </span>
          {activity.avatar && (
            <Avatar src={activity.avatar} alt={activity.name} sizeClassName="h-7 w-7" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-700">
              {activity.name}
              {activity.duration > 0 && (
                <span className="ml-1 font-normal text-slate-400">
                  ({activity.duration} phút)
                </span>
              )}
            </p>
            {activity.description && (
              <p className="mt-0.5 text-xs text-slate-500">
                {activity.description}
              </p>
            )}
          </div>

          <StatusBadge
            name={LESSON_ACTIVITY_STATUS_META}
            value={activity.status}
            className="shrink-0"
          />

          {interactive && activity.status === "pending" && (
            <Button
              icon={<PlayOutlined />}
              onClick={() => onStart?.(activity.id)}
              className="shrink-0 whitespace-nowrap bg-brand hover:bg-brand/80"
            >
              Bắt đầu
            </Button>
          )}
          {interactive && activity.status === "in_progress" && (
            <Button
              type="success"
              icon={<CheckOutlined />}
              onClick={() => onComplete?.(activity.id)}
              className="shrink-0 whitespace-nowrap"
            >
              Kết thúc
            </Button>
          )}
        </li>
      ))}
    </ol>
  );
};

export default ActivityTimeline;
