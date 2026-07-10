import moment from "moment";
import { CalendarOutlined, RangePicker } from "tera-dls";

export interface DateRangeValue {
  from: Date;
  to: Date;
}

interface DateRangeFilterProps {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
  pickerHeightClassName?: string;
  className?: string;
}

const DateRangeFilter = ({
  value,
  onChange,
  pickerHeightClassName = "h-9!",
  className,
}: DateRangeFilterProps) => (
  <RangePicker
    className={`${pickerHeightClassName} min-w-[200px] max-w-[260px] flex-1 rounded-lg! border-slate-200! pr-9! transition-colors hover:border-blue-700! focus-within:border-blue-700! [&_.tera-picker-active-bar]:bottom-[3px]! [&_.tera-picker-active-bar]:rounded-full! [&_.tera-picker-input]:min-w-0! [&_.tera-picker-input]:flex-1! [&_.tera-picker-range-separator]:px-1! [&_input]:w-full! [&_input]:text-[12px]! [&_input]:text-slate-600 xmd:[&_.tera-picker-range-separator]:px-2! xmd:[&_input]:text-[13px]! ${className ?? ""}`}
    inputReadOnly
    allowClear={false}
    classNames={{
      popup:
        "max-w-[min(300px,calc(100vw-2.5rem))] [&_.tera-picker-panel-container]:overflow-x-auto! [&_.tera-picker-panels]:flex-col xmd:max-w-none xmd:[&_.tera-picker-panel-container]:overflow-x-hidden! xmd:[&_.tera-picker-panels]:flex-row",
    }}
    suffixIcon={<CalendarOutlined className='h-3.5 w-3.5 text-slate-400' />}
    value={[moment(value.from), moment(value.to)]}
    format='DD/MM/YYYY'
    onChange={(dates: any) => {
      if (!dates?.[0] || !dates?.[1]) return;
      onChange({
        from: moment(dates[0]).startOf("day").toDate(),
        to: moment(dates[1]).startOf("day").toDate(),
      });
    }}
  />
);

export default DateRangeFilter;
