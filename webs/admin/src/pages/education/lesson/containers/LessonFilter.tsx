/* Import: library */
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { RangePicker } from "tera-dls";

/* Import: services */
import {
  ClassRoomService,
  TeacherService,
  RoomService,
  BranchService,
} from "@tera/modules";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import SortSelect from "_common/components/SortSelect";
import useIsMobile from "@tera/commons/hooks/useIsMobile";

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

const DATE_INPUT_MOBILE =
  "w-full h-9 border border-gray-300 bg-white px-2 text-[13px] rounded-[3px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 box-border";

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
  const isMobile = useIsMobile();

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

      {/* Ngày học + Sắp xếp — mobile: chung 1 hàng; desktop: tách inline */}
      <div className="w-full flex items-center gap-2 xmd:contents">
        {isMobile ? (
          <div className="flex flex-1 min-w-0 items-center gap-1.5">
            <input
              type="date"
              className={DATE_INPUT_MOBILE}
              value={value.dateFrom}
              max={value.dateTo || undefined}
              onChange={(e) => onChange({ dateFrom: e.target.value })}
            />
            <span className="text-gray-400 shrink-0">→</span>
            <input
              type="date"
              className={DATE_INPUT_MOBILE}
              value={value.dateTo}
              min={value.dateFrom || undefined}
              onChange={(e) => onChange({ dateTo: e.target.value })}
            />
          </div>
        ) : (
          <RangePicker
            className="shrink-0 w-[290px]"
            value={
              value.dateFrom && value.dateTo
                ? [
                    moment(value.dateFrom, "YYYY-MM-DD"),
                    moment(value.dateTo, "YYYY-MM-DD"),
                  ]
                : undefined
            }
            format="DD/MM/YYYY"
            placeholder={[t("lesson.lesson_date"), t("common.to")]}
            allowClear
            onChange={(dates: any) =>
              onChange({
                dateFrom: dates?.[0]
                  ? moment(dates[0]).format("YYYY-MM-DD")
                  : "",
                dateTo: dates?.[1] ? moment(dates[1]).format("YYYY-MM-DD") : "",
              })
            }
          />
        )}
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
