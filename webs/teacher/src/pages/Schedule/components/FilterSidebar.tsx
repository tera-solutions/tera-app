import moment from "moment";
import classNames from "classnames";
import { Checkbox, RangePicker } from "tera-dls";

import BranchSelect from "_common/components/BranchSelect";
import ClassroomSelect from "_common/components/ClassroomSelect";
import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";
import SearchInput from "_common/components/SearchInput";
import { SCHEDULE_STATUS } from "_common/constants/schedule";

import type { ScheduleStatus } from "../_interface";
import { STATUS_FILTER_OPTIONS } from "../constants";

interface FilterSidebarProps {
  search: string;
  classId: number | "";
  statuses: ScheduleStatus[];
  branch: number | "";
  range: [moment.Moment, moment.Moment];
  onSearchChange: (value: string) => void;
  onClassChange: (value: number | "") => void;
  onStatusToggle: (status: ScheduleStatus) => void;
  onBranchChange: (value: number | "") => void;
  onRangeChange: (range: [moment.Moment, moment.Moment]) => void;
  onRangeClear?: () => void;
  rangeActive?: boolean;
  onReset?: () => void;
}

const FilterSidebar = ({
  search,
  classId,
  statuses,
  branch,
  range,
  onSearchChange,
  onClassChange,
  onStatusToggle,
  onBranchChange,
  onRangeChange,
  onRangeClear,
  rangeActive,
  onReset,
}: FilterSidebarProps) => {
  return (
    <FilterCard onReset={onReset}>
      <SearchInput
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Tìm kiếm lớp học..."
      />

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
          {STATUS_FILTER_OPTIONS.map((status) => (
            <Checkbox
              key={status}
              checked={statuses.includes(status)}
              onChange={() => onStatusToggle(status)}
            >
              <span className={classNames("text-sm", !statuses.includes(status) && "text-slate-600")}>
                {SCHEDULE_STATUS[status].label}
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
};

export default FilterSidebar;
