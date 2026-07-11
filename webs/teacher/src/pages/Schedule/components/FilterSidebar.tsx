import { observer } from "mobx-react-lite";
import moment from "moment";
import classNames from "classnames";
import { Checkbox, RangePicker } from "tera-dls";

import BranchSelect from "_common/components/BranchSelect";
import ClassroomSelect from "_common/components/ClassroomSelect";
import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";
import { useMeta } from "_common/hooks/useMeta";

import type { ScheduleStatus } from "../_interface";

interface FilterSidebarProps {
  classId: number | "";
  statuses: ScheduleStatus[];
  branch: number | "";
  range: [moment.Moment, moment.Moment];
  onClassChange: (value: number | "") => void;
  onStatusToggle: (status: ScheduleStatus) => void;
  onBranchChange: (value: number | "") => void;
  onRangeChange: (range: [moment.Moment, moment.Moment]) => void;
  onRangeClear?: () => void;
  rangeActive?: boolean;
  onReset?: () => void;
}

const FilterSidebar = observer(({
  classId,
  statuses,
  branch,
  range,
  onClassChange,
  onStatusToggle,
  onBranchChange,
  onRangeChange,
  onRangeClear,
  rangeActive,
  onReset,
}: FilterSidebarProps) => {
  const { getOptions } = useMeta();
  const statusOptions = getOptions("class_session_status");

  return (
    <FilterCard onReset={onReset}>
      <FilterField label="Lọc lớp học">
        <ClassroomSelect
          value={classId === "" ? undefined : classId}
          placeholder="Tất cả lớp học"
          allowClear
          onChange={(value) => onClassChange((value as number | undefined) ?? "")}
        />
      </FilterField>

      <FilterField label="Lọc trạng thái">
        <div className="flex flex-col gap-2">
          {statusOptions.map((option) => (
            <Checkbox
              key={option.value}
              checked={statuses.includes(option.value)}
              onChange={() => onStatusToggle(option.value)}
            >
              <span className={classNames("text-sm", !statuses.includes(option.value) && "text-slate-600")}>
                {option.label}
              </span>
            </Checkbox>
          ))}
        </div>
      </FilterField>

      <FilterField label="Lọc theo ngày">
        <RangePicker
          value={range}
          allowClear={rangeActive}
          format="DD/MM/YYYY"
          onChange={(value) => {
            if (value?.[0] && value?.[1]) onRangeChange([value[0], value[1]]);
            else onRangeClear?.();
          }}
        />
      </FilterField>

      <FilterField label="Lọc theo cơ sở">
        <BranchSelect
          value={branch === "" ? undefined : branch}
          placeholder="Tất cả cơ sở"
          allowClear
          onChange={(value) => onBranchChange((value as number | undefined) ?? "")}
        />
      </FilterField>
    </FilterCard>
  );
});

export default FilterSidebar;
