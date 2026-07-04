import moment from "moment";
import {
  Button,
  CalendarDaysOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
} from "tera-dls";

import type { ScheduleView } from "../_interface";

interface ScheduleToolbarProps {
  view: ScheduleView;
  currentDate: moment.Moment;
  range?: [moment.Moment, moment.Moment];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const formatRange = (
  view: ScheduleView,
  date: moment.Moment,
  range?: [moment.Moment, moment.Moment],
): string => {
  if (view === "range" && range)
    return `${range[0].format("DD/MM/YYYY")} - ${range[1].format("DD/MM/YYYY")}`;
  if (view === "month") return date.format("[Tháng] MM/YYYY");
  if (view === "day") return date.format("DD/MM/YYYY");
  const start = date.clone().startOf("isoWeek");
  const end = date.clone().endOf("isoWeek");
  return `${start.format("DD/MM/YYYY")} - ${end.format("DD/MM/YYYY")}`;
};

const ScheduleToolbar = ({
  view,
  currentDate,
  range,
  onPrev,
  onNext,
  onToday,
}: ScheduleToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Button
        type="light"
        shape="circle"
        icon={<ChevronLeftOutlined />}
        onClick={onPrev}
      />
      <Button type="light" onClick={onToday}>
        Hôm nay
      </Button>
      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
        <CalendarDaysOutlined className="h-4 w-4 shrink-0 text-slate-400" />
        <span className="truncate">{formatRange(view, currentDate, range)}</span>
      </div>
      <Button
        type="light"
        shape="circle"
        icon={<ChevronRightOutlined />}
        onClick={onNext}
      />
    </div>
  );
};

export default ScheduleToolbar;
