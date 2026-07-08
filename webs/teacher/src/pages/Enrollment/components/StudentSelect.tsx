import { StudentService } from "@tera/modules/education";

import AsyncSearchSelect from "_common/components/AsyncSearchSelect";
import { SelectOption } from "_common/hooks/useAsyncSelectOptions";

interface StudentSelectProps {
  value?: number | string | null;
  onChange: (value: number | string | undefined) => void;
  placeholder?: string;
  className?: string;
}

const toOption = (student: any): SelectOption => ({
  value: student.id,
  label: `${student.name}${student.code ? ` (${student.code})` : ""}`,
});

/** Searchable existing-student picker — types into the box to filter server-side. */
const StudentSelect = ({ value, onChange, placeholder = "Tìm học viên đã có", className }: StudentSelectProps) => (
  <AsyncSearchSelect
    value={value}
    onChange={onChange}
    useList={StudentService.useStudentList}
    toOption={toOption}
    placeholder={placeholder}
    allowClear
    className={className}
  />
);

export default StudentSelect;
