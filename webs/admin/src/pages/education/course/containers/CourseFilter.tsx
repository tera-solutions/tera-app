/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: pages */
import UserSelect from "_common/components/UserSelect";
import SortSelect from "_common/components/SortSelect";

export interface CourseFilterValue {
  durationMin: string;
  durationMax: string;
  priceMin: string;
  priceMax: string;
  createdBy: string;
  selectedCreatedBy: any;
  createdFrom: string;
  createdTo: string;
}

interface CourseFilterProps {
  value: CourseFilterValue;
  onChange: (patch: Partial<CourseFilterValue>) => void;
  sortBy: string;
  sortDir: "asc" | "desc";
  onSortChange: (sortBy: string, sortDir: "asc" | "desc") => void;
}

const RANGE_INPUT =
  "w-16 h-7 text-[13px] outline-none bg-transparent placeholder:text-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
const DATE_INPUT =
  "h-7 text-[13px] outline-none bg-transparent text-gray-700 [&::-webkit-calendar-picker-indicator]:opacity-60";

/**
 * Bộ lọc nhanh danh sách khóa học:
 * Thời lượng (number range) + Giá/buổi (currency range) + Người tạo (select) +
 * Ngày tạo (date range) + Sắp xếp. Inline — status tabs + search nằm ngoài (list page).
 */
const CourseFilter = ({
  value,
  onChange,
  sortBy,
  sortDir,
  onSortChange,
}: CourseFilterProps) => {
  const { t } = useTranslation();

  const sortOptions = [
    { value: "code", label: t("course.code") },
    { value: "name", label: t("course.name") },
    { value: "price_per_lesson", label: t("course.price_per_lesson") },
    { value: "created_at", label: t("course.created_at") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 xmd:flex-nowrap">
      {/* Thời lượng — number range */}
      <div className="flex items-center gap-1 h-9 px-2 border border-gray-300 rounded bg-white shrink-0">
        <span className="text-[12px] text-gray-400 shrink-0">
          {t("course.duration_label")}
        </span>
        <input
          type="number"
          value={value.durationMin}
          placeholder={t("common.from")}
          onChange={(e) => onChange({ durationMin: e.target.value })}
          className={RANGE_INPUT}
        />
        <span className="text-gray-300">–</span>
        <input
          type="number"
          value={value.durationMax}
          placeholder={t("common.to")}
          onChange={(e) => onChange({ durationMax: e.target.value })}
          className={RANGE_INPUT}
        />
      </div>

      {/* Giá/buổi — currency range */}
      <div className="flex items-center gap-1 h-9 px-2 border border-gray-300 rounded bg-white shrink-0">
        <span className="text-[12px] text-gray-400 shrink-0">
          {t("course.price_amount")}
        </span>
        <input
          type="number"
          value={value.priceMin}
          placeholder={t("common.from")}
          onChange={(e) => onChange({ priceMin: e.target.value })}
          className={`${RANGE_INPUT} w-20`}
        />
        <span className="text-gray-300">–</span>
        <input
          type="number"
          value={value.priceMax}
          placeholder={t("common.to")}
          onChange={(e) => onChange({ priceMax: e.target.value })}
          className={`${RANGE_INPUT} w-20`}
        />
        <span className="text-[12px] text-gray-400 shrink-0">₫</span>
      </div>

      {/* Người tạo — select user */}
      <div className="flex-1 min-w-[160px] xmd:flex-none xmd:w-auto xmd:min-w-[170px]">
        <UserSelect
          value={value.createdBy}
          selectedUser={value.selectedCreatedBy}
          placeholder={t("course.all_creators")}
          allowClear
          onChange={(id, user) =>
            onChange({ createdBy: id, selectedCreatedBy: user ?? null })
          }
        />
      </div>

      {/* Ngày tạo — date range */}
      <div className="flex items-center gap-1 h-9 px-2 border border-gray-300 rounded bg-white shrink-0">
        <span className="text-[12px] text-gray-400 shrink-0">
          {t("course.created_at")}
        </span>
        <input
          type="date"
          value={value.createdFrom}
          title={t("common.from")}
          onChange={(e) => onChange({ createdFrom: e.target.value })}
          className={DATE_INPUT}
        />
        <span className="text-gray-300">–</span>
        <input
          type="date"
          value={value.createdTo}
          title={t("common.to")}
          onChange={(e) => onChange({ createdTo: e.target.value })}
          className={DATE_INPUT}
        />
      </div>

      {/* Sắp xếp */}
      <div className="shrink-0">
        <SortSelect
          options={sortOptions}
          sortBy={sortBy}
          sortDir={sortDir}
          defaultDir="desc"
          placeholder={t("course.sort_by")}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};

export default CourseFilter;
