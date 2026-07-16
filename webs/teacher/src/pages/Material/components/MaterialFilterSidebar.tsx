import { Select } from "tera-dls";

import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";

import { MATERIAL_TYPE_OPTIONS } from "../constants";

export interface MaterialFilterDraft {
  type: string;
}

interface MaterialFilterSidebarProps {
  draft: MaterialFilterDraft;
  onChange: (patch: Partial<MaterialFilterDraft>) => void;
  onReset: () => void;
}

const MaterialFilterSidebar = ({ draft, onChange, onReset }: MaterialFilterSidebarProps) => {
  const typeOptions = MATERIAL_TYPE_OPTIONS.filter((o) => o.value);
  const selectedType = typeOptions.find((o) => o.value === draft.type);

  return (
    <FilterCard onReset={onReset}>
      <FilterField label="Loại tài liệu">
        <Select
          value={draft.type || undefined}
          selectedValue={selectedType}
          placeholder="Tất cả loại"
          allowClear
          options={typeOptions}
          onChange={(value) => onChange({ type: (value as string | undefined) ?? "" })}
        />
      </FilterField>
    </FilterCard>
  );
};

export default MaterialFilterSidebar;
