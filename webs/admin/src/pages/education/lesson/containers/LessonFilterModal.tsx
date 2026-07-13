/* Import: library */
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import {
  BranchService,
  ClassRoomService,
  LessonService,
  RoomService,
  TeacherService,
} from "@tera/modules";

/* Import: pages */
import ChipGroup from "@tera/components/dof/ChipGroup";
import FilterModalShell from "@tera/components/dof/FilterModalShell";
import DateRangeFilter from "_common/components/DateRangeFilter";

export interface LessonFilterModalValue {
  branch: string;
  classRoom: string;
  teacher: string;
  room: string;
  dateFrom: string;
  dateTo: string;
}

interface LessonFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: LessonFilterModalValue;
  onApply: (value: LessonFilterModalValue) => void;
  /** Param nền (search + trạng thái + ngày học inline) để đếm preview đúng như list. */
  baseParams?: Record<string, any>;
}

const EMPTY: LessonFilterModalValue = {
  branch: "",
  classRoom: "",
  teacher: "",
  room: "",
  dateFrom: "",
  dateTo: "",
};

/**
 * Modal "Bộ lọc nâng cao" cho DS bài học (mobile): Chi nhánh + Lớp + Giáo viên + Phòng (chip).
 * Ngày học (date range) + Sắp xếp KHÔNG nằm trong đây (vẫn inline). Options fetch lại cùng
 * query như `LessonFilter` — react-query cache theo key nên không tốn request thừa.
 */
const LessonFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  baseParams,
}: LessonFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<LessonFilterModalValue>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + trạng thái).
  const { data: previewData, isFetching } = LessonService.useLessonList(
    {
      params: {
        ...baseParams,
        branch_id: draft.branch || undefined,
        class_room_id: draft.classRoom || undefined,
        teacher_id: draft.teacher || undefined,
        room_id: draft.room || undefined,
        from_date: draft.dateFrom || undefined,
        to_date: draft.dateTo || undefined,
        page: 1,
        per_page: 1,
      } as any,
    },
    { enabled: open },
  );
  const count: number | undefined = open
    ? (previewData?.data?.pagination?.total ?? undefined)
    : undefined;

  const { data: branchData } = BranchService.useBranchList({
    params: { page: 1, per_page: 100, status: "active" } as any,
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
    params: { page: 1, per_page: 100, status: "active" } as any,
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

  return (
    <FilterModalShell
      open={open}
      onClose={onClose}
      onApply={() => onApply(draft)}
      onReset={() => setDraft(EMPTY)}
      count={count}
      countLoading={isFetching}
    >
      <ChipGroup
        label={t("lesson.branch")}
        options={branchOptions}
        value={draft.branch}
        onChange={(branch) => setDraft((d) => ({ ...d, branch }))}
      />
      <ChipGroup
        label={t("lesson.class")}
        options={classOptions}
        value={draft.classRoom}
        onChange={(classRoom) => setDraft((d) => ({ ...d, classRoom }))}
      />
      <ChipGroup
        label={t("lesson.teacher")}
        options={teacherOptions}
        value={draft.teacher}
        onChange={(teacher) => setDraft((d) => ({ ...d, teacher }))}
      />
      <ChipGroup
        label={t("lesson.room")}
        options={roomOptions}
        value={draft.room}
        onChange={(room) => setDraft((d) => ({ ...d, room }))}
      />

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("lesson.lesson_date")}
        </p>
        <DateRangeFilter
          from={draft.dateFrom}
          to={draft.dateTo}
          placeholder={[t("common.from"), t("common.to")]}
          onChange={(dateFrom, dateTo) =>
            setDraft((d) => ({ ...d, dateFrom, dateTo }))
          }
        />
      </div>
    </FilterModalShell>
  );
};

export default LessonFilterModal;
