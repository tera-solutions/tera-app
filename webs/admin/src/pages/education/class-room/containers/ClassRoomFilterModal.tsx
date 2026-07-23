/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import { ClassRoomService, CourseService, TeacherService } from "@tera/modules";

/* Import: pages */
import ChipGroup from "@tera/components/dof/ChipGroup";
import FilterModalShell from "@tera/components/dof/FilterModalShell";
import DateRangeFilter from "_common/components/DateRangeFilter";
import SearchSelect from "_common/components/SearchSelect";
import UserSelect from "_common/components/UserSelect";

export interface ClassRoomFilterModalValue {
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

interface ClassRoomFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: ClassRoomFilterModalValue;
  onApply: (value: ClassRoomFilterModalValue) => void;
  /** Param nền (search + trạng thái + ngày khai giảng inline) để đếm preview đúng như list. */
  baseParams?: Record<string, any>;
}

const EMPTY: ClassRoomFilterModalValue = {
  course: "",
  selectedCourse: null,
  teacher: "",
  selectedTeacher: null,
  assignee: "",
  selectedAssignee: null,
  weekday: "",
  shift: "",
  startFrom: "",
  startTo: "",
};

/**
 * Modal "Bộ lọc nâng cao" cho DS lớp học (mobile): Khóa học/Giáo viên (SearchSelect) +
 * Nhân viên phụ trách (UserSelect) + Thứ học/Ca học (chip). Ngày khai giảng (date range) +
 * Sắp xếp KHÔNG nằm trong đây (vẫn inline).
 */
const ClassRoomFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  baseParams,
}: ClassRoomFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<ClassRoomFilterModalValue>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + trạng thái).
  const { data: previewData, isFetching } = ClassRoomService.useClassRoomList(
    {
      params: {
        ...baseParams,
        course_id: draft.course || undefined,
        teacher_id: draft.teacher || undefined,
        assignee_id: draft.assignee || undefined,
        weekday: draft.weekday || undefined,
        shift: draft.shift || undefined,
        start_from: draft.startFrom || undefined,
        start_to: draft.startTo || undefined,
        page: 1,
        per_page: 1,
      } as any,
    },
    { enabled: open },
  );
  const count: number | undefined = open
    ? (previewData?.data?.pagination?.total ?? undefined)
    : undefined;

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

  const label = (text: string) => (
    <p className="text-[13px] font-semibold text-gray-700">{text}</p>
  );

  return (
    <FilterModalShell
      open={open}
      onClose={onClose}
      onApply={() => onApply(draft)}
      onReset={() => setDraft(EMPTY)}
      count={count}
      countLoading={isFetching}
    >
      <div className="flex flex-col gap-2">
        {label(t("classroom.course"))}
        <SearchSelect
          allowClear
          value={draft.course}
          selectedItem={draft.selectedCourse}
          placeholder={t("classroom.all_courses")}
          useList={CourseService.useCourseList}
          getLabel={(c) =>
            c?.code ? `${c.code} - ${c.name}` : (c?.name ?? `#${c?.id}`)
          }
          onChange={(id, item) =>
            setDraft((d) => ({
              ...d,
              course: id,
              selectedCourse: item ?? null,
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        {label(t("classroom.teacher"))}
        <SearchSelect
          allowClear
          value={draft.teacher}
          selectedItem={draft.selectedTeacher}
          placeholder={t("classroom.all_teachers")}
          useList={TeacherService.useTeacherList}
          getLabel={(tc) => tc?.full_name ?? `#${tc?.id}`}
          onChange={(id, item) =>
            setDraft((d) => ({
              ...d,
              teacher: id,
              selectedTeacher: item ?? null,
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        {label(t("classroom.assignee"))}
        <UserSelect
          value={draft.assignee}
          selectedUser={draft.selectedAssignee}
          placeholder={t("classroom.all_assignees")}
          allowClear
          onChange={(id, user) =>
            setDraft((d) => ({
              ...d,
              assignee: id,
              selectedAssignee: user ?? null,
            }))
          }
        />
      </div>

      <ChipGroup
        label={t("classroom.weekday")}
        options={weekdayOptions}
        value={draft.weekday}
        onChange={(weekday) => setDraft((d) => ({ ...d, weekday }))}
      />
      <ChipGroup
        label={t("classroom.shift")}
        options={shiftOptions}
        value={draft.shift}
        onChange={(shift) => setDraft((d) => ({ ...d, shift }))}
      />

      <div className="flex flex-col gap-2">
        {label(t("classroom.open_date"))}
        <DateRangeFilter
          from={draft.startFrom}
          to={draft.startTo}
          placeholder={[t("common.from"), t("common.to")]}
          onChange={(startFrom, startTo) =>
            setDraft((d) => ({ ...d, startFrom, startTo }))
          }
        />
      </div>
    </FilterModalShell>
  );
};

export default ClassRoomFilterModal;
