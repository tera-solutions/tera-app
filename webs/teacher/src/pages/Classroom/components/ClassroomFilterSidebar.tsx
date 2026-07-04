import moment from "moment";
import { RangePicker, Select } from "tera-dls";

import CourseSelect from "_common/components/CourseSelect";
import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";

import { SHIFT_OPTIONS } from "../constants";

export interface ClassroomFilterDraft {
  course_id?: number;
  shift: string;
  start_from: string;
  start_to: string;
}

interface ClassroomFilterSidebarProps {
  draft: ClassroomFilterDraft;
  onChange: (patch: Partial<ClassroomFilterDraft>) => void;
  onReset: () => void;
}

const DATE_FORMAT = "YYYY-MM-DD";

const ClassroomFilterSidebar = ({
  draft,
  onChange,
  onReset,
}: ClassroomFilterSidebarProps) => {
  const selectedShift = SHIFT_OPTIONS.find((o) => o.value === draft.shift);
  const rangeValue: [moment.Moment, moment.Moment] | undefined =
    draft.start_from && draft.start_to
      ? [moment(draft.start_from, DATE_FORMAT), moment(draft.start_to, DATE_FORMAT)]
      : undefined;

  return (
    <FilterCard onReset={onReset}>
      <FilterField label="Khóa học">
        <CourseSelect
          value={draft.course_id}
          placeholder="Tất cả khóa học"
          allowClear
          onChange={(value) =>
            onChange({ course_id: value != null ? Number(value) : undefined })
          }
        />
      </FilterField>

      <FilterField label="Ca học">
        <Select
          value={draft.shift || undefined}
          selectedValue={selectedShift}
          placeholder="Tất cả ca học"
          allowClear
          options={SHIFT_OPTIONS}
          onChange={(value) => onChange({ shift: (value as string | undefined) ?? "" })}
        />
      </FilterField>

      <FilterField label="Ngày khai giảng">
        <RangePicker
          className="w-full"
          value={rangeValue as any}
          onChange={(value: any) =>
            onChange({
              start_from: value?.[0] ? value[0].format(DATE_FORMAT) : "",
              start_to: value?.[1] ? value[1].format(DATE_FORMAT) : "",
            })
          }
        />
      </FilterField>
    </FilterCard>
  );
};

export default ClassroomFilterSidebar;
