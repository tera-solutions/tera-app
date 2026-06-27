import moment from "moment";
import { useNavigate } from "react-router-dom";
import { CalendarDaysOutlined } from "tera-dls";

import { CARD } from "_common/constants/dashboard";
import { PATHS } from "_common/components/Layout/Menu/menus";
import WidgetState from "_common/components/WidgetState";
import { WEEKDAY_FULL } from "pages/Schedule/constants";

import type { ClassSession } from "../_interface";

interface UpcomingSessionsProps {
  sessions: ClassSession[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const dayLabel = (date: string) => {
  const m = moment(date, "YYYY-MM-DD");
  if (!m.isValid()) return "";
  return WEEKDAY_FULL[(m.isoWeekday() - 1 + 7) % 7];
};

const UpcomingSessions = ({
  sessions,
  loading,
  isError,
  onRetry,
}: UpcomingSessionsProps) => {
  const navigate = useNavigate();

  return (
    <div className={`${CARD} p-4`}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Lịch học sắp tới</p>
        <button
          type="button"
          onClick={() => navigate(PATHS.schedule)}
          className="text-xs font-medium text-brand hover:underline"
        >
          Xem lịch đầy đủ
        </button>
      </div>

      <WidgetState
        isLoading={loading}
        isError={isError}
        isEmpty={!loading && sessions.length === 0}
        emptyText="Không có buổi học sắp tới"
        onRetry={onRetry}
      >
        <div className="flex flex-col divide-y divide-slate-100">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-3 py-2.5"
            >
              <div className="w-12 shrink-0 text-center">
                <p className="text-[11px] text-slate-400">
                  {dayLabel(session.date)}
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {moment(session.date, "YYYY-MM-DD").format("DD/MM")}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">
                  {session.name || "Buổi học"}
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-400 [&_svg]:h-3.5 [&_svg]:w-3.5">
                  <CalendarDaysOutlined />
                  {session.start_time} - {session.end_time}
                </p>
              </div>
              {session.session_no != null && (
                <span className="shrink-0 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-brand">
                  Buổi {session.session_no}
                </span>
              )}
            </div>
          ))}
        </div>
      </WidgetState>
    </div>
  );
};

export default UpcomingSessions;
