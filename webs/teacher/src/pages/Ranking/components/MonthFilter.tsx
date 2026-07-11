import moment from "moment";
import { Select } from "tera-dls";

import Card from "_common/components/Card";
import FilterField from "_common/components/FilterField";

interface MonthFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const MONTH_OPTIONS = Array.from({ length: 6 }).map((_, i) => {
  const m = moment().subtract(i, "months");
  return { value: m.format("YYYY-MM"), label: `Tháng ${m.format("MM/YYYY")}` };
});

const MonthFilter = ({ value, onChange }: MonthFilterProps) => (
  <Card>
    <FilterField label="Lọc tháng">
      <Select
        value={value}
        options={MONTH_OPTIONS}
        onChange={(v) => onChange(v as string)}
      />
    </FilterField>
  </Card>
);

export default MonthFilter;
