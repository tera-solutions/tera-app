/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import { StudentService } from "@tera/modules";

/* Import: pages */
import ChipGroup from "@tera/components/dof/ChipGroup";
import FilterModalShell from "@tera/components/dof/FilterModalShell";

interface Option {
  value: string;
  label: string;
}

export interface StudentFilterDraft {
  level: string;
  branch: string;
}

interface StudentFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: StudentFilterDraft;
  onApply: (value: StudentFilterDraft) => void;
  levelOptions: Option[];
  branchOptions: Option[];
  /** Param nền (search + tab trạng thái) để đếm preview đúng như list sẽ hiện. */
  baseParams?: Record<string, any>;
}

const EMPTY: StudentFilterDraft = { level: "", branch: "" };

/** Modal "Bộ lọc nâng cao" cho DS học viên (mobile): Trình độ + Chi nhánh dạng chip. */
const StudentFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  levelOptions,
  branchOptions,
  baseParams,
}: StudentFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<StudentFilterDraft>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + tab trạng thái).
  const { data: previewData, isFetching } = StudentService.useStudentList(
    {
      params: {
        ...baseParams,
        level_id: draft.level || undefined,
        branch_id: draft.branch || undefined,
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
      <ChipGroup
        label={t("student.level")}
        options={levelOptions}
        value={draft.level}
        onChange={(level) => setDraft((d) => ({ ...d, level }))}
      />
      <ChipGroup
        label={t("student.branch")}
        options={branchOptions}
        value={draft.branch}
        onChange={(branch) => setDraft((d) => ({ ...d, branch }))}
      />
    </FilterModalShell>
  );
};

export default StudentFilterModal;
