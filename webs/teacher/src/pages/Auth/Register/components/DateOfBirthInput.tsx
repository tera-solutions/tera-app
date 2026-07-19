import classNames from "classnames";
import moment from "moment";
import { CalendarDaysOutlined, DatePicker } from "tera-dls";

interface DateOfBirthInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

const DATE_FORMAT = "YYYY-MM-DD";
// Keeps the picker's range aligned with the min/max-age checks in
// `_common/validations/register.ts` (18–100 years old).
const maxBirthDate = moment();
const minBirthDate = moment().subtract(100, "years");

const DateOfBirthInput = ({
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: DateOfBirthInputProps) => {
  return (
    <div>
      <DatePicker
        format={DATE_FORMAT}
        value={value ? moment(value, DATE_FORMAT) : undefined}
        minDate={minBirthDate}
        maxDate={maxBirthDate}
        disabled={disabled}
        onChange={(v: any) => onChange(v ? moment(v).format(DATE_FORMAT) : "")}
        onBlur={onBlur}
        placeholder="Chọn ngày sinh"
        prefixIcon={<CalendarDaysOutlined className="h-5 w-5 text-slate-400" />}
        className="w-full"
        inputClassName={classNames(
          "h-11 rounded-xl bg-slate-50 pl-11",
          error && "border-red-500!",
        )}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DateOfBirthInput;
