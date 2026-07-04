import { RangePicker } from "tera-dls";
import moment from "moment";

import ClassroomSelect from "_common/components/ClassroomSelect";
import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";
import LevelSelect from "_common/components/LevelSelect";

export interface StudentFilterDraft {
  class_id: number;
  level_id: number;
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
        <LevelSelect
          value={draft.level_id || undefined}
          placeholder="Tất cả cấp độ"
          allowClear
          onChange={(value) => onChange({ level_id: value != null ? Number(value) : 0 })}
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
