import { useNavigate } from "react-router-dom";
import { CalendarDaysOutlined, ClockOutlined } from "tera-dls";

import { CARD } from "_common/constants/dashboard";
import IconBox from "_common/components/IconBox";
import { PATHS } from "_common/components/Layout/Menu/menus";
import WidgetState from "_common/components/WidgetState";
import { WEEKDAY_LABEL } from "pages/Classroom/_utils";

import type { ScheduleSlot } from "../_interface";

interface UpcomingSessionsProps {
  schedules: ScheduleSlot[];
}

const UpcomingSessions = ({ schedules }: UpcomingSessionsProps) => {
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
        isEmpty={schedules.length === 0}
        emptyText="Chưa xếp lịch cho lớp này"
      >
        <div className="flex flex-col divide-y divide-slate-100">
          {schedules.map((slot, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <IconBox
                icon={<CalendarDaysOutlined />}
                sizeClassName="h-9 w-9"
                roundedClassName="rounded-lg"
                iconSizeClassName="[&_svg]:h-4.5 [&_svg]:w-4.5"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">
                  {WEEKDAY_LABEL[slot.weekday] ?? "—"}
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-400 [&_svg]:h-3.5 [&_svg]:w-3.5">
                  <ClockOutlined />
                  {slot.start_time} - {slot.end_time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </WidgetState>
    </div>
  );
};

export default UpcomingSessions;
