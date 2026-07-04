import classNames from "classnames";
import { Select } from "tera-dls";

import { GENDER_OPTIONS } from "../constants";
import type { Gender } from "../types";

interface GenderSelectProps {
  value: Gender | "";
  onChange: (value: Gender | "") => void;
  error?: string;
  disabled?: boolean;
}

const GenderSelect = ({ value, onChange, error, disabled }: GenderSelectProps) => {
  const selected = GENDER_OPTIONS.find((o) => o.value === value);

  return (
    <div>
      <Select
        value={value === "" ? undefined : value}
        selectedValue={selected}
        options={GENDER_OPTIONS}
        placeholder="Chọn giới tính"
        allowClear
        disabled={disabled}
        onChange={(next) => onChange((next as Gender | undefined) ?? "")}
        className={classNames(
          "h-11 rounded-xl bg-slate-50",
          error && "[&_.select-selector]:border-red-500!",
        )}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default GenderSelect;
