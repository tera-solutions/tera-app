import type { LessonActivity } from "../_interface";

interface ActivityTimelineProps {
  activities: LessonActivity[];
}

const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
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
          key={index}
          className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-brand">
            {index + 1}
          </span>
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
        </li>
      ))}
    </ol>
  );
};

export default ActivityTimeline;
