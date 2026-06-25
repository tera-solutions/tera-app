import classNames from "classnames";
import { useState } from "react";
import { EyeOutlined, EyeSlashOutlined, Input, LockClosedOutlined } from "tera-dls";

interface InputPasswordProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onEnter?: () => void;
  error?: string;
  disabled?: boolean;
}

const InputPassword = ({
  value,
  onChange,
  onBlur,
  onEnter,
  error,
  disabled,
}: InputPasswordProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div>
      <Input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e: any) => onChange(e?.target?.value ?? "")}
        onBlur={onBlur}
        onKeyDown={(e: any) => e?.key === "Enter" && onEnter?.()}
        disabled={disabled}
        autoComplete="current-password"
        maxLength={64}
        placeholder="Nhập mật khẩu"
        prefix={<LockClosedOutlined className="w-5 h-5 text-slate-400" />}
        suffix={
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setVisible((v) => !v)}
            className="text-slate-400 hover:text-slate-600"
            aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {visible ? (
              <EyeSlashOutlined className="w-5 h-5" />
            ) : (
              <EyeOutlined className="w-5 h-5" />
            )}
          </button>
        }
        className={classNames(
          "h-11 rounded-xl bg-slate-50 pl-11 pr-11",
          error && "border-red-500!",
        )}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputPassword;
