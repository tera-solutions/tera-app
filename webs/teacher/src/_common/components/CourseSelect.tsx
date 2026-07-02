import { CourseService } from "@tera/modules/education";

import AsyncSearchSelect from "_common/components/AsyncSearchSelect";
import { SelectOption } from "_common/hooks/useAsyncSelectOptions";

interface CourseSelectProps {
  value?: number | string | null;
  onChange: (value: number | string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  /** Fallback label for the current value when it isn't in the fetched page. */
  selectedOption?: SelectOption | null;
}

const toOption = (course: any): SelectOption => ({
  value: course.id,
  label: course.name,
});

/** Searchable course picker — types into the box to filter server-side. */
const CourseSelect = ({
  value,
  onChange,
  placeholder = "Chọn khóa học",
  disabled,
  allowClear,
  className,
  selectedOption,
}: CourseSelectProps) => (
  <AsyncSearchSelect
    value={value}
    onChange={onChange}
    useList={CourseService.useCourseList}
    toOption={toOption}
    placeholder={placeholder}
    disabled={disabled}
    allowClear={allowClear}
    className={className}
    selectedOption={selectedOption}
  />
);

export default CourseSelect;
