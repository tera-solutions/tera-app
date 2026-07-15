/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: packages */
import FilterModalShell from "@tera/components/dof/FilterModalShell";

/* Import: services */
import { AttendanceService, ClassSessionService } from "@tera/modules";

/* Import: pages */
import ClassSelect from "_common/components/ClassSelect";
import DateRangeFilter from "_common/components/DateRangeFilter";
import FilterSelect from "_common/components/FilterSelect";

interface Option {
  value: string;
  label: string;
}

export interface AttendanceFilterModalValue {
  classId: string;
  /** class object đang chọn — để ClassSelect hiện đúng nhãn khi chưa có trong 20 kết quả */
  selectedClass: any;
  sessionId: string;
  dateFrom: string;
  dateTo: string;
}

interface AttendanceFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: AttendanceFilterModalValue;
  onApply: (value: AttendanceFilterModalValue) => void;
  /** Param nền (search + trạng thái) để đếm preview đúng như list. */
  baseParams?: Record<string, any>;
}

const EMPTY: AttendanceFilterModalValue = {
  classId: "",
  selectedClass: null,
  sessionId: "",
  dateFrom: "",
  dateTo: "",
};

/**
 * Modal "Bộ lọc nâng cao" cho DS điểm danh (mobile): Lớp học + Buổi học
 * (phụ thuộc lớp — route lồng) + khoảng Ngày học. Chỉ Sắp xếp là vẫn inline.
 */
const AttendanceFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  baseParams,
}: AttendanceFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<AttendanceFilterModalValue>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Buổi học của lớp đang chọn trong draft (route lồng, chỉ fetch khi có lớp)
  const { data: sessionData } = ClassSessionService.useClassSessionList(
    { params: { class_id: draft.classId, page: 1, per_page: 100 } as any },
    { enabled: open && !!draft.classId },
  );
  // sort tăng dần theo session_no (backend trả desc mặc định)
  const sessionOptions: Option[] = [...(sessionData?.data?.items ?? [])]
    .sort((a: any, b: any) => (a.session_no ?? 0) - (b.session_no ?? 0))
    .map((s: any) => ({
      value: String(s.id),
      label: s.name
        ? `${s.name}${s.session_no ? ` (#${s.session_no})` : ""}`
        : `#${s.session_no ?? s.id}`,
    }));

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + trạng thái).
  const { data: previewData, isFetching } = AttendanceService.useAttendanceList(
    {
      params: {
        ...baseParams,
        class_id: draft.classId || undefined,
        session_id: draft.sessionId || undefined,
        date_from: draft.dateFrom || undefined,
        date_to: draft.dateTo || undefined,
        page: 1,
        per_page: 1,
      } as any,
    },
    { enabled: open },
  );
  const count: number | undefined = open
    ? (previewData?.data?.pagination?.total ?? undefined)
    : undefined;

  return (
    <FilterModalShell
      open={open}
      onClose={onClose}
      onApply={() => onApply(draft)}
      onReset={() => setDraft(EMPTY)}
      count={count}
      countLoading={isFetching}
    >
      {/* Lớp học */}
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("attendance.class")}
        </p>
        {/* Có ô tìm kiếm server (SearchSelect) — danh sách lớp có thể vượt 100 dòng */}
        <ClassSelect
          allowClear
          value={draft.classId}
          selectedClass={draft.selectedClass}
          placeholder={t("attendance.all_classes")}
          onChange={(classId, classRoom) =>
            // đổi lớp thì xoá buổi học đã chọn (buổi thuộc lớp cũ)
            setDraft((d) => ({
              ...d,
              classId,
              selectedClass: classRoom ?? null,
              sessionId: "",
            }))
          }
        />
      </div>

      {/* Buổi học — phụ thuộc lớp */}
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("attendance.session")}
        </p>
        <FilterSelect
          allowClear
          value={draft.sessionId}
          placeholder={
            draft.classId
              ? t("attendance.all_sessions")
              : t("attendance.select_class_first")
          }
          options={sessionOptions}
          onChange={(sessionId) => setDraft((d) => ({ ...d, sessionId }))}
          disabled={!draft.classId}
        />
      </div>

      {/* Ngày học (khoảng) */}
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("attendance.session_date")}
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

export default AttendanceFilterModal;
