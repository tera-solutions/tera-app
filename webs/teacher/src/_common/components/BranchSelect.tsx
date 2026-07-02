import { BranchService } from "@tera/modules/system";

import AsyncSearchSelect from "_common/components/AsyncSearchSelect";
import { SelectOption } from "_common/hooks/useAsyncSelectOptions";

interface BranchSelectProps {
  value?: number | string | null;
  onChange: (value: number | string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  /** Fallback label for the current value when it isn't in the fetched page. */
  selectedOption?: SelectOption | null;
}

const toOption = (branch: any): SelectOption => ({
  value: branch.id,
  label: branch.name,
});

/** Searchable branch picker — types into the box to filter server-side. */
const BranchSelect = ({
  value,
  onChange,
  placeholder = "Chọn chi nhánh",
  disabled,
  allowClear,
  className,
  selectedOption,
}: BranchSelectProps) => (
  <AsyncSearchSelect
    value={value}
    onChange={onChange}
    useList={BranchService.useBranchList}
    toOption={toOption}
    placeholder={placeholder}
    disabled={disabled}
    allowClear={allowClear}
    className={className}
    selectedOption={selectedOption}
  />
);

export default BranchSelect;
