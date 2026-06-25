interface RememberMeProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const RememberMe = ({ checked, onChange, disabled }: RememberMeProps) => {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-brand"
      />
      <span className="text-sm text-slate-600">Ghi nhớ đăng nhập</span>
    </label>
  );
};

export default RememberMe;
