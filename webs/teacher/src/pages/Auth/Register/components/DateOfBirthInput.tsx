import classNames from "classnames";

interface DateOfBirthInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

const today = new Date().toISOString().slice(0, 10);
// Keeps the native picker's range aligned with the min/max-age checks in
// `_common/validations/register.ts` (18–100 years old).
const maxBirthDate = today;
const minBirthDate = new Date(
  new Date().setFullYear(new Date().getFullYear() - 100),
)
  .toISOString()
  .slice(0, 10);

const DateOfBirthInput = ({
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: DateOfBirthInputProps) => {
  return (
    <div>
      <input
        type="date"
        value={value}
        max={maxBirthDate}
        min={minBirthDate}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={classNames(
          "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-brand disabled:opacity-60",
          error && "border-red-500!",
        )}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DateOfBirthInput;
