import moment from "moment";
import { RangePicker, Select } from "tera-dls";

import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";
import { useMeta } from "_common/hooks/useMeta";
import { TeacherService } from "@tera/modules/hr";

import { SOURCE_OPTIONS } from "../constants";

interface LeadFilterSidebarProps {
  status: string;
  source: string;
  ownerId: string;
  dateFrom: string;
  dateTo: string;
  onChange: (patch: {
    status?: string;
    source?: string;
    ownerId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
  onReset: () => void;
}

const DATE_FORMAT = "YYYY-MM-DD";

const LeadFilterSidebar = ({
  status,
  source,
  ownerId,
  dateFrom,
  dateTo,
  onChange,
  onReset,
}: LeadFilterSidebarProps) => {
  const { getOptions } = useMeta();

  const teachersQuery = TeacherService.useTeacherList({ params: { per_page: 100 } });
  const ownerOptions = (teachersQuery.data?.data?.items ?? []).map((t: any) => ({
    value: String(t.id),
    label: t.full_name,
  }));

  const rangeValue: [moment.Moment, moment.Moment] | undefined =
    dateFrom && dateTo ? [moment(dateFrom, DATE_FORMAT), moment(dateTo, DATE_FORMAT)] : undefined;

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

      <FilterField label="Người phụ trách">
        <Select
          value={ownerId || undefined}
          placeholder="Tất cả người phụ trách"
          allowClear
          loading={teachersQuery.isLoading}
          onChange={(value: any) => onChange({ ownerId: value ?? "" })}
          options={ownerOptions}
        />
      </FilterField>

      <FilterField label="Ngày tạo">
        <RangePicker
          className="w-full"
          value={rangeValue as any}
          onChange={(value: any) =>
            onChange({
              dateFrom: value?.[0] ? value[0].format(DATE_FORMAT) : "",
              dateTo: value?.[1] ? value[1].format(DATE_FORMAT) : "",
            })
          }
        />
      </FilterField>
    </FilterCard>
  );
};

export default LeadFilterSidebar;
