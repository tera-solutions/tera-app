/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: services */
import { CourseService } from "@tera/modules";

/* Import: pages */
import DateRangeFilter from "_common/components/DateRangeFilter";
import FilterModalShell from "@tera/components/dof/FilterModalShell";
import UserSelect from "_common/components/UserSelect";

export interface CourseFilterModalValue {
  durationMin: string;
  durationMax: string;
  priceMin: string;
  priceMax: string;
  createdBy: string;
  selectedCreatedBy: any;
  createdFrom: string;
  createdTo: string;
}

interface CourseFilterModalProps {
  open: boolean;
  onClose: () => void;
  value: CourseFilterModalValue;
  onApply: (value: CourseFilterModalValue) => void;
  /** Param nền (search + trạng thái + ngày tạo inline) để đếm preview đúng như list. */
  baseParams?: Record<string, any>;
}

const EMPTY: CourseFilterModalValue = {
  durationMin: "",
  durationMax: "",
  priceMin: "",
  priceMax: "",
  createdBy: "",
  selectedCreatedBy: null,
  createdFrom: "",
  createdTo: "",
};

const NUM_INPUT =
  "flex-1 min-w-0 h-9 border border-gray-300 rounded px-2 text-[13px] outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

/**
 * Modal "Bộ lọc nâng cao" cho DS khóa học (mobile): Thời lượng (number range) +
 * Giá/buổi (currency range) + Người tạo (UserSelect) + Ngày tạo (date range).
 * Chỉ Sắp xếp là vẫn inline (ngoài modal).
 */
const CourseFilterModal = ({
  open,
  onClose,
  value,
  onApply,
  baseParams,
}: CourseFilterModalProps) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<CourseFilterModalValue>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Preview: đếm số bản ghi nếu áp dụng bộ lọc đang chọn (kèm search + trạng thái).
  const { data: previewData, isFetching } = CourseService.useCourseList(
    {
      params: {
        ...baseParams,
        duration_min: draft.durationMin || undefined,
        duration_max: draft.durationMax || undefined,
        price_min: draft.priceMin || undefined,
        price_max: draft.priceMax || undefined,
        created_by: draft.createdBy || undefined,
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
      {/* Thời lượng */}
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("course.duration_label")}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className={NUM_INPUT}
            placeholder={t("common.from")}
            value={draft.durationMin}
            onChange={(e) =>
              setDraft((d) => ({ ...d, durationMin: e.target.value }))
            }
          />
          <span className="text-gray-300">–</span>
          <input
            type="number"
            className={NUM_INPUT}
            placeholder={t("common.to")}
            value={draft.durationMax}
            onChange={(e) =>
              setDraft((d) => ({ ...d, durationMax: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Giá/buổi */}
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("course.price_amount")}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className={NUM_INPUT}
            placeholder={t("common.from")}
            value={draft.priceMin}
            onChange={(e) =>
              setDraft((d) => ({ ...d, priceMin: e.target.value }))
            }
          />
          <span className="text-gray-300">–</span>
          <input
            type="number"
            className={NUM_INPUT}
            placeholder={t("common.to")}
            value={draft.priceMax}
            onChange={(e) =>
              setDraft((d) => ({ ...d, priceMax: e.target.value }))
            }
          />
          <span className="shrink-0 text-[13px] text-gray-400">₫</span>
        </div>
      </div>

      {/* Người tạo */}
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("course.created_by")}
        </p>
        <UserSelect
          value={draft.createdBy}
          selectedUser={draft.selectedCreatedBy}
          placeholder={t("course.all_creators")}
          allowClear
          onChange={(id, user) =>
            setDraft((d) => ({
              ...d,
              createdBy: id,
              selectedCreatedBy: user ?? null,
            }))
          }
        />
      </div>

      {/* Ngày tạo (date range) — dùng RangePicker styled, không phải native */}
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-gray-700">
          {t("course.created_at")}
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

export default CourseFilterModal;
