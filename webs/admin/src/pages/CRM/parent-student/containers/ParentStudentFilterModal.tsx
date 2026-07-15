/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import { ParentStudentService } from "@tera/modules";

/* Import: pages */
import ChipGroup from "@tera/components/dof/ChipGroup";
import FilterModalShell from "@tera/components/dof/FilterModalShell";

interface Option {
  value: string;
  label: string;
}

export interface ParentStudentFilterDraft {
  branch: string;
  relation: string;
  primary: string;
  billing: string;
  studentStatus: string;
  parentStatus: string;
}

interface ParentStudentFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: ParentStudentFilterDraft;
  onApply: (value: ParentStudentFilterDraft) => void;
  branchOptions: Option[];
  relationOptions: Option[];
  boolOptions: Option[];
  studentStatusOptions: Option[];
  parentStatusOptions: Option[];
  /** Param nền (search) để đếm preview đúng như list sẽ hiện. */
  baseParams?: Record<string, any>;
}

const EMPTY: ParentStudentFilterDraft = {
  branch: "",
  relation: "",
  primary: "",
  billing: "",
  studentStatus: "",
  parentStatus: "",
};

/**
 * Modal "Bộ lọc nâng cao" cho DS quan hệ PH–HV (mobile): Chi nhánh + Quan hệ +
 * Người liên hệ chính + Người nhận hóa đơn + Trạng thái HV + Trạng thái PH — đều dạng chip.
 */
const ParentStudentFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  branchOptions,
  relationOptions,
  boolOptions,
  studentStatusOptions,
  parentStatusOptions,
  baseParams,
}: ParentStudentFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<ParentStudentFilterDraft>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search).
  const { data: previewData, isFetching } =
    ParentStudentService.useParentStudentList(
      {
        params: {
          ...baseParams,
          branch_id: draft.branch || undefined,
          relation: draft.relation || undefined,
          is_primary_contact: draft.primary || undefined,
          is_billing_contact: draft.billing || undefined,
          student_status: draft.studentStatus || undefined,
          parent_status: draft.parentStatus || undefined,
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
        label={t("parent_student.branch")}
        options={branchOptions}
        value={draft.branch}
        onChange={(branch) => setDraft((d) => ({ ...d, branch }))}
      />
      <ChipGroup
        label={t("parent_student.relation")}
        options={relationOptions}
        value={draft.relation}
        onChange={(relation) => setDraft((d) => ({ ...d, relation }))}
      />
      <ChipGroup
        label={t("parent_student.is_primary_contact")}
        options={boolOptions}
        value={draft.primary}
        onChange={(primary) => setDraft((d) => ({ ...d, primary }))}
      />
      <ChipGroup
        label={t("parent_student.is_billing_contact")}
        options={boolOptions}
        value={draft.billing}
        onChange={(billing) => setDraft((d) => ({ ...d, billing }))}
      />
      <ChipGroup
        label={t("parent_student.student_status")}
        options={studentStatusOptions}
        value={draft.studentStatus}
        onChange={(studentStatus) => setDraft((d) => ({ ...d, studentStatus }))}
      />
      <ChipGroup
        label={t("parent_student.parent_status")}
        options={parentStatusOptions}
        value={draft.parentStatus}
        onChange={(parentStatus) => setDraft((d) => ({ ...d, parentStatus }))}
      />
    </FilterModalShell>
  );
};

export default ParentStudentFilterModal;
