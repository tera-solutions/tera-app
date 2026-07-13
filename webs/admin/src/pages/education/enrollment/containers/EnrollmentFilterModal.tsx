/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import {
  ClassRoomService,
  CourseService,
  EnrollmentService,
  StudentService,
} from "@tera/modules";

/* Import: pages */
import ChipGroup from "@tera/components/dof/ChipGroup";
import FilterModalShell from "@tera/components/dof/FilterModalShell";
import DateRangeFilter from "_common/components/DateRangeFilter";
import SearchSelect from "_common/components/SearchSelect";
import UserSelect from "_common/components/UserSelect";

export interface EnrollmentFilterModalValue {
  student: string;
  selectedStudent: any;
  classRoom: string;
  selectedClass: any;
  course: string;
  selectedCourse: any;
  sales: string;
  selectedSales: any;
  debt: string;
  dateFrom: string;
  dateTo: string;
}

interface EnrollmentFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: EnrollmentFilterModalValue;
  onApply: (value: EnrollmentFilterModalValue) => void;
  /** Param nền (search + trạng thái + ngày ghi danh inline) để đếm preview đúng như list. */
  baseParams?: Record<string, any>;
}

const EMPTY: EnrollmentFilterModalValue = {
  student: "",
  selectedStudent: null,
  classRoom: "",
  selectedClass: null,
  course: "",
  selectedCourse: null,
  sales: "",
  selectedSales: null,
  debt: "",
  dateFrom: "",
  dateTo: "",
};

const withCode = (item: any) =>
  item?.code ? `${item.code} - ${item.name}` : (item?.name ?? `#${item?.id}`);

/**
 * Modal "Bộ lọc nâng cao" cho DS ghi danh (mobile): Học viên/Lớp/Khóa học (SearchSelect) +
 * Nhân viên sale (UserSelect) + Công nợ (chip). Ngày ghi danh (date range) KHÔNG nằm trong
 * đây (vẫn inline). Ghi danh không có Sắp xếp.
 */
const EnrollmentFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  baseParams,
}: EnrollmentFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<EnrollmentFilterModalValue>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + trạng thái).
  const { data: previewData, isFetching } = EnrollmentService.useEnrollmentList(
    {
      params: {
        ...baseParams,
        student_id: draft.student || undefined,
        class_id: draft.classRoom || undefined,
        course_id: draft.course || undefined,
        sales_id: draft.sales || undefined,
        has_debt: draft.debt || undefined,
        enrolled_from: draft.dateFrom || undefined,
        enrolled_to: draft.dateTo || undefined,
        page: 1,
        per_page: 1,
      } as any,
    },
    { enabled: open },
  );
  const count: number | undefined = open
    ? (previewData?.data?.pagination?.total ?? undefined)
    : undefined;

  const debtOptions = [
    { value: "1", label: t("enrollment.has_debt") },
    { value: "0", label: t("enrollment.no_debt") },
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
        {label(t("enrollment.student"))}
        <SearchSelect
          allowClear
          value={draft.student}
          selectedItem={draft.selectedStudent}
          placeholder={t("enrollment.all_students")}
          useList={StudentService.useStudentList}
          getLabel={withCode}
          onChange={(id, item) =>
            setDraft((d) => ({
              ...d,
              student: id,
              selectedStudent: item ?? null,
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        {label(t("enrollment.class"))}
        <SearchSelect
          allowClear
          value={draft.classRoom}
          selectedItem={draft.selectedClass}
          placeholder={t("enrollment.all_classes")}
          useList={ClassRoomService.useClassRoomList}
          getLabel={withCode}
          onChange={(id, item) =>
            setDraft((d) => ({
              ...d,
              classRoom: id,
              selectedClass: item ?? null,
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        {label(t("enrollment.course"))}
        <SearchSelect
          allowClear
          value={draft.course}
          selectedItem={draft.selectedCourse}
          placeholder={t("enrollment.all_courses")}
          useList={CourseService.useCourseList}
          getLabel={withCode}
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
        {label(t("enrollment.sales"))}
        <UserSelect
          value={draft.sales}
          selectedUser={draft.selectedSales}
          placeholder={t("enrollment.all_sales")}
          allowClear
          onChange={(id, user) =>
            setDraft((d) => ({ ...d, sales: id, selectedSales: user ?? null }))
          }
        />
      </div>

      <ChipGroup
        label={t("enrollment.debt_amount")}
        options={debtOptions}
        value={draft.debt}
        onChange={(debt) => setDraft((d) => ({ ...d, debt }))}
      />

      <div className="flex flex-col gap-2">
        {label(t("enrollment.enrolled_at"))}
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

export default EnrollmentFilterModal;
