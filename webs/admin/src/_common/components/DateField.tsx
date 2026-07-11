/* Import: library */
import moment from "moment";
import { Controller } from "react-hook-form";
import { DatePicker } from "tera-dls";

/* Import: packages */
import { useTeraForm } from "@tera/components/dof/FormTera/TeraFormContext";
import { useTeraFormItem } from "@tera/components/dof/FormTera/TeraItemContext";

interface DatePickerFieldProps {
  /** Chuỗi `YYYY-MM-DD` (rỗng = chưa chọn). */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  /** Chặn chọn ngày trong tương lai (mặc định bật — dùng cho ngày sinh). */
  disableFuture?: boolean;
  /** Chặn chọn trước ngày này (chuỗi `YYYY-MM-DD`) — vd ngày kết thúc ≥ ngày bắt đầu. */
  minDate?: string;
  allowClear?: boolean;
  className?: string;
}

const buildDisabledDate = (disableFuture: boolean, minDate?: string) => {
  if (!disableFuture && !minDate) return undefined;
  return (d: any) => {
    if (!d) return false;
    if (disableFuture && d.isAfter(moment(), "day")) return true;
    if (minDate && d.isBefore(moment(minDate, "YYYY-MM-DD"), "day")) return true;
    return false;
  };
};

/**
 * Ô chọn ngày thuần `value`/`onChange` — dùng ở component KHÔNG có `FormTera`
 * (modal, bảng, state cục bộ). Cùng vai trò với `SelectField` so với `Select`.
 */
export const DatePickerField = ({
  value,
  onChange,
  disabled,
  placeholder = "dd/mm/yyyy",
  disableFuture = true,
  minDate,
  allowClear = true,
  className = "w-full",
}: DatePickerFieldProps) => (
  <DatePicker
    className={className}
    format="DD/MM/YYYY"
    placeholder={placeholder}
    disabled={disabled}
    allowClear={allowClear}
    disabledDate={buildDisabledDate(disableFuture, minDate)}
    value={value ? moment(value, "YYYY-MM-DD") : undefined}
    onChange={(date: any) => onChange(date ? moment(date).format("YYYY-MM-DD") : "")}
  />
);

type DateFieldProps = Omit<DatePickerFieldProps, "value" | "onChange">;

/**
 * Ô chọn ngày cho form, dùng `DatePicker` của tera-dls thay cho `<input type="date">` native.
 *
 * Wire sẵn vào `FormTera`/`FormTeraItem` qua `Controller` (giống `dof/Control/Select`) → thả
 * thẳng vào `<FormTeraItem name="dob">` là chạy. Ngoài form → dùng `DatePickerField`.
 *
 * ⚠️ KHÔNG dùng `@tera/components/dof/Control/DatePicker` cho các form này: nó lưu **object
 * moment** vào form state, còn form ở đây lưu **chuỗi `YYYY-MM-DD`** (yup schema + payload API +
 * `reset()` từ detail đều theo chuỗi). Component này quy đổi chuỗi ↔ moment ở hai đầu.
 */
const DateField = (props: DateFieldProps) => {
  const { form } = useTeraForm();
  const { item, rules } = useTeraFormItem();

  return (
    <Controller
      control={form.control}
      rules={rules}
      {...item}
      render={({ field }) => (
        <DatePickerField
          {...props}
          value={field.value ? String(field.value) : ""}
          onChange={field.onChange}
        />
      )}
    />
  );
};

export default DateField;
