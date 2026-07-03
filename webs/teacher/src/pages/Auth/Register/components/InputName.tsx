import classNames from "classnames";
import { Input, UserOutlined } from "tera-dls";

interface InputNameProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

const InputName = ({ value, onChange, onBlur, error, disabled }: InputNameProps) => {
  return (
    <div>
      <Input
        type="text"
        value={value}
        onChange={(e: any) => onChange(e?.target?.value ?? "")}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete="name"
        maxLength={100}
        placeholder="Nhập họ và tên"
        prefix={<UserOutlined className="w-5 h-5 text-slate-400" />}
        className={classNames(
          "h-11 rounded-xl bg-slate-50 pl-11",
          error && "border-red-500!",
        )}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputName;
