import { ParentService } from "@tera/modules/crm";

import AsyncSearchSelect from "_common/components/AsyncSearchSelect";
import { SelectOption } from "_common/hooks/useAsyncSelectOptions";

interface ParentSelectProps {
  value?: number | string | null;
  onChange: (value: number | string | undefined) => void;
  placeholder?: string;
  className?: string;
}

const toOption = (parent: any): SelectOption => ({
  value: parent.id,
  label: `${parent.name}${parent.phone ? ` (${parent.phone})` : ""}`,
});

/** Searchable existing-parent picker — types into the box to filter server-side. */
const ParentSelect = ({ value, onChange, placeholder = "Tìm phụ huynh có sẵn", className }: ParentSelectProps) => (
  <AsyncSearchSelect
    value={value}
    onChange={onChange}
    useList={ParentService.useParentList}
    toOption={toOption}
    placeholder={placeholder}
    allowClear
    className={className}
  />
);

export default ParentSelect;
