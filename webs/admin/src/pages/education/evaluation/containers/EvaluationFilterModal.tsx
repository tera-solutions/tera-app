/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: packages */
import FilterModalShell from "@tera/components/dof/FilterModalShell";
import ChipGroup from "@tera/components/dof/ChipGroup";

/* Import: services */
import { EvaluationService } from "@tera/modules";

/* Import: pages */
import { CLASSIFICATIONS, EVALUATION_TYPES } from "../_interface";

export interface EvaluationFilterModalValue {
  type: string;
  classification: string;
}

interface EvaluationFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: EvaluationFilterModalValue;
  onApply: (value: EvaluationFilterModalValue) => void;
  /** Param nền (search + trạng thái) để đếm preview đúng như list. */
  baseParams?: Record<string, any>;
}

const EMPTY: EvaluationFilterModalValue = { type: "", classification: "" };

/**
 * Modal "Bộ lọc nâng cao" cho DS đánh giá (mobile): Loại đánh giá + Xếp loại
 * (dạng chip). Desktop vẫn dùng 2 FilterSelect inline.
 */
const EvaluationFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  baseParams,
}: EvaluationFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<EvaluationFilterModalValue>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + trạng thái).
  const { data: previewData, isFetching } = EvaluationService.useEvaluationList(
    {
      params: {
        ...baseParams,
        evaluation_type: draft.type || undefined,
        classification: draft.classification || undefined,
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
        label={t("evaluation.type")}
        value={draft.type}
        options={EVALUATION_TYPES.map((v) => ({
          value: v,
          label: t(`evaluation.type_${v}`),
        }))}
        onChange={(type) => setDraft((d) => ({ ...d, type }))}
      />
      <ChipGroup
        label={t("evaluation.classification")}
        value={draft.classification}
        options={CLASSIFICATIONS.map((v) => ({
          value: v,
          label: t(`evaluation.class_${v}`),
        }))}
        onChange={(classification) => setDraft((d) => ({ ...d, classification }))}
      />
    </FilterModalShell>
  );
};

export default EvaluationFilterModal;
