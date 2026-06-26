/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: services */
import { CourseService, TeacherService } from "@tera/modules";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import UserSelect from "_common/components/UserSelect";
import SortSelect from "_common/components/SortSelect";

export interface ClassRoomFilterValue {
  course: string;
  teacher: string;
  assignee: string;
  selectedAssignee: any;
  weekday: string;
  shift: string;
  startFrom: string;
  startTo: string;
}

interface ClassRoomFilterProps {
  value: ClassRoomFilterValue;
  onChange: (patch: Partial<ClassRoomFilterValue>) => void;
  sortBy: string;
  sortDir: "asc" | "desc";
  onSortChange: (sortBy: string, sortDir: "asc" | "desc") => void;
}

const DATE_INPUT =
  "h-7 text-[13px] outline-none bg-transparent text-gray-700 flex-1 min-w-0 [&::-webkit-calendar-picker-indicator]:opacity-60";

/**
 * Bộ lọc nhanh danh sách lớp học:
 * Khóa học + Giáo viên + Nhân viên phụ trách + Thứ học + Ca học (Select)
 * + Ngày khai giảng (date range) + Sắp xếp. Status nằm ở tabs (list page).
 */
const ClassRoomFilter = ({
  value,
  onChange,
  sortBy,
  sortDir,
  onSortChange,
}: ClassRoomFilterProps) => {
  const { t } = useTranslation();

  const { data: courseData } = CourseService.useCourseList({
    params: { page: 1, per_page: 100 },
  });
  const courseOptions = (courseData?.data?.items ?? []).map((c: any) => ({
    value: String(c.id),
    label: c.name,
  }));

  const { data: teacherData } = TeacherService.useTeacherList({
    params: { page: 1, per_page: 100 },
  });
  const teacherOptions = (teacherData?.data?.items ?? []).map((tc: any) => ({
    value: String(tc.id),
    label: tc.full_name,
  }));

  // ⚠️ Thứ học / Ca học: chưa có metadata/API → options cục bộ, param cần verify backend
  const weekdayOptions = [
    { value: "monday", label: t("classroom.weekday_mon") },
    { value: "tuesday", label: t("classroom.weekday_tue") },
    { value: "wednesday", label: t("classroom.weekday_wed") },
    { value: "thursday", label: t("classroom.weekday_thu") },
    { value: "friday", label: t("classroom.weekday_fri") },
    { value: "saturday", label: t("classroom.weekday_sat") },
    { value: "sunday", label: t("classroom.weekday_sun") },
  ];
  const shiftOptions = [
    { value: "morning", label: t("classroom.shift_morning") },
    { value: "afternoon", label: t("classroom.shift_afternoon") },
    { value: "evening", label: t("classroom.shift_evening") },
  ];

  const sortOptions = [
    { value: "code", label: t("classroom.code") },
    { value: "name", label: t("classroom.name") },
    { value: "start_date", label: t("classroom.open_date") },
    { value: "created_at", label: t("classroom.created_at") },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 xmd:flex xmd:flex-wrap xmd:items-center">
      <FilterSelect
        className="min-w-0 xmd:flex-none xmd:w-auto xmd:min-w-[150px]"
        value={value.course}
        placeholder={t("classroom.all_courses")}
        options={courseOptions}
        onChange={(v) => onChange({ course: v })}
      />
      <FilterSelect
        className="min-w-0 xmd:flex-none xmd:w-auto xmd:min-w-[150px]"
        value={value.teacher}
        placeholder={t("classroom.all_teachers")}
        options={teacherOptions}
        onChange={(v) => onChange({ teacher: v })}
      />
      <div className="min-w-0 xmd:flex-none xmd:w-auto xmd:min-w-[170px]">
        <UserSelect
          value={value.assignee}
          selectedUser={value.selectedAssignee}
          placeholder={t("classroom.all_assignees")}
          allowClear
          onChange={(id, user) =>
            onChange({ assignee: id, selectedAssignee: user ?? null })
          }
        />
      </div>
      <FilterSelect
        className="min-w-0 xmd:flex-none xmd:w-auto xmd:min-w-[130px]"
        value={value.weekday}
        placeholder={t("classroom.all_weekdays")}
        options={weekdayOptions}
        onChange={(v) => onChange({ weekday: v })}
      />
      {/* Ca học — mobile: full-width 1 hàng (tránh ô trống vì 5 select lẻ) */}
      <FilterSelect
        className="col-span-2 xmd:col-span-1 min-w-0 xmd:flex-none xmd:w-auto xmd:min-w-[130px]"
        value={value.shift}
        placeholder={t("classroom.all_shifts")}
        options={shiftOptions}
        onChange={(v) => onChange({ shift: v })}
      />
      {/* Ngày khai giảng + Sắp xếp — mobile: chung hàng cuối full-width; desktop: tách inline */}
      <div className="col-span-2 flex items-center gap-2 xmd:contents">
        <div className="flex-1 xmd:flex-none flex items-center gap-1 h-9 px-2 border border-gray-300 rounded bg-white min-w-0 xmd:min-w-[240px]">
          <span className="text-[12px] text-gray-400 shrink-0">
            {t("classroom.open_date")}
          </span>
          <input
            type="date"
            value={value.startFrom}
            title={t("common.from")}
            onChange={(e) => onChange({ startFrom: e.target.value })}
            className={DATE_INPUT}
          />
          <span className="text-gray-300 shrink-0">–</span>
          <input
            type="date"
            value={value.startTo}
            title={t("common.to")}
            onChange={(e) => onChange({ startTo: e.target.value })}
            className={DATE_INPUT}
          />
        </div>
        <div className="shrink-0 xmd:order-last">
          <SortSelect
            options={sortOptions}
            sortBy={sortBy}
            sortDir={sortDir}
            placeholder={t("classroom.sort_by")}
            defaultDir="desc"
            onChange={onSortChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassRoomFilter;
