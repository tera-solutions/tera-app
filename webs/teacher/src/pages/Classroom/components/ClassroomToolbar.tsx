import { Select } from "tera-dls";

import Card from "_common/components/Card";
import SearchInput from "_common/components/SearchInput";

import type { ClassroomStatus } from "../_interface";
import { STATUS_OPTIONS } from "../constants";

export interface LevelOption {
  label: string;
  value: string;
}

interface ClassroomToolbarProps {
  search: string;
  status: ClassroomStatus | "";
  level: string | "";
  levelOptions: LevelOption[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ClassroomStatus | "") => void;
  onLevelChange: (value: string | "") => void;
}

const ClassroomToolbar = ({
  search,
  status,
  level,
  levelOptions,
  onSearchChange,
  onStatusChange,
  onLevelChange,
}: ClassroomToolbarProps) => {
  const selectedStatus = STATUS_OPTIONS.find((o) => o.value === status);
  const selectedLevel = levelOptions.find((o) => o.value === level);

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm lớp học, học viên..."
          wrapperClassName="sm:max-w-sm"
        />
        <div className="sm:w-48">
          <Select
            value={status === "" ? undefined : status}
            selectedValue={selectedStatus}
            placeholder="Tất cả trạng thái"
            allowClear
            options={STATUS_OPTIONS}
            onChange={(value) =>
              onStatusChange((value as ClassroomStatus | undefined) ?? "")
            }
          />
        </div>
        <div className="sm:w-48">
          <Select
            value={level === "" ? undefined : level}
            selectedValue={selectedLevel}
            placeholder="Tất cả cấp độ"
            allowClear
            options={levelOptions}
            onChange={(value) =>
              onLevelChange((value as string | undefined) ?? "")
            }
          />
        </div>
      </div>
    </Card>
  );
};

export default ClassroomToolbar;
