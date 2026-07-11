import { Select } from "tera-dls";

import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";
import { useMeta } from "_common/hooks/useMeta";

export interface RoomFilterDraft {
  type: string;
  floor: string;
}

interface RoomFilterSidebarProps {
  draft: RoomFilterDraft;
  floorOptions: { value: string; label: string }[];
  onChange: (patch: Partial<RoomFilterDraft>) => void;
  onReset: () => void;
}

const RoomFilterSidebar = ({
  draft,
  floorOptions,
  onChange,
  onReset,
}: RoomFilterSidebarProps) => {
  const { getOptions } = useMeta();
  const typeOptions = getOptions("room_type");

  return (
    <FilterCard onReset={onReset}>
      <FilterField label="Loại phòng">
        <Select
          value={draft.type || undefined}
          selectedValue={typeOptions.find((o) => o.value === draft.type)}
          placeholder="Tất cả loại phòng"
          allowClear
          options={typeOptions}
          onChange={(value) => onChange({ type: (value as string | undefined) ?? "" })}
        />
      </FilterField>

      <FilterField label="Tầng">
        <Select
          value={draft.floor || undefined}
          selectedValue={floorOptions.find((o) => o.value === draft.floor)}
          placeholder="Tất cả tầng"
          allowClear
          options={floorOptions}
          onChange={(value) => onChange({ floor: (value as string | undefined) ?? "" })}
        />
      </FilterField>
    </FilterCard>
  );
};

export default RoomFilterSidebar;
