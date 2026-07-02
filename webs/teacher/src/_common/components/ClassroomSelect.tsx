import { useMemo } from "react";
import { ClassRoomService } from "@tera/modules/education";

import AsyncSearchSelect from "_common/components/AsyncSearchSelect";
import { SelectOption } from "_common/hooks/useAsyncSelectOptions";

interface ClassroomSelectProps {
  value?: number | string | null;
  onChange: (value: number | string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  /** Narrow results to classrooms of a single course. */
  courseId?: number | string | null;
  /** Fallback label for the current value when it isn't in the fetched page. */
  selectedOption?: SelectOption | null;
}

const toOption = (classRoom: any): SelectOption => ({
  value: classRoom.id,
  label: classRoom.name,
});

/** Searchable classroom picker — types into the box to filter server-side. */
const ClassroomSelect = ({
  value,
  onChange,
  placeholder = "Chọn lớp học",
  disabled,
  allowClear,
  className,
  courseId,
  selectedOption,
}: ClassroomSelectProps) => {
  const filters = useMemo(
    () => (courseId ? { course_id: courseId } : undefined),
    [courseId],
  );

  return (
    <AsyncSearchSelect
      value={value}
      onChange={onChange}
      useList={ClassRoomService.useClassRoomList}
      toOption={toOption}
      filters={filters}
      placeholder={placeholder}
      disabled={disabled}
      allowClear={allowClear}
      className={className}
      selectedOption={selectedOption}
    />
  );
};

export default ClassroomSelect;
