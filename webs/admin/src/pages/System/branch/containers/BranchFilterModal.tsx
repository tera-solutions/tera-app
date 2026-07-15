/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import { BranchService } from "@tera/modules";

/* Import: pages */
import ChipGroup from "@tera/components/dof/ChipGroup";
import FilterModalShell from "@tera/components/dof/FilterModalShell";
import UserSelect from "_common/components/UserSelect";

interface Option {
  value: string;
  label: string;
}

export interface BranchFilterDraft {
  business: string;
  province: string;
  manager: string;
  selectedManager: any;
}

interface BranchFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: BranchFilterDraft;
  onApply: (value: BranchFilterDraft) => void;
  businessOptions: Option[];
  provinceOptions: Option[];
  /** Param nền (search + tab trạng thái) để đếm preview đúng như list sẽ hiện. */
  baseParams?: Record<string, any>;
}

const EMPTY: BranchFilterDraft = {
  business: "",
  province: "",
  manager: "",
  selectedManager: null,
};

/**
 * Modal "Bộ lọc nâng cao" cho DS chi nhánh (mobile): Doanh nghiệp + Tỉnh/Thành dạng chip,
 * Người quản lý giữ `UserSelect` (search server). Sắp xếp KHÔNG nằm trong đây.
 */
const BranchFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  businessOptions,
  provinceOptions,
  baseParams,
}: BranchFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<BranchFilterDraft>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + tab trạng thái).
  const { data: previewData, isFetching } = BranchService.useBranchList(
    {
      params: {
        ...baseParams,
        business_id: draft.business || undefined,
        province: draft.province || undefined,
        manager_id: draft.manager || undefined,
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
        label={t("branch.business")}
        options={businessOptions}
        value={draft.business}
        onChange={(business) => setDraft((d) => ({ ...d, business }))}
      />
      <ChipGroup
        label={t("branch.province")}
        options={provinceOptions}
        value={draft.province}
        onChange={(province) => setDraft((d) => ({ ...d, province }))}
      />
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("branch.manager")}
        </p>
        <UserSelect
          value={draft.manager}
          selectedUser={draft.selectedManager}
          placeholder={t("branch.all_managers")}
          allowClear
          onChange={(id, user) =>
            setDraft((d) => ({
              ...d,
              manager: id,
              selectedManager: user ?? null,
            }))
          }
        />
      </div>
    </FilterModalShell>
  );
};

export default BranchFilterModal;
