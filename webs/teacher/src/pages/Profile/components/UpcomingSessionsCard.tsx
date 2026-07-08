import moment from "moment";

import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";
import type { ScheduleItem } from "_common/types/schedule";

interface UpcomingSessionsCardProps {
  title: string;
  sessions: ScheduleItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const UpcomingSessionsCard = ({
  title,
  sessions,
  isLoading,
  isError,
  onRetry,
}: UpcomingSessionsCardProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-700">{title}</p>
    <WidgetState
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && !isError && sessions.length === 0}
      emptyText="Không có buổi dạy nào trong khoảng thời gian này"
      onRetry={onRetry}
    >
      <div className="flex flex-col divide-y divide-slate-100">
        {sessions.slice(0, 6).map((s) => (
          <div key={s.id} className="flex items-center justify-between py-2 text-sm">
            <div>
              <p className="font-medium text-slate-700">{s.class_name}</p>
              <p className="text-xs text-slate-400">
                {s.start_time} - {s.end_time}
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {moment(s.date).format("DD/MM")}
            </span>
          </div>
        ))}
      </div>
    </WidgetState>
  </Card>
);

export default UpcomingSessionsCard;
