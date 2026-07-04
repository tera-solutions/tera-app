import classNames from "classnames";
import { Input } from "tera-dls";

import type { RegisterErrors, RegisterFormData } from "../../types";

interface SchoolFormProps {
  values: RegisterFormData;
  errors: RegisterErrors;
  disabled?: boolean;
  onChange: <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K],
  ) => void;
}

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";
const inputClass = "h-11 rounded-xl bg-slate-50";

const SchoolForm = ({ values, errors, disabled, onChange }: SchoolFormProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Tên trường / Trung tâm</label>
        <Input
          type="text"
          value={values.school}
          onChange={(e: any) => onChange("school", e?.target?.value ?? "")}
          disabled={disabled}
          maxLength={255}
          placeholder="Nhập tên trường / trung tâm"
          className={classNames(inputClass, errors.school && "border-red-500!")}
        />
        {errors.school && (
          <p className="mt-1.5 text-xs text-red-500">{errors.school}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Chức vụ</label>
          <Input
            type="text"
            value={values.position}
            onChange={(e: any) => onChange("position", e?.target?.value ?? "")}
            disabled={disabled}
            maxLength={100}
            placeholder="Nhập chức vụ"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Kinh nghiệm (năm)</label>
          <Input
            type="text"
            inputMode="numeric"
            value={values.experience}
            onChange={(e: any) =>
              onChange(
                "experience",
                (e?.target?.value ?? "").replace(/[^\d]/g, ""),
              )
            }
            disabled={disabled}
            maxLength={2}
            placeholder="Số năm kinh nghiệm"
            className={classNames(
              inputClass,
              errors.experience && "border-red-500!",
            )}
          />
          {errors.experience && (
            <p className="mt-1.5 text-xs text-red-500">{errors.experience}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Môn giảng dạy</label>
        <Input
          type="text"
          value={values.subject}
          onChange={(e: any) => onChange("subject", e?.target?.value ?? "")}
          disabled={disabled}
          maxLength={100}
          placeholder="Nhập môn giảng dạy"
          className={inputClass}
        />
      </div>
    </div>
  );
};

export default SchoolForm;
