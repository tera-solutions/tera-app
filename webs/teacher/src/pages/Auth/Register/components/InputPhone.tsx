import classNames from "classnames";
import { Input, PhoneOutlined } from "tera-dls";

interface InputPhoneProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

const InputPhone = ({ value, onChange, onBlur, error, disabled }: InputPhoneProps) => {
  return (
    <div>
      <Input
        type="tel"
        value={value}
        onChange={(e: any) =>
          onChange((e?.target?.value ?? "").replace(/[^\d]/g, ""))
        }
        onBlur={onBlur}
        disabled={disabled}
        autoComplete="tel"
        maxLength={10}
        placeholder="Nhập số điện thoại"
        prefix={<PhoneOutlined className="w-5 h-5 text-slate-400" />}
        className={classNames(
          "h-11 rounded-xl bg-slate-50 pl-11",
          error && "border-red-500!",
        )}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputPhone;
