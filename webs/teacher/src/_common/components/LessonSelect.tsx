import { useMemo } from "react";
import { LessonService } from "@tera/modules/education";

import AsyncSearchSelect from "_common/components/AsyncSearchSelect";
import { SelectOption } from "_common/hooks/useAsyncSelectOptions";

interface LessonSelectProps {
  value?: number | string | null;
  onChange: (value: number | string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  /** Narrow results to lessons of a single class. */
  classRoomId?: number | string | null;
  /** Fallback label for the current value when it isn't in the fetched page. */
  selectedOption?: SelectOption | null;
}

const toOption = (lesson: any): SelectOption => ({
  value: lesson.id,
  label: lesson.lesson_no ? `Buổi ${lesson.lesson_no} - ${lesson.lesson_title}` : lesson.lesson_title,
});

/** Searchable lesson picker — types into the box to filter server-side. */
const LessonSelect = ({
  value,
  onChange,
  placeholder = "Chọn bài học",
  disabled,
  allowClear,
  className,
  classRoomId,
  selectedOption,
}: LessonSelectProps) => {
  const filters = useMemo(
    () => (classRoomId ? { class_room_id: classRoomId } : undefined),
    [classRoomId],
  );

  return (
    <AsyncSearchSelect
      value={value}
      onChange={onChange}
      useList={LessonService.useLessonList}
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

export default LessonSelect;
