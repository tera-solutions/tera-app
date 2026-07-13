/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import { ParentService } from "@tera/modules";

/* Import: pages */
import ChipGroup from "@tera/components/dof/ChipGroup";
import FilterModalShell from "@tera/components/dof/FilterModalShell";

interface Option {
  value: string;
  label: string;
}

export interface ParentFilterDraft {
  relation: string;
  branch: string;
}

interface ParentFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: ParentFilterDraft;
  onApply: (value: ParentFilterDraft) => void;
  relationOptions: Option[];
  branchOptions: Option[];
  /** Param nền (search + tab trạng thái) để đếm preview đúng như list sẽ hiện. */
  baseParams?: Record<string, any>;
}

const EMPTY: ParentFilterDraft = { relation: "", branch: "" };

/** Modal "Bộ lọc nâng cao" cho DS phụ huynh (mobile): Quan hệ + Chi nhánh dạng chip. */
const ParentFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  relationOptions,
  branchOptions,
  baseParams,
}: ParentFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<ParentFilterDraft>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + tab trạng thái).
  const { data: previewData, isFetching } = ParentService.useParentList(
    {
      params: {
        ...baseParams,
        relation: draft.relation || undefined,
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
        label={t("parent.relation")}
        options={relationOptions}
        value={draft.relation}
        onChange={(relation) => setDraft((d) => ({ ...d, relation }))}
      />
      <ChipGroup
        label={t("parent.branch")}
        options={branchOptions}
        value={draft.branch}
        onChange={(branch) => setDraft((d) => ({ ...d, branch }))}
      />
    </FilterModalShell>
  );
};

export default ParentFilterModal;
