/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: services */
import { CourseService, TeacherService } from "@tera/modules";

/* Import: pages */
import DateRangeFilter from "_common/components/DateRangeFilter";
import FilterSelect from "_common/components/FilterSelect";
import SearchSelect from "_common/components/SearchSelect";
import UserSelect from "_common/components/UserSelect";
import SortSelect from "_common/components/SortSelect";

export interface ClassRoomFilterValue {
  course: string;
  selectedCourse: any;
  teacher: string;
  selectedTeacher: any;
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
    <div className="flex flex-wrap items-center gap-2 xmd:contents">
      {/* Khóa học/GV/Nhân viên/Thứ/Ca — CHỈ hiện desktop (mobile đưa vào modal "Lọc") */}
      <div className="hidden xmd:contents">
        {/* Khóa học — search server */}
        <div className="min-w-0 xmd:flex-none xmd:w-[134px]">
          <SearchSelect
            allowClear
            value={value.course}
            selectedItem={value.selectedCourse}
            placeholder={t("classroom.all_courses")}
            useList={CourseService.useCourseList}
            getLabel={(c) =>
              c?.code ? `${c.code} - ${c.name}` : (c?.name ?? `#${c?.id}`)
            }
            onChange={(id, item) =>
              onChange({ course: id, selectedCourse: item ?? null })
            }
          />
        </div>
        {/* Giáo viên — search server */}
        <div className="min-w-0 xmd:flex-none xmd:w-[136px]">
          <SearchSelect
            allowClear
            value={value.teacher}
            selectedItem={value.selectedTeacher}
            placeholder={t("classroom.all_teachers")}
            useList={TeacherService.useTeacherList}
            getLabel={(tc) => tc?.full_name ?? `#${tc?.id}`}
            onChange={(id, item) =>
              onChange({ teacher: id, selectedTeacher: item ?? null })
            }
          />
        </div>
        <div className="min-w-0 xmd:flex-none xmd:w-[160px]">
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
          allowClear
          className="min-w-0 xmd:flex-none xmd:min-w-0 xmd:w-[126px]"
          value={value.weekday}
          placeholder={t("classroom.all_weekdays")}
          options={weekdayOptions}
          onChange={(v) => onChange({ weekday: v })}
        />
        {/* Ca học — mobile: full-width 1 hàng (tránh ô trống vì 5 select lẻ) */}
        <FilterSelect
          allowClear
          className="col-span-2 xmd:col-span-1 min-w-0 xmd:flex-none xmd:min-w-0 xmd:w-[118px]"
          value={value.shift}
          placeholder={t("classroom.all_shifts")}
          options={shiftOptions}
          onChange={(v) => onChange({ shift: v })}
        />
      </div>
      {/* Sắp xếp luôn hiện (chung hàng search+Lọc trên mobile); Ngày khai giảng CHỈ desktop — mobile vào modal */}
      <div className="flex items-center gap-2 xmd:contents">
        <div className="hidden xmd:contents">
          <DateRangeFilter
            className="flex-1 xmd:flex-none xmd:w-[150px]"
            from={value.startFrom}
            to={value.startTo}
            placeholder={[t("common.from"), t("common.to")]}
            onChange={(startFrom, startTo) => onChange({ startFrom, startTo })}
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
