import { MaterialService } from "@tera/modules/education";

import AsyncSearchSelect from "_common/components/AsyncSearchSelect";
import { SelectOption } from "_common/hooks/useAsyncSelectOptions";

interface MaterialSelectProps {
  value?: number | string | null;
  onChange: (value: number | string | undefined) => void;
  placeholder?: string;
  className?: string;
}

const toOption = (material: any): SelectOption => ({
  value: material.id,
  label: material.material_name,
});

/** Searchable picker over the shared Material bank (`/materials`) — used
 * anywhere a page used to let teachers upload their own file inline; now they
 * pick an existing bank material instead, so every material lives in one
 * place with one status/version history. */
const MaterialSelect = ({
  value,
  onChange,
  placeholder = "Chọn tài liệu từ ngân hàng tài liệu",
  className,
}: MaterialSelectProps) => (
  <AsyncSearchSelect
    value={value}
    onChange={onChange}
    useList={MaterialService.useMaterialList}
    toOption={toOption}
    placeholder={placeholder}
    allowClear
    className={className}
  />
);

export default MaterialSelect;
