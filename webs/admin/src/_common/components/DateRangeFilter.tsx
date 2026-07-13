/* Import: library */
import moment from "moment";
import { RangePicker } from "tera-dls";

interface DateRangeFilterProps {
  /** Ngày bắt đầu, format `YYYY-MM-DD` (rỗng = chưa chọn). */
  from: string;
  /** Ngày kết thúc, format `YYYY-MM-DD` (rỗng = chưa chọn). */
  to: string;
  /** Bấm × xoá → gọi với `("", "")`. */
  onChange: (from: string, to: string) => void;
  placeholder?: [string, string];
  /** Class cho bề rộng ở list page (vd `flex-1 min-w-0 xmd:w-[290px]`). */
  className?: string;
  disabled?: boolean;
}

const PICKER_CLASS =
  "h-9! pr-9! hover:border-blue-700! focus-within:border-blue-700! [&_.tera-picker-active-bar]:bottom-[3px]! [&_.tera-picker-active-bar]:rounded-full! [&_.tera-picker-input]:min-w-0! [&_.tera-picker-input]:flex-1! [&_input]:w-full! [&_input]:text-[12px]! [&_.tera-picker-range-separator]:px-1! xmd:[&_input]:text-[13px]! xmd:[&_.tera-picker-range-separator]:px-2!";

const POPUP_CLASS =
  "max-w-[min(300px,calc(100vw-2.5rem))] max-xmd:min-w-0! [&_.tera-picker-panel-container]:overflow-x-auto! max-xmd:[&_.tera-picker-panels]:flex! max-xmd:[&_.tera-picker-panels]:flex-col! max-xmd:[&_.tera-picker-panels]:w-max-content! max-xmd:[&_.tera-picker-panels>.tera-picker-panel:nth-child(2)]:hidden! max-xmd:[&_.tera-picker-header-next-btn]:visible! max-xmd:[&_.tera-picker-header-super-next-btn]:visible! xmd:max-w-none xmd:[&_.tera-picker-panel-container]:overflow-x-hidden! xmd:[&_.tera-picker-panels]:flex-row";

const DateRangeFilter = ({
  from,
  to,
  onChange,
  placeholder,
  className = "",
  disabled,
}: DateRangeFilterProps) => (
  <RangePicker
    className={`min-w-0 ${PICKER_CLASS} ${className}`}
    classNames={{ popup: POPUP_CLASS }}
    // Không cho gõ tay → mobile không bật bàn phím khi mở lịch.
    inputReadOnly
    disabled={disabled}
    value={
      from && to
        ? [moment(from, "YYYY-MM-DD"), moment(to, "YYYY-MM-DD")]
        : undefined
    }
    format='DD/MM/YYYY'
    placeholder={placeholder}
    allowClear
    onChange={(dates: any) =>
      onChange(
        dates?.[0] ? moment(dates[0]).format("YYYY-MM-DD") : "",
        dates?.[1] ? moment(dates[1]).format("YYYY-MM-DD") : "",
      )
    }
  />
);

export default DateRangeFilter;
