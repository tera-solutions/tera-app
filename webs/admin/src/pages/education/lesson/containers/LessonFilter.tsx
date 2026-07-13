/* Import: library */
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import {
  ClassRoomService,
  TeacherService,
  RoomService,
  BranchService,
} from "@tera/modules";

/* Import: pages */
import DateRangeFilter from "_common/components/DateRangeFilter";
import FilterSelect from "_common/components/FilterSelect";
import SortSelect from "_common/components/SortSelect";

export interface LessonFilterValue {
  branch: string;
  classRoom: string;
  teacher: string;
  room: string;
  dateFrom: string;
  dateTo: string;
}

interface LessonFilterProps {
  value: LessonFilterValue;
  onChange: (patch: Partial<LessonFilterValue>) => void;
  sortBy: string;
  sortDir: "asc" | "desc";
  onSortChange: (sortBy: string, sortDir: "asc" | "desc") => void;
}

/**
 * Bộ lọc nhanh danh sách bài học: Lớp học + Giáo viên + Ngày học (date range) +
 * Sắp xếp. Inline — status tabs + search nằm ngoài (list page).
 */
const LessonFilter = ({
  value,
  onChange,
  sortBy,
  sortDir,
  onSortChange,
}: LessonFilterProps) => {
  const { t } = useTranslation();

  const { data: branchData } = BranchService.useBranchList({
    params: { page: 1, per_page: 100, status: "active" },
  });
  const branchOptions = useMemo(
    () =>
      (branchData?.data?.items ?? []).map((b: any) => ({
        value: String(b.id),
        label: b.name,
      })),
    [branchData],
  );

  const { data: classData } = ClassRoomService.useClassRoomList({
    params: { page: 1, per_page: 100 },
  });
  const classOptions = useMemo(
    () =>
      (classData?.data?.items ?? []).map((c: any) => ({
        value: String(c.id),
        label: c.code ? `${c.name} (${c.code})` : c.name,
      })),
    [classData],
  );

  const { data: teacherData } = TeacherService.useTeacherList({
    params: { page: 1, per_page: 100 },
  });
  const teacherOptions = useMemo(
    () =>
      (teacherData?.data?.items ?? []).map((tc: any) => ({
        value: String(tc.id),
        label: tc.full_name ?? tc.name,
      })),
    [teacherData],
  );

  const { data: roomData } = RoomService.useRoomList({
    params: { page: 1, per_page: 100, status: "active" },
  });
  const roomOptions = useMemo(
    () =>
      (roomData?.data?.items ?? []).map((r: any) => ({
        value: String(r.id),
        label: r.room_code
          ? `${r.room_name ?? r.name} (${r.room_code})`
          : (r.room_name ?? r.name),
      })),
    [roomData],
  );

  const sortOptions = [
    { value: "lesson_no", label: t("lesson.lesson_no") },
    { value: "lesson_date", label: t("lesson.lesson_date") },
    { value: "created_at", label: t("lesson.created_at") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 xmd:flex-nowrap">
      {/* Các select — CHỈ hiện desktop (mobile đưa vào modal "Lọc") */}
      <div className="hidden xmd:contents">
        <FilterSelect
          allowClear
          className="flex-1 min-w-[130px] xmd:flex-none xmd:w-auto xmd:min-w-[140px]"
          value={value.branch}
          placeholder={t("common.all_branches")}
          options={branchOptions}
          onChange={(v) => onChange({ branch: v })}
        />
        <FilterSelect
          allowClear
          className="flex-1 min-w-[130px] xmd:flex-none xmd:w-auto xmd:min-w-[150px]"
          value={value.classRoom}
          placeholder={t("lesson.all_classes")}
          options={classOptions}
          onChange={(v) => onChange({ classRoom: v })}
        />
        <FilterSelect
          allowClear
          className="flex-1 min-w-[130px] xmd:flex-none xmd:w-auto xmd:min-w-[140px]"
          value={value.teacher}
          placeholder={t("lesson.all_teachers")}
          options={teacherOptions}
          onChange={(v) => onChange({ teacher: v })}
        />
        <FilterSelect
          allowClear
          className="flex-1 min-w-[130px] xmd:flex-none xmd:w-auto xmd:min-w-[140px]"
          value={value.room}
          placeholder={t("lesson.all_rooms")}
          options={roomOptions}
          onChange={(v) => onChange({ room: v })}
        />
      </div>

      {/* Sắp xếp luôn hiện (chung hàng search+Lọc trên mobile); Ngày học CHỈ desktop — mobile vào modal */}
      <div className="flex items-center gap-2 xmd:contents">
        <div className="hidden xmd:contents">
          <DateRangeFilter
            className="flex-1 xmd:flex-none xmd:w-[290px]"
            from={value.dateFrom}
            to={value.dateTo}
            placeholder={[t("lesson.lesson_date"), t("common.to")]}
            onChange={(dateFrom, dateTo) => onChange({ dateFrom, dateTo })}
          />
        </div>
        <div className="shrink-0">
          <SortSelect
            options={sortOptions}
            sortBy={sortBy}
            sortDir={sortDir}
            placeholder={t("lesson.sort_by")}
            defaultDir="asc"
            onChange={onSortChange}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonFilter;
