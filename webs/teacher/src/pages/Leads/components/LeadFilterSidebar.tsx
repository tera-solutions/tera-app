import { Select } from "tera-dls";

import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";
import { useMeta } from "_common/hooks/useMeta";

import { SOURCE_OPTIONS } from "../constants";

interface LeadFilterSidebarProps {
  status: string;
  source: string;
  onChange: (patch: { status?: string; source?: string }) => void;
  onReset: () => void;
}

const LeadFilterSidebar = ({ status, source, onChange, onReset }: LeadFilterSidebarProps) => {
  const { getOptions } = useMeta();

  return (
    <FilterCard onReset={onReset}>
      <FilterField label="Trạng thái">
        <Select
          value={status || undefined}
          placeholder="Tất cả trạng thái"
          allowClear
          onChange={(value: any) => onChange({ status: value ?? "" })}
          options={getOptions("lead_status").map((o) => ({ value: o.value, label: o.label }))}
        />
      </FilterField>

      <FilterField label="Nguồn">
        <Select
          value={source || undefined}
          placeholder="Tất cả nguồn"
          allowClear
          onChange={(value: any) => onChange({ source: value ?? "" })}
          options={SOURCE_OPTIONS}
        />
      </FilterField>
    </FilterCard>
  );
};

export default LeadFilterSidebar;
