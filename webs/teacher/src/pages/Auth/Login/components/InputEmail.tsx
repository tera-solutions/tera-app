import classNames from "classnames";
import { EnvelopeOutlined, Input } from "tera-dls";

interface InputEmailProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

const InputEmail = ({
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: InputEmailProps) => {
  return (
    <div>
      <Input
        type="text"
        value={value}
        onChange={(e: any) => onChange(e?.target?.value ?? "")}
        onBlur={onBlur}
        disabled={disabled}
        autoFocus
        autoComplete="username"
        maxLength={320}
        placeholder="Nhập email hoặc số điện thoại"
        prefix={<EnvelopeOutlined className="w-5 h-5 text-slate-400" />}
        className={classNames(
          "h-11 rounded-xl bg-slate-50 pl-11",
          error && "border-red-500!",
        )}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputEmail;
