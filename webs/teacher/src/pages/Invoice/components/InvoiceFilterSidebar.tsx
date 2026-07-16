import { Select } from "tera-dls";

import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";

import { INVOICE_STATUS_FILTER_OPTIONS } from "../constants";

export interface InvoiceFilterDraft {
  status: string;
}

interface InvoiceFilterSidebarProps {
  draft: InvoiceFilterDraft;
  onChange: (patch: Partial<InvoiceFilterDraft>) => void;
  onReset: () => void;
}

const statusOptions = INVOICE_STATUS_FILTER_OPTIONS.filter((o) => o.value);

const InvoiceFilterSidebar = ({ draft, onChange, onReset }: InvoiceFilterSidebarProps) => (
  <FilterCard onReset={onReset}>
    <FilterField label="Trạng thái">
      <Select
        value={draft.status || undefined}
        selectedValue={statusOptions.find((o) => o.value === draft.status)}
        placeholder="Tất cả trạng thái"
        allowClear
        options={statusOptions}
        onChange={(value) => onChange({ status: (value as string | undefined) ?? "" })}
      />
    </FilterField>
  </FilterCard>
);

export default InvoiceFilterSidebar;
