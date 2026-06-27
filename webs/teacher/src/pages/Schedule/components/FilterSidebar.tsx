import classNames from "classnames";
import moment from "moment";
import {
  Checkbox,
  Input,
  MagnifyingGlassOutlined,
  RangePicker,
  Select,
} from "tera-dls";

import { CARD } from "_common/constants/dashboard";
import { SCHEDULE_STATUS } from "_common/constants/schedule";

import type { ScheduleStatus } from "../_interface";
import { STATUS_FILTER_OPTIONS } from "../constants";

export interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterSidebarProps {
  search: string;
  classId: number | "";
  statuses: ScheduleStatus[];
  branch: string | "";
  range: [moment.Moment, moment.Moment];
  classOptions: FilterOption[];
  branchOptions: FilterOption[];
  onSearchChange: (value: string) => void;
  onClassChange: (value: number | "") => void;
  onStatusToggle: (status: ScheduleStatus) => void;
  onBranchChange: (value: string | "") => void;
  onRangeChange: (range: [moment.Moment, moment.Moment]) => void;
  onRangeClear?: () => void;
  rangeActive?: boolean;
}

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="mb-1.5 text-sm font-medium text-slate-700">{label}</p>
    {children}
  </div>
);

const FilterSidebar = ({
  search,
  classId,
  statuses,
  branch,
  range,
  classOptions,
  branchOptions,
  onSearchChange,
  onClassChange,
  onStatusToggle,
  onBranchChange,
  onRangeChange,
  onRangeClear,
  rangeActive,
}: FilterSidebarProps) => {
  const selectedClass = classOptions.find((o) => o.value === classId);
  const selectedBranch = branchOptions.find((o) => o.value === branch);

  return (
    <div className={`${CARD} flex flex-col gap-4 p-4`}>
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Tìm kiếm lớp học..."
        prefix={<MagnifyingGlassOutlined className="h-4 w-4 text-slate-400" />}
        className="pl-10"
      />

      <Field label="Lọc lớp học">
        <Select
          value={classId === "" ? undefined : classId}
          selectedValue={selectedClass}
          placeholder="Tất cả lớp học"
          allowClear
          options={classOptions}
          onChange={(value) =>
            onClassChange((value as number | undefined) ?? "")
          }
        />
      </Field>

      <Field label="Lọc trạng thái">
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
      </Field>

      <Field label="Lọc theo ngày">
        <RangePicker
          value={range}
          allowClear={rangeActive}
          format="DD/MM/YYYY"
          onChange={(value) => {
            if (value?.[0] && value?.[1]) onRangeChange([value[0], value[1]]);
            else onRangeClear?.();
          }}
        />
        {rangeActive && (
          <button
            type="button"
            onClick={onRangeClear}
            className="mt-1.5 text-xs font-medium text-brand hover:underline"
          >
            Bỏ lọc khoảng ngày
          </button>
        )}
      </Field>

      <Field label="Lọc theo cơ sở">
        <Select
          value={branch === "" ? undefined : branch}
          selectedValue={selectedBranch}
          placeholder="Tất cả cơ sở"
          allowClear
          options={branchOptions}
          onChange={(value) =>
            onBranchChange((value as string | undefined) ?? "")
          }
        />
      </Field>
    </div>
  );
};

export default FilterSidebar;
