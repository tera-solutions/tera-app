/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: packages */
import FilterModalShell from "@tera/components/dof/FilterModalShell";

/* Import: services */
import { RoomService } from "@tera/modules";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";

interface Option {
  value: string;
  label: string;
}

export interface RoomFilterModalValue {
  branchId: string;
  roomType: string;
}

interface RoomFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: RoomFilterModalValue;
  onApply: (value: RoomFilterModalValue) => void;
  branchOptions: Option[];
  typeOptions: Option[];
  /** Param nền (search + trạng thái + sort) để đếm preview đúng như list. */
  baseParams?: Record<string, any>;
}

const EMPTY: RoomFilterModalValue = { branchId: "", roomType: "" };

/**
 * Modal "Bộ lọc nâng cao" cho DS phòng học (mobile): Chi nhánh + Loại phòng.
 * Chỉ Sắp xếp là vẫn inline (ngoài modal).
 */
const RoomFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  branchOptions,
  typeOptions,
  baseParams,
}: RoomFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<RoomFilterModalValue>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + trạng thái).
  const { data: previewData, isFetching } = RoomService.useRoomList(
    {
      params: {
        ...baseParams,
        branch_id: draft.branchId || undefined,
        room_type: draft.roomType || undefined,
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
      {/* Chi nhánh */}
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("room.branch")}
        </p>
        <FilterSelect
          allowClear
          value={draft.branchId}
          placeholder={t("common.all_branches")}
          options={branchOptions}
          onChange={(branchId) => setDraft((d) => ({ ...d, branchId }))}
        />
      </div>

      {/* Loại phòng */}
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("room.type")}
        </p>
        <FilterSelect
          allowClear
          value={draft.roomType}
          placeholder={t("room.all_types")}
          options={typeOptions}
          onChange={(roomType) => setDraft((d) => ({ ...d, roomType }))}
        />
      </div>
    </FilterModalShell>
  );
};

export default RoomFilterModal;
