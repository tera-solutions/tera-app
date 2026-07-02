import { LevelService } from "@tera/modules/education";

import AsyncSearchSelect from "_common/components/AsyncSearchSelect";
import { SelectOption } from "_common/hooks/useAsyncSelectOptions";

interface LevelSelectProps {
  value?: number | string | null;
  onChange: (value: number | string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  /** Fallback label for the current value when it isn't in the fetched page. */
  selectedOption?: SelectOption | null;
}

const toOption = (level: any): SelectOption => ({
  value: level.id,
  label: level.level_name,
});

/** Searchable level picker — types into the box to filter server-side. */
const LevelSelect = ({
  value,
  onChange,
  placeholder = "Chọn cấp độ",
  disabled,
  allowClear,
  className,
  selectedOption,
}: LevelSelectProps) => (
  <AsyncSearchSelect
    value={value}
    onChange={onChange}
    useList={LevelService.useLevelList}
    toOption={toOption}
    placeholder={placeholder}
    disabled={disabled}
    allowClear={allowClear}
    className={className}
    selectedOption={selectedOption}
  />
);

export default LevelSelect;
