/* Import: library */
import { useTranslation } from "react-i18next";
import moment from "moment";
import { RangePicker } from "tera-dls";

/* Import: pages */
import UserSelect from "_common/components/UserSelect";
import SortSelect from "_common/components/SortSelect";
import useIsMobile from "@tera/commons/hooks/useIsMobile";

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
  "h-7 text-[13px] outline-none bg-transparent placeholder:text-gray-300 flex-1 min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
const DATE_INPUT_MOBILE =
  "w-full min-w-0 h-9 border border-gray-300 bg-white px-2 text-[13px] rounded-[3px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 box-border";
const RANGE_BOX =
  "w-full xmd:w-auto xmd:shrink-0 flex items-center gap-1 h-9 px-2 border border-gray-300 rounded bg-white min-w-0";

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
  const isMobile = useIsMobile();

  const sortOptions = [
    { value: "code", label: t("course.code") },
    { value: "name", label: t("course.name") },
    { value: "price_per_lesson", label: t("course.price_per_lesson") },
    { value: "created_at", label: t("course.created_at") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 xmd:flex-nowrap">
      {/* Thời lượng — number range */}
      <div className={RANGE_BOX}>
        <span className="text-[12px] text-gray-400 shrink-0">
          {t("course.duration_label")}
        </span>
        <input
          type="number"
          value={value.durationMin}
          placeholder={t("common.from")}
          onChange={(e) => onChange({ durationMin: e.target.value })}
          className={`${RANGE_INPUT} xmd:flex-none xmd:w-12`}
        />
        <span className="text-gray-300 shrink-0">–</span>
        <input
          type="number"
          value={value.durationMax}
          placeholder={t("common.to")}
          onChange={(e) => onChange({ durationMax: e.target.value })}
          className={`${RANGE_INPUT} xmd:flex-none xmd:w-12`}
        />
      </div>

      {/* Giá/buổi — currency range */}
      <div className={RANGE_BOX}>
        <span className="text-[12px] text-gray-400 shrink-0">
          {t("course.price_amount")}
        </span>
        <input
          type="number"
          value={value.priceMin}
          placeholder={t("common.from")}
          onChange={(e) => onChange({ priceMin: e.target.value })}
          className={`${RANGE_INPUT} xmd:flex-none xmd:w-16`}
        />
        <span className="text-gray-300 shrink-0">–</span>
        <input
          type="number"
          value={value.priceMax}
          placeholder={t("common.to")}
          onChange={(e) => onChange({ priceMax: e.target.value })}
          className={`${RANGE_INPUT} xmd:flex-none xmd:w-16`}
        />
        <span className="text-[12px] text-gray-400 shrink-0">₫</span>
      </div>

      {/* Người tạo — select user */}
      <div className="w-full xmd:flex-none xmd:w-auto xmd:min-w-[170px]">
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

      {/* Ngày tạo + Sắp xếp — mobile: chung 1 hàng; desktop: tách inline */}
      <div className="w-full flex items-center gap-2 xmd:contents">
        {isMobile ? (
          <div className="flex flex-1 min-w-0 items-center gap-1.5">
            <input
              type="date"
              value={value.createdFrom}
              title={t("common.from")}
              max={value.createdTo || undefined}
              onChange={(e) => onChange({ createdFrom: e.target.value })}
              className={DATE_INPUT_MOBILE}
            />
            <span className="text-gray-400 shrink-0">→</span>
            <input
              type="date"
              value={value.createdTo}
              title={t("common.to")}
              min={value.createdFrom || undefined}
              onChange={(e) => onChange({ createdTo: e.target.value })}
              className={DATE_INPUT_MOBILE}
            />
          </div>
        ) : (
          <RangePicker
            className="shrink-0 w-[270px]"
            value={
              value.createdFrom && value.createdTo
                ? [
                    moment(value.createdFrom, "YYYY-MM-DD"),
                    moment(value.createdTo, "YYYY-MM-DD"),
                  ]
                : undefined
            }
            format="DD/MM/YYYY"
            placeholder={[t("course.created_at"), t("common.to")]}
            allowClear
            onChange={(dates: any) =>
              onChange({
                createdFrom: dates?.[0]
                  ? moment(dates[0]).format("YYYY-MM-DD")
                  : "",
                createdTo: dates?.[1]
                  ? moment(dates[1]).format("YYYY-MM-DD")
                  : "",
              })
            }
          />
        )}
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
    </div>
  );
};

export default CourseFilter;
