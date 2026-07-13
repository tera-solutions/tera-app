/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import { BusinessService } from "@tera/modules";

/* Import: pages */
import FilterModalShell from "@tera/components/dof/FilterModalShell";
import DateRangeFilter from "_common/components/DateRangeFilter";
import UserSelect from "_common/components/UserSelect";

export interface BusinessFilterDraft {
  manager: string;
  selectedManager: any;
  createdFrom: string;
  createdTo: string;
}

interface BusinessFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: BusinessFilterDraft;
  onApply: (value: BusinessFilterDraft) => void;
  /** Param nền (search + tab trạng thái + ngày tạo inline) để đếm preview đúng như list. */
  baseParams?: Record<string, any>;
}

const EMPTY: BusinessFilterDraft = {
  manager: "",
  selectedManager: null,
  createdFrom: "",
  createdTo: "",
};

/**
 * Modal "Bộ lọc nâng cao" cho DS doanh nghiệp (mobile): Người quản lý (UserSelect).
 * Ngày tạo + Sắp xếp KHÔNG nằm trong đây (vẫn inline).
 */
const BusinessFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  baseParams,
}: BusinessFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<BusinessFilterDraft>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + tab trạng thái).
  const { data: previewData, isFetching } = BusinessService.useBusinessList(
    {
      params: {
        ...baseParams,
        manager_id: draft.manager || undefined,
        created_from: draft.createdFrom || undefined,
        created_to: draft.createdTo || undefined,
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
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("business.manager")}
        </p>
        <UserSelect
          value={draft.manager}
          selectedUser={draft.selectedManager}
          placeholder={t("business.all_managers")}
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

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("business.created_at")}
        </p>
        <DateRangeFilter
          from={draft.createdFrom}
          to={draft.createdTo}
          placeholder={[t("common.from"), t("common.to")]}
          onChange={(createdFrom, createdTo) =>
            setDraft((d) => ({ ...d, createdFrom, createdTo }))
          }
        />
      </div>
    </FilterModalShell>
  );
};

export default BusinessFilterModal;
