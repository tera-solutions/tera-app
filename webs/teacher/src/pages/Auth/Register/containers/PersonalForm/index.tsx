import classNames from "classnames";
import { EnvelopeOutlined, Input } from "tera-dls";

import DateOfBirthInput from "../../components/DateOfBirthInput";
import GenderSelect from "../../components/GenderSelect";
import InputName from "../../components/InputName";
import InputPassword from "../../components/InputPassword";
import InputPhone from "../../components/InputPhone";
import type { RegisterErrors, RegisterFormData } from "../../types";

interface PersonalFormProps {
  values: RegisterFormData;
  errors: RegisterErrors;
  disabled?: boolean;
  onChange: <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K],
  ) => void;
  onEnter?: () => void;
}

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

const PersonalForm = ({
  values,
  errors,
  disabled,
  onChange,
  onEnter,
}: PersonalFormProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Họ và tên</label>
          <InputName
            value={values.fullname}
            onChange={(v) => onChange("fullname", v)}
            error={errors.fullname}
            disabled={disabled}
          />
        </div>
        <div>
          <label className={labelClass}>Giới tính</label>
          <GenderSelect
            value={values.gender}
            onChange={(v) => onChange("gender", v)}
            error={errors.gender}
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <div>
          <Input
            type="text"
            value={values.email}
            onChange={(e: any) => onChange("email", e?.target?.value ?? "")}
            disabled={disabled}
            autoComplete="email"
            maxLength={320}
            placeholder="Nhập email"
            prefix={<EnvelopeOutlined className="w-5 h-5 text-slate-400" />}
            className={classNames(
              "h-11 rounded-xl bg-slate-50 pl-11",
              errors.email && "border-red-500!",
            )}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Số điện thoại</label>
          <InputPhone
            value={values.phone}
            onChange={(v) => onChange("phone", v)}
            error={errors.phone}
            disabled={disabled}
          />
        </div>
        <div>
          <label className={labelClass}>Ngày sinh</label>
          <DateOfBirthInput
            value={values.dob}
            onChange={(v) => onChange("dob", v)}
            error={errors.dob}
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Mật khẩu</label>
        <InputPassword
          value={values.password}
          onChange={(v) => onChange("password", v)}
          error={errors.password}
          disabled={disabled}
          placeholder="Nhập mật khẩu"
        />
      </div>

      <div>
        <label className={labelClass}>Xác nhận mật khẩu</label>
        <InputPassword
          value={values.confirmPassword}
          onChange={(v) => onChange("confirmPassword", v)}
          onEnter={onEnter}
          error={errors.confirmPassword}
          disabled={disabled}
          placeholder="Nhập lại mật khẩu"
        />
      </div>

      <div>
        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={values.terms}
            disabled={disabled}
            onChange={(e) => onChange("terms", e.target.checked)}
            className={classNames(
              "mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand focus:ring-brand",
              errors.terms && "border-red-500",
            )}
          />
          <span className="text-sm text-slate-600">
            Tôi đồng ý với{" "}
            <span className="font-medium text-brand">Điều khoản dịch vụ</span> &{" "}
            <span className="font-medium text-brand">Chính sách bảo mật</span>
          </span>
        </label>
        {errors.terms && (
          <p className="mt-1.5 text-xs text-red-500">{errors.terms}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalForm;
