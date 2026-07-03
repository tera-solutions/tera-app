import moment from "moment";
import { RangePicker } from "tera-dls";

import CourseSelect from "_common/components/CourseSelect";
import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";

interface LessonFilterCardProps {
  courseId?: number;
  onCourseChange?: (courseId: number | string | undefined) => void;
  range?: [moment.Moment, moment.Moment];
  onRangeChange: (range: [moment.Moment, moment.Moment]) => void;
  onRangeClear: () => void;
  onReset?: () => void;
}

const LessonFilterCard = ({
  courseId,
  onCourseChange,
  range,
  onRangeChange,
  onRangeClear,
  onReset,
}: LessonFilterCardProps) => {
  return (
    <FilterCard onReset={onReset}>
      {onCourseChange && (
        <FilterField label="Khóa học">
          <CourseSelect
            value={courseId}
            onChange={onCourseChange}
            placeholder="Tất cả khóa học"
            allowClear
          />
        </FilterField>
      )}

      <FilterField label="Lọc theo ngày">
        <RangePicker
          value={range}
          allowClear={!!range}
          format="DD/MM/YYYY"
          onChange={(value) => {
            if (value?.[0] && value?.[1]) onRangeChange([value[0], value[1]]);
            else onRangeClear();
          }}
        />
      </FilterField>
    </FilterCard>
  );
};

export default LessonFilterCard;
