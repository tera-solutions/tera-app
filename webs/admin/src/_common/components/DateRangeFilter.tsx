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

/**
 * Chọn khoảng ngày cho bộ lọc list (dùng RangePicker của tera-dls, KHÔNG dùng
 * `<input type="date">` native trên mobile).
 *
 * RangePicker gốc có 6 lỗi hiển thị — các class dưới đây vá đủ cả 6, xem mục
 * "RangePicker — 6 lỗi cố định" trong CLAUDE.md trước khi sửa:
 *  - popup 2 lịch cạnh nhau (580px) tràn mép trái trên mobile → `max-w` + `flex-col`
 *  - `.tera-picker-panel-container` (`overflow-x:hidden`) cắt cột "CN" ở màn ≤340px
 *  - gạch chân `.tera-picker-active-bar` cắt ngang đáy bo tròn
 *  - `.tera-picker-input` rộng cố định 99px → ô ngày thứ 2 chui xuống dưới icon lịch
 *  - chiều cao mặc định 26px lệch với các control cạnh nó
 */
const PICKER_CLASS =
  "h-9! pr-9! hover:border-blue-700! focus-within:border-blue-700! [&_.tera-picker-active-bar]:bottom-[3px]! [&_.tera-picker-active-bar]:rounded-full! [&_.tera-picker-input]:min-w-0! [&_.tera-picker-input]:flex-1! [&_input]:w-full! [&_input]:text-[12px]! [&_.tera-picker-range-separator]:px-1! xmd:[&_input]:text-[13px]! xmd:[&_.tera-picker-range-separator]:px-2!";

const POPUP_CLASS =
  "max-w-[min(300px,calc(100vw-2.5rem))] [&_.tera-picker-panel-container]:overflow-x-auto! [&_.tera-picker-panels]:flex-col xmd:max-w-none xmd:[&_.tera-picker-panel-container]:overflow-x-hidden! xmd:[&_.tera-picker-panels]:flex-row";

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
    format="DD/MM/YYYY"
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
