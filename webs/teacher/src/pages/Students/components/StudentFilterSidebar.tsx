import { Checkbox, RangePicker, Select } from "tera-dls";
import moment from "moment";

import ClassroomSelect from "_common/components/ClassroomSelect";
import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";

import { LEVEL_OPTIONS, RANK_OPTIONS, STATUS_OPTIONS } from "../constants";

export interface StudentFilterDraft {
  class_id: number;
  level: string[];
  status: string[];
  rank: string;
  date_from: string;
  date_to: string;
}

interface StudentFilterSidebarProps {
  draft: StudentFilterDraft;
  onChange: (patch: Partial<StudentFilterDraft>) => void;
  onReset: () => void;
}

const DATE_FORMAT = "YYYY-MM-DD";

const StudentFilterSidebar = ({
  draft,
  onChange,
  onReset,
}: StudentFilterSidebarProps) => {
  const rangeValue: [moment.Moment, moment.Moment] | undefined =
    draft.date_from && draft.date_to
      ? [moment(draft.date_from, DATE_FORMAT), moment(draft.date_to, DATE_FORMAT)]
      : undefined;

  return (
    <FilterCard onReset={onReset}>
      <FilterField label="Lớp học">
        <ClassroomSelect
          value={draft.class_id || undefined}
          placeholder="Tất cả lớp học"
          allowClear
          onChange={(value) => onChange({ class_id: value != null ? Number(value) : 0 })}
        />
      </FilterField>

      <FilterField label="Cấp độ">
        <Checkbox.Group
          value={draft.level}
          options={LEVEL_OPTIONS}
          className="flex flex-col gap-2"
          onChange={(value) => onChange({ level: value as string[] })}
        />
      </FilterField>

      <FilterField label="Trạng thái">
        <Checkbox.Group
          value={draft.status}
          options={STATUS_OPTIONS}
          className="flex flex-col gap-2"
          onChange={(value) => onChange({ status: value as string[] })}
        />
      </FilterField>

      <FilterField label="Xếp loại">
        <Select
          value={draft.rank || undefined}
          selectedValue={RANK_OPTIONS.find((o) => o.value === draft.rank)}
          placeholder="Tất cả"
          allowClear
          options={RANK_OPTIONS}
          onChange={(value) => onChange({ rank: (value as string | undefined) ?? "" })}
        />
      </FilterField>

      <FilterField label="Ngày nhập học">
        <RangePicker
          className="w-full"
          value={rangeValue as any}
          onChange={(value: any) =>
            onChange({
              date_from: value?.[0] ? value[0].format(DATE_FORMAT) : "",
              date_to: value?.[1] ? value[1].format(DATE_FORMAT) : "",
            })
          }
        />
      </FilterField>
    </FilterCard>
  );
};

export default StudentFilterSidebar;
