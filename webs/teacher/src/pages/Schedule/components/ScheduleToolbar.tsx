import moment from "moment";
import {
  Button,
  CalendarDaysOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  DatePicker,
  RangePicker,
} from "tera-dls";

import type { ScheduleView } from "../_interface";

interface ScheduleToolbarProps {
  view: ScheduleView;
  currentDate: moment.Moment;
  range?: [moment.Moment, moment.Moment];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onSelectDate: (date: moment.Moment) => void;
  onSelectRange: (range: [moment.Moment, moment.Moment]) => void;
}

/** "Danh sách"/"Tuần" show the current ISO week unless a custom range is active. */
const rangeBounds = (
  view: ScheduleView,
  date: moment.Moment,
  range?: [moment.Moment, moment.Moment],
): [moment.Moment, moment.Moment] => {
  if (view === "range" && range) return range;
  return [date.clone().startOf("isoWeek"), date.clone().endOf("isoWeek")];
};

const formatRange = (
  view: ScheduleView,
  date: moment.Moment,
  range?: [moment.Moment, moment.Moment],
): string => {
  if (view === "month") return date.format("[Tháng] MM/YYYY");
  if (view === "day") return date.format("DD/MM/YYYY");
  const [start, end] = rangeBounds(view, date, range);
  return `${start.format("DD/MM/YYYY")} - ${end.format("DD/MM/YYYY")}`;
};

const pickerClassName = "min-w-0 rounded-lg bg-white!";
const pickerInputClassName =
  "rounded-lg border-slate-200 bg-white! px-3 py-1.5 text-sm font-medium text-slate-700";

const ScheduleToolbar = ({
  view,
  currentDate,
  range,
  onPrev,
  onNext,
  onToday,
  onSelectDate,
  onSelectRange,
}: ScheduleToolbarProps) => {
  const isRangePicker = view === "list" || view === "week" || view === "range";

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
      {isRangePicker ? (
        <RangePicker
          className={`${pickerClassName} text-sm font-medium text-slate-700`}
          value={rangeBounds(view, currentDate, range)}
          format="DD/MM/YYYY"
          allowClear={false}
          onChange={(value: any) => {
            if (value?.[0] && value?.[1]) onSelectRange([value[0], value[1]]);
          }}
        />
      ) : (
        <DatePicker
          className={pickerClassName}
          inputClassName={pickerInputClassName}
          prefixIcon={<CalendarDaysOutlined className="h-4 w-4 shrink-0 text-slate-400" />}
          picker={view === "month" ? "month" : "date"}
          value={currentDate}
          format={() => formatRange(view, currentDate, range)}
          allowClear={false}
          onChange={(value: any) => value && onSelectDate(value)}
        />
      )}
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
